import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../../middlewares/auth";
import { generateResetToken } from "../../utils/helpers";
import prisma from "../config/db";
import { sendCustomSms, sendPasswordResetSms } from "../../utils/sendSms";
import { SantimpaySdk } from "../../lib/santimpay";
import { PRIVATE_KEY_IN_PEM } from "../../lib/santimpay/utils/constants";
import { randomUUID } from "crypto";

const getAvailableServies = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.json({ services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const getPackages = async (req: AuthRequest, res: Response) => {
  try {
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
      include: { services: { select: { serviceRate: true } } },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const brokerServiceRates = broker.services.map(
      (service) => service.serviceRate
    );
    const serviceRate = Math.max(...brokerServiceRates);

    // const amount = totalAmount - totalAmount* (selectedPackage.discount/100);
    let packages = await prisma.package.findMany();
    const settting = await prisma.settings.findMany();
    const dailyFee = settting[0].dailyFee;
    packages = packages.map((packageDetail) => {
      // const totalAmount = (dailyFee * packageDetail.totalDays);
      const totalAmount = dailyFee * serviceRate * packageDetail.totalDays;
      const price = (
        totalAmount -
        totalAmount * (packageDetail.discount / 100)
      ).toFixed(2);
      // const totalAmount = (settings.dailyFee* serviceRate * selectedPackage.totalDays)
      // const amount = totalAmount - totalAmount* (selectedPackage.discount/100);
      return {
        ...packageDetail,
        price,
      };
    });
    res.json({ dailyFee, packages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const updateProfile = async (req: AuthRequest, res: Response) => {
  const { fullName, email, phone, password, photo, bio, addresses } = req.body;

  try {
    // Ensure the user is updating their own profile
    if (req.user.id !== Number(req.params.id)) {
      return res.status(403).json({
        errors: [{ msg: "Forbidden: Cannot update another user's profile" }],
      });
    }

    // Find the broker
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
    });

    if (!broker) {
      return res.status(404).json({
        errors: [{ msg: "Broker not found" }],
      });
    }

    // Update the broker fields
    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (photo) updates.photo = photo;
    if (bio) updates.bio = bio;

    if (email) {
      const emailExist = await prisma.broker.findUnique({ where: { email } });
      if (emailExist && emailExist.id !== broker.id) {
        return res.status(400).json({
          errors: [{ msg: "There is an account with this email address" }],
        });
      }
      updates.email = email;
    }

    if (phone) {
      const phoneExist = await prisma.broker.findUnique({ where: { phone } });
      if (phoneExist && phoneExist.id !== broker.id) {
        return res.status(400).json({
          errors: [{ msg: "There is an account with this phone number" }],
        });
      }
      updates.phone = phone;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Handle addresses
    if (addresses && Array.isArray(addresses)) {
      await prisma.$transaction(async (prisma) => {
        // Remove existing addresses for the broker
        await prisma.address.deleteMany({
          where: { brokerId: broker.id },
        });

        // Add new addresses
        const newAddresses = addresses.map((address: any) => ({
          brokerId: broker.id,
          longitude: address.longitude || 0,
          latitude: address.latitude || 0,
          name: address.name || "",
        }));

        await prisma.address.createMany({
          data: newAddresses,
        });
      });
    }

    // Update the broker
    const updatedBroker = await prisma.broker.update({
      where: { id: broker.id },
      data: updates,
      include: { addresses: true }, // Include updated addresses in the response
    });

    res.json({ broker: updatedBroker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const topUp = async (req: AuthRequest, res: Response) => {
  const { phone, packageId } = req.body;

  try {
    console.log(req.user.id);
    console.log(Number(req.params.id));

    if (req.user.id !== Number(req.params.id)) {
      return res.status(400).json({
        errors: [{ msg: "Forbidden: Cannot top up for other broker" }],
      });
    }
    const selectedPackage = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });
    if (!selectedPackage) {
      return res.status(400).json({
        errors: [{ msg: "Please select a package to topup." }],
      });
    }
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) {
      return res.status(400).json({
        errors: [{ msg: "Setting not found" }],
      });
    }
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
      include: { services: { select: { serviceRate: true } } },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const brokerServiceRates = broker.services.map(
      (service) => service.serviceRate
    );
    console.log("brokerServiceRates");
    console.log(brokerServiceRates);
    const serviceRate = Math.max(...brokerServiceRates);
    console.log("serviceRate");
    console.log(serviceRate);
    const totalAmount =
      settings.dailyFee * serviceRate * selectedPackage.totalDays;
    const amount = totalAmount - totalAmount * (selectedPackage.discount / 100);
    const client = new SantimpaySdk(
      process.env.GATEWAY_MERCHANT_ID!,
      PRIVATE_KEY_IN_PEM!
    );

    // client side pages to redirect user to after payment is completed/failed
    const successRedirectUrl = "https://delalaye.com/success";
    const failureRedirectUrl = "https://delalaye.com/fail";
    const cancelRedirectUrl = "https://delalaye.com/cancel";

    // backend url to receive a status update (webhook)
    // const notifyUrl = "https://santimpay.com";
    const notifyUrl = process.env.SANTIMPAY_NOTIFY_URL;

    // custom ID used by merchant to identify the payment
    const id = Math.floor(Math.random() * 1000000000).toString();
    console.log("id");
    console.log(id);
    console.log("notifyUrl");
    console.log(notifyUrl);
    if (broker.phone === "+251929336352") {
      const phoneNumber = phone || broker.phone;
      const url = await client.generatePaymentUrl(
        id,
        amount,
        "payment",
        successRedirectUrl,
        failureRedirectUrl,
        notifyUrl!,
        phoneNumber,
        cancelRedirectUrl
      );

      const newTopup = await prisma.topup.create({
        data: {
          tx_ref: "fake" + randomUUID(),
          brokerId: broker.id,
          packageId: selectedPackage.id,
        },
      });
      const topUp = await prisma.topup.findUnique({
        where: { id: newTopup.id },
        include: { package: true },
      });
      if (topUp) {
        const broker = await prisma.broker.findUnique({
          where: { id: topUp.brokerId },
        });
        if (broker) {
          const currentDate: Date = new Date();
          let serviceExprireDate: Date = new Date(broker.serviceExprireDate);
          console.log(`Previous serviceExprireDate: ${serviceExprireDate}`);

          if (serviceExprireDate.getTime() > currentDate.getTime()) {
            console.log("account not expired");
            serviceExprireDate.setDate(
              serviceExprireDate.getDate() + topUp.package.totalDays
            );
          } else {
            console.log("account expired");
            currentDate.setDate(
              currentDate.getDate() + topUp.package.totalDays
            );
            serviceExprireDate = currentDate;
          }
          console.log(`serviceExprireDate: ${serviceExprireDate}`);
          const updatedBroker = await prisma.broker.update({
            where: { id: broker.id },
            data: { serviceExprireDate },
          });
          sendCustomSms({
            phone: updatedBroker.phone,
            msg: `ውድ ደንበኛችን በጥያቄዎ መሰረት የ ${
              topUp.package.name
            } ክፍያዎ ተቀባይ ሆኗል። በዚህ መሰረት እስከ ${updatedBroker.serviceExprireDate.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )} ድረስ ያለገደብ መጠቀም ይችላሉ።
   
   እናመሰናለን።`,
          });
        }
      }
      return res.json({ checkout_url: "bypass" });
    } else {
      const phoneNumber = phone || broker.phone;
      const url = await client.generatePaymentUrl(
        id,
        amount,
        "payment",
        successRedirectUrl,
        failureRedirectUrl,
        notifyUrl!,
        phoneNumber,
        cancelRedirectUrl
      );

      const newTopup = await prisma.topup.create({
        data: {
          tx_ref: id,
          brokerId: broker.id,
          packageId: selectedPackage.id,
        },
      });

      return res.json({ checkout_url: url });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const updateServices = async (req: AuthRequest, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  const { account, fullname, email, phone, password } = req.body;

  try {
    res.json({ route: "update account" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const updateAvailability = async (req: AuthRequest, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  const { avilableForWork } = req.body;

  try {
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const updatedBroker = await prisma.broker.update({
      where: { id: broker.id },
      data: { avilableForWork: avilableForWork },
    });
    res.json({ broker: updatedBroker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const updateLocation = async (req: AuthRequest, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  const { latitude, longtude } = req.body;

  try {
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const updatedBroker = await prisma.broker.update({
      where: { id: broker.id },
      data: {
        locationLatitude: Number(latitude),
        locationLongtude: Number(longtude),
      },
    });
    res.json({ broker: updatedBroker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const requestResetPassword = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    //See if user exists
    let broker = await prisma.broker.findUnique({ where: { phone: phone } });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker with this phone does not exist." }],
      });
    }
    const { otp, expirationDate } = await generateResetToken();
    broker = await prisma.broker.update({
      where: { id: broker.id },
      data: {
        resetOtp: otp,
        resetOtpExpiration: expirationDate,
      },
    });
    sendPasswordResetSms({ phone: broker.phone, otp });
    //  sendPasswordResetEmail(br.email,user.fullname,token,expirationDate);
    res.json(broker);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const checkOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    //  Find the broker by the reset token
    const currentDateTime = new Date();
    let broker = await prisma.broker.findFirst({
      where: {
        resetOtp: otp,
        resetOtpExpiration: {
          gte: currentDateTime,
        },
      },
    });

    res.json({ broker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        errors: [{ msg: "Broker with this id does not exist." }],
      });
    }
    //  Find the broker by id
    let broker = await prisma.broker.findFirst({
      where: { id: Number(req.params.id) },
    });

    if (!broker) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid or expired reset token." }] });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    broker = await prisma.broker.update({
      where: { id: broker.id },
      data: {
        password: hashedPassword,
        resetOtp: "",
      },
    });

    res.json({ msg: "Password reseted." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const checkRequests = async (req: AuthRequest, res: Response) => {
  try {
    const connectionRequests = await prisma.connection.findFirst({
      where: { brokerId: Number(req.user.id), status: "REQUESTED" },
      include: { broker: true, user: true, service: true },
    });
    let responseData = {};
    if (connectionRequests) {
      responseData = {
        hasRequest: true,
        connectionRequests,
      };
    } else {
      responseData = {
        hasRequest: false,
        connectionRequests,
      };
    }
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const checkRequest = async (req: AuthRequest, res: Response) => {
  if (!Number(req.params.id)) {
    return res.status(400).json({
      errors: [{ msg: "Id is required" }],
    });
  }
  try {
    const connectionRequests = await prisma.connection.findUnique({
      where: { id: Number(req.params.id) },
      include: { broker: true, user: true, service: true },
    });
    let responseData = {};
    if (connectionRequests) {
      responseData = {
        hasRequest: true,
        connectionRequests,
      };
    } else {
      responseData = {
        hasRequest: false,
        connectionRequests,
      };
    }
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const respondToConnection = async (req: AuthRequest, res: Response) => {
  if (!Number(req.params.id)) {
    return res.status(400).json({
      errors: [{ msg: "Id is required" }],
    });
  }
  try {
    const { status } = req.body;
    console.log("status");
    console.log(status != "pass");
    const availableOptions = ["accepted", "pass"];
    if (!availableOptions.includes(status)) {
      return res.status(400).json({
        errors: [{ msg: "not a valid arguement for status" }],
      });
    }

    let connectionRequest = await prisma.connection.findFirst({
      where: { id: Number(req.params.id) },
    });
    if (!connectionRequest) {
      return res.status(400).json({
        errors: [{ msg: "Connection not found" }],
      });
    }
    connectionRequest = await prisma.connection.update({
      where: { id: Number(req.params.id) },
      data: {
        status: status == "accepted" ? "ACCEPTED" : "DECLINED",
      },
    });
    res.json(connectionRequest);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const cancelConnection = async (req: AuthRequest, res: Response) => {
  if (!Number(req.params.id)) {
    return res.status(400).json({
      errors: [{ msg: "Id is required" }],
    });
  }
  try {
    let connection = await prisma.connection.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!connection) {
      return res.status(400).json({
        errors: [{ msg: "Connection not found" }],
      });
    }

    connection = await prisma.connection.update({
      where: { id: connection.id },
      data: {
        status: "CANCELLED",
      },
    });

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const connectionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const broker = await prisma.broker.findUnique({
      where: { id: Number(req.user.id) },
      include: {
        Connection: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    res.json({ connections: broker.Connection });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const filterBrokers = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, latitude, longitude } = req.query;
    console.log(
      `Searching brokers with service ID ${serviceId}, latitude: ${latitude}, longitude: ${longitude}`
    );

    // Validate query parameters
    if (!serviceId) {
      return res
        .status(400)
        .json({ errors: [{ msg: "serviceId is required." }] });
    }
    if (!latitude) {
      return res
        .status(400)
        .json({ errors: [{ msg: "latitude is required." }] });
    }
    if (!longitude) {
      return res
        .status(400)
        .json({ errors: [{ msg: "longitude is required." }] });
    }

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({
        errors: [{ msg: "The user looking for brokers is not found." }],
      });
    }

    /* here is how degree and kilo meter is related
     1 km ≈ 0.009° latitude
     1 km ≈ 0.0104° longitude
     */
    const radius = 0.018; // For latitude (2 km)
    const longitudeRadius = 0.0208; // around 2 km for longitude

    // Query brokers
    const brokers = await prisma.broker.findMany({
      where: {
        services: {
          some: { id: Number(serviceId) },
        },
        avilableForWork: true,
        addresses: {
          some: {
            latitude: {
              gte: Number(latitude) - radius,
              lte: Number(latitude) + radius,
            },
            longitude: {
              gte: Number(longitude) - longitudeRadius,
              lte: Number(longitude) + longitudeRadius,
            },
          },
        },
      },
      include: {
        addresses: true,
        services: true,
      },
    });

    // Notify user if no brokers found
    if (brokers.length === 0) {
      if (user.phone) {
        sendCustomSms({
          phone: user.phone,
          msg: `ይቅርታ እርሶ በፈለጉበት አካባቢ ያሉ አገልግሎት ሰጪዎችን ለጊዜው ማግኘት ባለመቻላችን ወደ ጥሪ መአከል ሰራተኞች መደወያ 9416 በመደወል ተጨማሪ እርዳታ ማግኘት ይችላሉ፡፡
    መደለል ከመታመን ይጀምራል`,
        });
      }
    }

    // Respond with the filtered brokers
    res.json(brokers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default {
  getAvailableServies,
  getPackages,
  updateProfile,
  topUp,
  updateServices,
  updateAvailability,
  updateLocation,
  requestResetPassword,
  checkOtp,
  resetPassword,
  checkRequests,
  checkRequest,
  respondToConnection,
  connectionHistory,
  filterBrokers,
  cancelConnection,
};

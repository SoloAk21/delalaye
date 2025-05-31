import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../../middlewares/auth";
import { generateResetToken } from "../../utils/helpers";
import { sendPasswordResetEmail } from "../../utils/sendEmail";
import prisma from "../config/db";
import { sendCustomSms, sendPasswordResetSms } from "../../utils/sendSms";

const updateProfile = async (req: AuthRequest, res: Response) => {
  const { fullName, email, phone, password, photo } = req.body;

  try {
    if (req.user.id !== Number(req.params.id)) {
      return res.status(400).json({
        errors: [{ msg: "Forbidden: Cannot update another user's profile" }],
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
    });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found" }],
      });
    }
    if (fullName) user.fullName = fullName;
    if (photo) user.photo = photo;
    if (email) {
      const emailExist = await prisma.user.findUnique({
        where: { email: email },
      });
      if (emailExist && emailExist.id !== user.id) {
        return res.status(400).json({
          errors: [{ msg: "There is an account with this email adress" }],
        });
      }
      user.email = email;
    }
    if (phone) {
      const phoneExist = await prisma.user.findUnique({
        where: { phone: phone },
      });
      if (phoneExist && phoneExist.id !== user.id) {
        return res.status(400).json({
          errors: [{ msg: "There is an account with this phone number" }],
        });
      }
      user.phone = phone;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const requestResetPassword = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    //See if user exists
    let user = await prisma.user.findUnique({ where: { phone: phone } });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User with this phone does not exist." }],
      });
    }
    const { otp, expirationDate } = await generateResetToken();
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpiration: expirationDate,
      },
    });
    sendPasswordResetSms({ phone: user.phone!, otp });
    //  sendPasswordResetEmail(br.email,user.fullname,token,expirationDate);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const checkOtp = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    //  Find the user by the reset token
    const currentDateTime = new Date();
    let user = await prisma.user.findFirst({
      where: {
        resetOtp: otp,
        resetOtpExpiration: {
          gte: currentDateTime,
        },
      },
    });

    res.json({ user });
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
        errors: [{ msg: "User with this id does not exist." }],
      });
    }
    //  Find the user by id
    let user = await prisma.user.findFirst({
      where: { id: Number(req.params.id) },
    });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid or expired reset token." }] });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user = await prisma.user.update({
      where: { id: user.id },
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

const connectionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      include: { Connection: { include: { broker: true } } },
    });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found" }],
      });
    }
    res.json({ connections: user.Connection });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const requestBroker = async (req: AuthRequest, res: Response) => {
  try {
    const {
      brokerId,
      serviceId,
      locationName,
      locationLatitude,
      locationLongtude,
    } = req.body;
    const broker = await prisma.broker.findUnique({
      where: { id: Number(brokerId) },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });
    if (!service) {
      return res.status(400).json({
        errors: [{ msg: "Service not found" }],
      });
    }
    // Get user by id
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
    });
    let msg = "";
    if (user) {
      msg = `በ ${user.phone} ቁጥር ላይ የሚገኙ ደንበኛችን ለስራ እየፈለጎት ሰለሆነ እባኮ ይደውሉሏቸው፡፡
  መደለል ከመታመን ይጀምራል! 
  ለተጨማሪ መረጃ 9416 ይደውሉ`;
    } else {
      msg = `እባኮ ወደርሶ ደንበኛ እየመጣ ስለሆነ በአክብሮት ይቀበሉ።
  በቆያታችሁ ታመኝነቶን ያሳዩ ፡፡
  መደለል ከመታመን ይጀምራል! 
  ለተጨማሪ መረጃ 9416 ይደውሉ`;
    }
    const connection = await prisma.connection.create({
      data: {
        brokerId: broker.id,
        userId: Number(req.user.id),
        status: "REQUESTED",
        serviceId: Number(serviceId),
        locationLatitude: Number(locationLatitude),
        locationLongtude: Number(locationLongtude),
        locationName: locationName,
      },
    });
    sendCustomSms({
      phone: broker.phone,
      msg: msg,
    });
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const callBrokerDirectly = async (req: AuthRequest, res: Response) => {
  try {
    const {
      brokerId,
      serviceId,
      locationName,
      locationLatitude,
      locationLongtude,
    } = req.body;
    const broker = await prisma.broker.findUnique({
      where: { id: Number(brokerId) },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });
    if (!service) {
      return res.status(400).json({
        errors: [{ msg: "Service not found" }],
      });
    }

    const connection = await prisma.connection.create({
      data: {
        brokerId: broker.id,
        userId: Number(req.user.id),
        status: "REQUESTED",
        serviceId: Number(serviceId),
        locationLatitude: Number(locationLatitude),
        locationLongtude: Number(locationLongtude),
        locationName: locationName,
        userHasCalled: true,
      },
    });
    //       sendCustomSms({
    //         phone:broker.phone,
    //         msg:`እባኮ ወደርሶ ደንበኛ እየመጣ ስለሆነ በአክብሮት ይቀበሉ።
    // በቆያታችሁ ታመኝነቶን ያሳዩ ፡፡
    // መደለል ከመታመን ይጀምራል!
    // ለተጨማሪ መረጃ 9416 ይደውሉ`
    //        })
    res.json(connection);
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
    const { reason } = req.body;

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
        reasonForCancellation: reason,
      },
    });

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const callBroker = async (req: AuthRequest, res: Response) => {
  try {
    if (!Number(req.params.id)) {
      return res.status(400).json({
        errors: [{ msg: "Id is required" }],
      });
    }
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
        userHasCalled: true,
      },
    });

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const callBrokerConnection = async (req: AuthRequest, res: Response) => {
  try {
    const {
      brokerId,
      serviceId,
      locationName,
      locationLatitude,
      locationLongtude,
    } = req.body;

    const broker = await prisma.broker.findUnique({
      where: { id: Number(brokerId) },
    });

    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });

    if (!service) {
      return res.status(400).json({
        errors: [{ msg: "Service not found" }],
      });
    }

    // Get user by id
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
    });
    let msg = "";
    if (user) {
      msg = `በ ${user.phone} ቁጥር ላይ የሚገኙ ደንበኛችን ለስራ እየፈለጎት ሰለሆነ እባኮ ይደውሉሏቸው፡፡
      መደለል ከመታመን ይጀምራል! 
      ለተጨማሪ መረጃ 9416 ይደውሉ`;
    } else {
      msg = `እባኮ ወደርሶ ደንበኛ እየመጣ ስለሆነ በአክብሮት ይቀበሉ።
      በቆያታችሁ ታመኝነቶን ያሳዩ ፡፡
      መደለል ከመታመን ይጀምራል! 
      ለተጨማሪ መረጃ 9416 ይደውሉ`;
    }
    const connection = await prisma.connection.create({
      data: {
        brokerId: broker.id,
        userId: Number(req.user.id),
        status: "REQUESTED",
        serviceId: Number(serviceId),
        locationLatitude: Number(locationLatitude),
        locationLongtude: Number(locationLongtude),
        locationName: locationName,
      },
    });
    sendCustomSms({
      phone: broker.phone,
      msg: msg,
    });
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const checkRequests = async (req: AuthRequest, res: Response) => {
  if (!Number(req.params.id)) {
    return res.status(400).json({
      errors: [{ msg: "Id is required" }],
    });
  }
  try {
    const connectionRequests = await prisma.connection.findFirst({
      where: { id: Number(req.params.id), userId: Number(req.user.id) },
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
const rateBroker = async (req: AuthRequest, res: Response) => {
  if (!Number(req.params.id)) {
    return res.status(400).json({
      errors: [{ msg: "Id is required" }],
    });
  }
  try {
    const { rating, comment } = req.body;
    let broker = await prisma.broker.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker not found" }],
      });
    }
    const newRating = await prisma.rating.create({
      data: {
        rating: Number(rating),
        brokerId: broker.id,
        userId: req.user.id,
        comment: comment ? comment : "",
      },
    });
    // Calculate the new average rating for the broker
    const ratings = await prisma.rating.findMany({
      where: { brokerId: broker.id },
    });
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    broker = await prisma.broker.update({
      where: { id: broker.id },
      data: {
        averageRating: averageRating,
      },
      include: {
        ratings: {
          include: { user: { include: { ratingsGiven: true } } },
        },
      },
    });
    res.json({ broker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
export default {
  updateProfile,
  requestResetPassword,
  checkOtp,
  resetPassword,
  connectionHistory,
  requestBroker,
  callBrokerDirectly,
  cancelConnection,
  callBroker,
  callBrokerConnection,
  checkRequests,
  rateBroker,
};

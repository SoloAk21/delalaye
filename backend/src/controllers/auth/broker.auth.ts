import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import slugify from "slugify";
import axios from "axios";
import { UserRequest } from "./staff.auth";

const loginGoogle = async (req: Request, res: Response) => {
  console.log(req.body);
  const { idToken } = req.body;
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${idToken}`,
      headers: {},
    };
    const response = await axios.request(config);
    console.log(response.data);
    const {
      id,
      email,
      verified_email,
      name,
      given_name,
      family_name,
      picture,
    } = response.data;
    const broker = await prisma.broker.findUnique({ where: { googleId: id } });
    let resoponse_json = {};
    if (broker) {
      resoponse_json = {
        userExists: true,
        broker: broker,
      };
      const payload = {
        user: {
          id: broker.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret!,
        // { expiresIn: "7d" },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.json({ token, broker, userExists: true });
        }
      );
    } else {
      resoponse_json = {
        userExists: false,
        id,
        email,
        verified_email,
        name,
        given_name,
        family_name,
        picture,
      };
      return res.json(resoponse_json);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const signupGoogle = async (req: Request, res: Response) => {
  console.log(req.body);
  const { idToken } = req.body;
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${idToken}`,
      headers: {},
    };
    const response = await axios.request(config);
    const {
      id,
      email,
      verified_email,
      name,
      given_name,
      family_name,
      picture,
    } = response.data;
    const broker = await prisma.broker.findUnique({ where: { googleId: id } });
    let resoponse_json = {};
    if (broker) {
      return res.status(400).json({
        errors: [{ msg: "Account with this email exist." }],
      });
    } else {
      // Function to convert an image URL to a base64-encoded string
      const imageUrlToBase64 = async (url: string): Promise<string> => {
        try {
          const response = await axios.get(url, {
            responseType: "arraybuffer",
          });
          const base64Encoded = Buffer.from(response.data, "binary").toString(
            "base64"
          );
          return base64Encoded;
        } catch (error) {
          throw new Error(`Error fetching and encoding image: ${error}`);
        }
      };
      let photo = await imageUrlToBase64(picture);

      resoponse_json = {
        id,
        email,
        verified_email,
        name,
        given_name,
        family_name,
        picture: photo,
      };
      return res.json(resoponse_json);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const signupBroker = async (req: Request, res: Response) => {
  const {
    photo,
    fullName,
    phone,
    email,
    password,
    services,
    hasCar,
    googleId,
    addresses,
  } = req.body;

  try {
    // Check if a broker with the same phone or email already exists
    let broker = await prisma.broker.findFirst({
      where: { OR: [{ phone }, { email }] },
    });
    if (broker) {
      return res.status(400).json({
        errors: [{ msg: "Broker with this phone/email already registered." }],
      });
    }

    // Process services: Existing and new services
    let serviceIds = services.filter((item: any) => !isNaN(item)).map(Number);
    let newServiceNames: string[] = services.filter((item: any) => isNaN(item));

    const checkForDuplicate = async (serviceName: string) => {
      const existingService = await prisma.service.findUnique({
        where: { slug: slugify(serviceName) },
      });
      if (existingService) {
        newServiceNames = newServiceNames.filter(
          (item) => item !== serviceName
        );
        serviceIds.push(existingService.id);
      }
    };

    for (const serviceName of newServiceNames) {
      await checkForDuplicate(serviceName);
    }

    const existingServices = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    let allServices:any;
    if (newServiceNames.length > 0) {
      const newServices = newServiceNames.map((name) =>
        prisma.service.create({
          data: {
            name,
            description: "",
            slug: slugify(name),
            serviceRate: 50,
          },
        })
      );
      const createdServices = await prisma.$transaction(newServices);
      allServices = existingServices.concat(createdServices);
    } else {
      allServices = existingServices;
    }

    // Encrypt password if provided
    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create broker and addresses in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the broker
      const newBroker = await tx.broker.create({
        data: {
          fullName,
          password: hashedPassword,
          phone,
          photo: photo || "",
          hasCar,
          bio: "",
          services: {
            connect: allServices.map((service:any) => ({ id: service.id })),
          },
          ...(googleId && { googleId }),
          ...(email && { email }),
        },
      });

      // Create addresses if provided 
      if (addresses && addresses.length > 0) {
        const addressData = addresses.map((address: any) => ({
          brokerId: newBroker.id,
          longitude: address.longitude,
          latitude: address.latitude,
          name: address.name,
        }));
        await tx.address.createMany({
          data: addressData,
        });
      }

      return newBroker;
    });

    // Generate JWT token
    const payload = { user: { id: result.id } };
    jwt.sign(payload, process.env.jwtSecret!, (err, token) => {
      if (err) throw err;
      res.json({ token, broker: result });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const loginBroker = async (req: Request, res: Response) => {
  console.log("req.body");
  console.log(req.body);
  const { phone, password } = req.body;
  try {
    //See if a Building with that admin exists
    let user = await prisma.broker.findUnique({
      where: { phone: phone },
      include: {
        services: true,
      },
    });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "broker not found" }],
      });
    }

    // console.log(user);
    //Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: "Password not correct." }],
      });
    }

    //Return jsonwebtoken :to login the user
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret!,
      // { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
const getBroker = async (req: UserRequest, res: Response) => {
  try {
    console.log(req.user);
    let broker = await prisma.broker.findUnique({
      where: { id: Number(req?.user?.id) },
      include: {
        Topup: {
          include: { package: true },
        },
        addresses: true, // get addresses
      },
    });
    res.json({ broker });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
export default {
  signupBroker,
  loginBroker,
  loginGoogle,
  signupGoogle,
  getBroker,
};

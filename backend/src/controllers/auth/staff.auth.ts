import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

const loginStaff = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("email", email);

  try {
    //See if a Building with that admin exists
    let user = await prisma.staff.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "Staff not found" }],
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
        role: user.role,
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

export interface UserRequest extends Request {
  user?: {
    id?: string;
  };
}

const getStaff = async (req: UserRequest, res: Response) => {
  try {
    let user = await prisma.staff.findUnique({
      where: { id: Number(req?.user?.id) },
    });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default { loginStaff, getStaff };

import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import slugify from "slugify";
import { AuthRequest } from "../../middlewares/auth";
import prisma from "../config/db";

const initializeSettings = async (req: AuthRequest, res: Response) => {
  try {
    const newSetting = await prisma.settings.create({
      data: {
        dailyFee: 50,
      },
    });
    res.json(newSetting);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findMany();
    const packages = await prisma.package.findMany();

    if (!settings || settings.length === 0) {
      return res.status(404).json({ error: "No settings found. Please initialize settings first." });
    }

    res.json({ dailyFee: settings[0].dailyFee, packages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const updateSettings = async (req: Request, res: Response) => {
  try {
    const { dailyFee } = req.body;

    const settings = await prisma.settings.update({
      where: { id: 1 },
      data: {
        dailyFee: Number(dailyFee),
      },
    });

    res.json({ dailyFee: settings.dailyFee });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default { initializeSettings, getSettings, updateSettings };
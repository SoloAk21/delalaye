import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import NodeCache from "node-cache";

const prisma = new PrismaClient();
const cache = new NodeCache({ stdTTL: 3600 }); // 1-hour TTL

const getBranding = async (req: Request, res: Response) => {
  try {
    const cached = cache.get("branding");
    if (cached) return res.json(cached);

    const branding = await prisma.branding.findUnique({ where: { id: 1 } });
    if (!branding) {
      return res.status(404).json({ errors: [{ msg: "Branding not found" }] });
    }

    cache.set("branding", branding);
    res.json(branding);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const updateBranding = async (req: Request, res: Response) => {
  try {
    console.log("Request files:", req.files); // Debug log
    const { primaryColor, secondaryColor, darkModeDefault } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];

    const fileMap: { [key: string]: Express.Multer.File } = {};
    files.forEach((file) => {
      const fieldname = file.fieldname.trim(); // Trim whitespace from fieldname
      fileMap[fieldname] = file;
    });

    const brandingData = {
      logoLight: fileMap["logoLight"]
        ? `/uploads/${fileMap["logoLight"].filename}`
        : undefined,
      logoDark: fileMap["logoDark"]
        ? `/uploads/${fileMap["logoDark"].filename}`
        : undefined,
      primaryColor,
      secondaryColor,
      darkModeDefault: darkModeDefault === "true" || darkModeDefault === true,
    };

    if (
      !brandingData.primaryColor ||
      !brandingData.secondaryColor ||
      brandingData.darkModeDefault === undefined
    ) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Missing required fields" }] });
    }

    const branding = await prisma.branding.upsert({
      where: { id: 1 },
      update: brandingData,
      create: { id: 1, ...brandingData },
    });

    cache.del("branding");
    res.json(branding);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.meta?.target);
      return res.status(400).json({ errors: [{ msg: "Database error" }] });
    }
    console.error("Update branding error:", error);
    res.status(500).send("Server Error");
  }
};

export default { getBranding, updateBranding };

import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import NodeCache from "node-cache";
import cloudinary from "../../config/cloudinary";
import { log } from "console";

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
    const { primaryColor, secondaryColor, darkModeDefault } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];
    console.log("Received files:", files);

    const uploadToCloudinary = async (fileBuffer: Buffer, filename: string) => {
      return new Promise<{ url: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "branding", public_id: filename },
            (error, result) => {
              if (error) reject(error);
              else resolve({ url: result?.secure_url || "" });
            }
          )
          .end(fileBuffer);
      });
    };

    const fileMap: { [key: string]: string } = {};

    for (const file of files) {
      const trimmedFieldName = file.fieldname.trim();
      const uploaded = await uploadToCloudinary(
        file.buffer,
        trimmedFieldName + "-" + Date.now()
      );
      fileMap[trimmedFieldName] = uploaded.url;
    }

    const brandingData = {
      logoLight: fileMap["logoLight"],
      logoDark: fileMap["logoDark"],
      primaryColor,
      secondaryColor,
      darkModeDefault: darkModeDefault === "true" || darkModeDefault === true,
    };

    console.log("Branding data to update:", brandingData);

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
    console.error("Update branding error:", error);
    res.status(500).send("Server Error");
  }
};

export default { getBranding, updateBranding };

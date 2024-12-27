import { Request, Response } from "express";
import AdsModel from "../models/adsSchema"; // Adjust the path as per your folder structure

export const getAds = async (req: Request, res: Response) => {
  try {
    const files = await AdsModel.find(); // Fetch all records
    res.status(200).json({ code: 200, status: "SUCCESS", ads: files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ code: 500, status: "FAILED", message: "An error occurred while fetching files" });
  }
};

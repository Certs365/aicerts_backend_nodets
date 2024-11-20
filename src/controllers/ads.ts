import { Request, Response } from 'express';

import { uploadToS3 } from '../utils/uploadS3';
import AdsModel, { IFile } from "../models/adsSchema";

export const uploadFileS3 = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).send({ status: "FAILED", message: "File is required" });
    return;
  }

  console.log(file)
 






  try {
    const keyName=`dev/${file.originalname}`
    // Upload file to S3
    const s3Url = await uploadToS3(file,keyName)

    // Save file details to MongoDB
    const fileData: IFile = await AdsModel.create({
      filename: file.originalname,
      extension: file.originalname.split('.').pop(),
      s3KeyName:keyName ,
      s3Url: s3Url,
    });

   

    res.status(200).send({
      status: "SUCCESS",
      message: "File uploaded successfully",
      fileDetails: fileData,
    });
  } catch (error:any) {
    console.error("Error uploading file:", error);

    

    res.status(500).send({
      status: "FAILED",
      message: "An error occurred while uploading the file",
      error: error.message,
    });
  }
};

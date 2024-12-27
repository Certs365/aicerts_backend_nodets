import mongoose, { Schema, Document } from "mongoose";

// Define the interface
export interface IFile extends Document {
  filename: string;
  extension: string;
  s3KeyName: string;
  s3Url: string;
}

// Define the schema
const fileSchema: Schema<IFile> = new Schema(
  {
    filename: { type: String, required: true },
    extension: { type: String, required: true },
    s3KeyName: { type: String, required: true },
    s3Url: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the model
const AdsModel=mongoose.model<IFile>("Ad", fileSchema);
export default AdsModel

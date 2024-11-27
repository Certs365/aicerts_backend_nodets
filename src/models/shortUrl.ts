import mongoose, { Document, Schema } from "mongoose";

export interface ShortUrl extends Document {
    email: string;
    certificateNumber: string;
    url: string;
}

const ShortUrlSchema = new Schema<ShortUrl>({
    email: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    url: { type: String, required: true },
});

export const ShortUrl = mongoose.model<ShortUrl>("ShortUrl", ShortUrlSchema);

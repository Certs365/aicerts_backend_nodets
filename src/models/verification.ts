import mongoose, { Document, Schema } from "mongoose";

export interface Verification extends Document {
    email: string;
    code: number;
    verified: boolean;
}

const VerificationSchema = new Schema<Verification>({
    email: { type: String, required: true },
    code: { type: Number, required: true },
    verified: { type: Boolean, required: true },
});

export const Verification = mongoose.model<Verification>("Verification", VerificationSchema);

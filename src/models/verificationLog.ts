import mongoose, { Document, Schema } from "mongoose";

export interface VerificationLog extends Document {
    email: string;
    issuerId: string;
    courses: object;
    lastUpdate: Date;
}

const VerificationLogSchema = new Schema<VerificationLog>({
    email: { type: String, required: true },
    issuerId: { type: String, required: true },
    courses: { type: Object, required: true },
    lastUpdate: { type: Date, default: Date.now },
});

export const VerificationLog = mongoose.model<VerificationLog>("VerificationLog", VerificationLogSchema);

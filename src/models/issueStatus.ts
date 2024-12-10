import mongoose, { Document, Schema } from "mongoose";

export interface IssueStatus extends Document {
    email: string;
    issuerId: string;
    batchId?: number | null;
    transactionHash: string;
    certificateNumber: string;
    name: string;
    course: string;
    expirationDate: string;
    certStatus: number;
    blockchainOption: number;
    lastUpdate: Date;
}

const IssueStatusSchema = new Schema<IssueStatus>({
    email: { type: String, required: true },
    issuerId: { type: String, required: true },
    batchId: { type: Number, default: null },
    transactionHash: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    expirationDate: { type: String, required: true },
    certStatus: { type: Number, required: true },
    blockchainOption: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now },
});

export const IssueStatus = mongoose.model<IssueStatus>("IssueStatus", IssueStatusSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface BatchIssues extends Document {
    issuerId: string;
    batchId: number;
    proofHash: string[];
    encodedProof: string;
    transactionHash: string;
    certificateHash: string;
    certificateNumber: string;
    name: string;
    course: string;
    grantDate: string;
    expirationDate: string;
    certificateStatus: number;
    issueDate: Date;
    positionX: number;
    positionY: number;
    qrSize: number;
    width?: number;
    height?: number;
    qrOption: number;
    blockchainOption: number;
    url?: string;
}

const BatchIssuesSchema = new Schema<BatchIssues>({
    issuerId: { type: String, required: true },
    batchId: { type: Number, required: true },
    proofHash: { type: [String], required: true },
    encodedProof: { type: String, required: true },
    transactionHash: { type: String, required: true },
    certificateHash: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    grantDate: { type: String, required: true },
    expirationDate: { type: String, required: true },
    certificateStatus: { type: Number, required: true, default: 1 },
    issueDate: { type: Date, default: Date.now },
    positionX: { type: Number, default: 0 },
    positionY: { type: Number, default: 0 },
    qrSize: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    qrOption: { type: Number, default: 0 },
    blockchainOption: { type: Number, default: 0 },
    url: { type: String },
});

export const BatchIssues = mongoose.model<BatchIssues>("BatchIssues", BatchIssuesSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface DynamicIssues extends Document {
    issuerId: string;
    transactionHash: string;
    certificateHash: string;
    certificateNumber: string;
    name?: string;
    certificateStatus: number;
    certificateFields: object;
    issueDate: Date;
    width?: number;
    height?: number;
    positionX: number;
    positionY: number;
    qrSize: number;
    qrOption: number;
    blockchainOption: number;
    url?: string;
    type: string;
}

const DynamicIssuesSchema = new Schema<DynamicIssues>({
    issuerId: { type: String, required: true },
    transactionHash: { type: String, required: true },
    certificateHash: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    name: { type: String },
    certificateStatus: { type: Number, required: true },
    certificateFields: { type: Object, required: true },
    issueDate: { type: Date, default: Date.now },
    width: { type: Number },
    height: { type: Number },
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    qrSize: { type: Number, required: true },
    qrOption: { type: Number, required: true },
    blockchainOption: { type: Number, default: 0 },
    url: { type: String },
    type: { type: String, required: true },
});

export const DynamicIssues = mongoose.model<DynamicIssues>("DynamicIssues", DynamicIssuesSchema);

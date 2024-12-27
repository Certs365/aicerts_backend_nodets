import mongoose, { Document, Schema } from "mongoose";

export interface Issues extends Document {
    issuerId: string;
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
    type: string | null;
}

const IssuesSchema = new Schema<Issues>({
    issuerId: { type: String, required: true },
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
    type: { type: String, default: null },
});

export const Issues = mongoose.model<Issues>("Issues", IssuesSchema);

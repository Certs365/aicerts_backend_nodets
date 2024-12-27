import mongoose, { Document, Schema } from "mongoose";

export interface DynamicParams extends Document {
    email: string;
    positionX: number;
    positionY: number;
    qrSide: number;
    pdfWidth: number;
    pdfHeight: number;
    paramStatus: boolean;
    modifiedDate: Date;
}

const DynamicParamsSchema = new Schema<DynamicParams>({
    email: { type: String, required: true },
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    qrSide: { type: Number, required: true },
    pdfWidth: { type: Number, required: true },
    pdfHeight: { type: Number, required: true },
    paramStatus: { type: Boolean, required: true },
    modifiedDate: { type: Date, default: Date.now },
});

export const DynamicParams = mongoose.model<DynamicParams>("DynamicParams", DynamicParamsSchema);

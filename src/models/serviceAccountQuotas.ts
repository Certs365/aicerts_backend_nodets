import mongoose, { Document, Schema } from "mongoose";

export interface ServiceAccountQuotas extends Document {
    issuerId: string;
    serviceId: string;
    limit: number;
    status?: boolean;
    createdAt: Date;
    updatedAt: Date;
    resetAt: Date;
}

const ServiceAccountQuotasSchema = new Schema<ServiceAccountQuotas>({
    issuerId: { type: String, required: true },
    serviceId: { type: String, required: true },
    limit: { type: Number, default: 0 },
    status: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetAt: { type: Date, default: Date.now },
});

export const ServiceAccountQuotas = mongoose.model<ServiceAccountQuotas>(
    "ServiceAccountQuotas",
    ServiceAccountQuotasSchema
);

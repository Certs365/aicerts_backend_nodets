import mongoose, { Document, Schema } from "mongoose";

export interface CredentialTemplate extends Document {
    email: string;
    designFields: object;
    url?: string;
    dimentions?: object;
}

const CredentialTemplateSchema = new Schema<CredentialTemplate>({
    email: { type: String, required: true },
    designFields: { type: Object, required: true },
    url: { type: String },
    dimentions: { type: Object },
});

export const CredentialTemplate = mongoose.model<CredentialTemplate>(
    "CredentialTemplate",
    CredentialTemplateSchema
);

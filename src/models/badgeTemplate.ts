import mongoose, { Document, Schema } from "mongoose";

export interface BadgeTemplate extends Document {
    email: string;
    designFields: object;
    url?: string;
    dimentions?: object;
    attributes?: object;
    title?: string;
    subTitle?: string;
    description?: string;
}

const BadgeTemplateSchema = new Schema<BadgeTemplate>({
    email: { type: String, required: true },
    designFields: { type: Object, required: true },
    url: { type: String },
    dimentions: { type: Object },
    attributes: { type: Object },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
});

export const BadgeTemplate = mongoose.model<BadgeTemplate>("BadgeTemplate", BadgeTemplateSchema);

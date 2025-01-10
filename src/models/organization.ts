import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
    mainOrgName: string;
    aliases: [string];
}

const OrganizationSchema = new Schema<IOrganization>({
    mainOrgName: { type: String, unique: true },
    aliases: [String],
});

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
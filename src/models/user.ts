import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  organization: string;
  email: string;
  password: string;
  issuerId: string;
  approved?: boolean;
  status?: number;
  address?: string;
  country?: string;
  organizationType?: string;
  city?: string;
  zip?: string;
  industrySector?: string;
  state?: string;
  websiteLink?: string;
  phoneNumber?: string;
  designation?: string;
  username?: string;
  rejectedDate?: Date | null;
  invoiceNumber: number;
  batchSequence: number;
  transactionFee: number;
  qrPreference: number;
  blockchainPreference: number;
  certificatesIssued?: number;
  certificatesRenewed?: number;
  approveDate?: Date | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  issuerId: { type: String, required: true },
  approved: { type: Boolean },
  status: { type: Number },
  address: { type: String },
  country: { type: String },
  organizationType: { type: String },
  city: { type: String },
  zip: { type: String },
  industrySector: { type: String },
  state: { type: String },
  websiteLink: { type: String },
  phoneNumber: { type: String },
  designation: { type: String },
  username: { type: String },
  rejectedDate: { type: Date, default: null },
  invoiceNumber: { type: Number, default: 0 },
  batchSequence: { type: Number, default: 0 },
  transactionFee: { type: Number, default: 0 },
  qrPreference: { type: Number, default: 0 },
  blockchainPreference: { type: Number, default: 0 },
  certificatesIssued: { type: Number },
  certificatesRenewed: { type: Number },
  approveDate: { type: Date, default: null },
});

export const User = mongoose.model<IUser>('User', UserSchema);

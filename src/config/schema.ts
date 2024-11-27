import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Admin document
interface Admin extends Document {
  name: string;
  email: string;
  password: string;
  status: boolean;
}

// Define the interface for ServerDetails document
interface ServerDetails extends Document {
  email: string;
  serverName: string | null;
  serverEndpoint: string | null;
  serverAddress: string | null;
  serverStatus: boolean;
  lastUpdate: Date;
}

// Define the interface for ServiceAccountQuotas document
interface ServiceAccountQuotas extends Document {
  issuerId: string;
  serviceId: string;
  limit: number;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetAt: Date;
}

// Define the interface for User document
interface User extends Document {
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

// Define the interface for Issues document
interface Issues extends Document {
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
  url?: string;
  type: string | null;
}

// Define the interface for BatchIssues document
interface BatchIssues extends Document {
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
  url?: string;
}

// Define the interface for IssueStatus document
interface IssueStatus extends Document {
  email: string;
  issuerId: string;
  batchId?: number | null;
  transactionHash: string;
  certificateNumber: string;
  name: string;
  course: string;
  expirationDate: string;
  certStatus: number;
  lastUpdate: Date;
}

// Define the interface for DynamicIssues document
interface DynamicIssues extends Document {
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
  url?: string;
  type: string;
}

// Define the interface for DynamicBatchIssues document
interface DynamicBatchIssues extends Document {
  issuerId: string;
  batchId: number;
  proofHash: string[];
  encodedProof: string;
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
  url?: string;
  type: string;
}

// Define the interface for Verification document
interface Verification extends Document {
  email: string;
  code: number;
  verified: boolean;
}

// Define the interface for VerificationLog document
interface VerificationLog extends Document {
  email: string;
  issuerId: string;
  courses: object;
  lastUpdate: Date;
}

// Define the interface for ShortUrl document
interface ShortUrl extends Document {
  email: string;
  certificateNumber: string;
  url: string;
}

// Define the interface for CredentialTemplate document
interface CredentialTemplate extends Document {
  email: string;
  designFields: object;
  url?: string;
  dimentions?: object;
}

// Define the interface for BadgeTemplate document
interface BadgeTemplate extends Document {
  email: string;
  designFields: object;
  url?: string;
  dimentions?: object;
  attributes?: object;
  title?: string;
  subTitle?: string;
  description?: string;
}

// Define the interface for DynamicParams document
interface DynamicParams extends Document {
  email: string;
  positionX: number;
  positionY: number;
  qrSide: number;
  pdfWidth: number;
  pdfHeight: number;
  paramStatus: boolean;
  modifiedDate: Date;
}

// Define Mongoose models with their respective interfaces
const Admin = mongoose.model<Admin>('Admin', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true },
}));

const Verification = mongoose.model<Verification>('Verification', new Schema({
  email: { type: String, required: true },
  code: { type: Number, required: true },
  verified: { type: Boolean, required: true },
}));

const ServiceAccountQuotas = mongoose.model<ServiceAccountQuotas>('ServiceAccountQuotas', new Schema({
  issuerId: { type: String, required: true },
  serviceId: { type: String, required: true },
  limit: { type: Number, default: 0 },
  status: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetAt: { type: Date, default: Date.now }
}));

const User = mongoose.model<User>('User', new Schema({
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
  approveDate: { type: Date, default: null }
}));

const Issues = mongoose.model<Issues>('Issues', new Schema({
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
  url: { type: String },
  type: { type: String, default: null }
}));

// Continue for other schemas...

export {
  Admin,
  Verification,
  ServiceAccountQuotas,
  User,
  Issues,
  BatchIssues,
  IssueStatus,
  DynamicIssues,
  DynamicBatchIssues,
  VerificationLog,
  ShortUrl,
  BadgeTemplate
};

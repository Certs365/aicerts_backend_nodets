import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Email document
interface SEmail extends Document {
  seqno: string;
  plan: string;
  amount: string;
  textBody: string;
  htmlBody: string;
  subject: string;
  from: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Define the schema
const emailSchema = new Schema<SEmail>({
  seqno: {
    type: String,
    required: true,
    unique: true, // Ensuring seqno is unique
  },
  plan: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: false,
  },
  textBody: {
    type: String,
    required: true,
  },
  htmlBody: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // Default status is 'pending'
  },
});

const SupportEmail = mongoose.model<SEmail>('SupportEmail', emailSchema);

export default SupportEmail;

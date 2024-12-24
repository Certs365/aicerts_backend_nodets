import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSubscriptionPlan extends Document {
  email: string;
  issuerId: string;
  subscriptionPlanTitle: string[];
  purchasedDate: Date[];
  subscriptionFee: number[];
  subscriptionDuration: number[];
  allocatedCredentials: number[];
  currentCredentials: number[];
  status: boolean;
}

const UserSubscriptionPlanSchema: Schema = new Schema({
  email: { type: String, required: true },
  issuerId: { type: String, required: true },
  subscriptionPlanTitle: { type: [String], required: true },
  purchasedDate: { type: [Date], default: Date.now },
  subscriptionFee: { type: [Number] },
  subscriptionDuration: { type: [Number], default: 30 },
  allocatedCredentials: { type: [Number] },
  currentCredentials: { type: [Number] },
  status: { type: Boolean, default: true },
});

// Create the model
export const UserSubscriptionPlan = mongoose.model<IUserSubscriptionPlan>(
  'UserSubscriptionPlan',
  UserSubscriptionPlanSchema
);

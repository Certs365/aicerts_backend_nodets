import mongoose, { Document, Schema } from 'mongoose';

interface ISubscriptionPlan extends Document {
  code: string;
  title: string;
  subheader: string;
  fee: number;
  limit: number;
  rate: number;
  validity: number;
  lastUpdate: Date;
  status: boolean;
}

const SubscriptionPlanSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subheader: { type: String, required: true },
  fee: { type: Number, required: true },
  limit: { type: Number, required: true },
  rate: { type: Number, required: true },
  validity: { type: Number, default: 30 },
  lastUpdate: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
});

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
);

export { SubscriptionPlan, ISubscriptionPlan };

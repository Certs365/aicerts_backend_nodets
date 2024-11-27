import mongoose, { Document, Schema } from "mongoose";

export interface Admin extends Document {
    name: string;
    email: string;
    password: string;
    status: boolean;
}

const AdminSchema = new Schema<Admin>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
});

export const Admin = mongoose.model<Admin>("Admin", AdminSchema);

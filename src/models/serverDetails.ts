import mongoose, { Document, Schema } from "mongoose";

export interface ServerDetails extends Document {
    email: string;
    serverName: string | null;
    serverEndpoint: string | null;
    serverAddress: string | null;
    serverStatus: boolean;
    lastUpdate: Date;
}

const ServerDetailsSchema = new Schema<ServerDetails>({
    email: { type: String, required: true },
    serverName: { type: String, default: null },
    serverEndpoint: { type: String, default: null },
    serverAddress: { type: String, default: null },
    serverStatus: { type: Boolean, required: true },
    lastUpdate: { type: Date, default: Date.now },
});

export const ServerDetails = mongoose.model<ServerDetails>("ServerDetails", ServerDetailsSchema);

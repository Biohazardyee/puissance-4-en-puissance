import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./users.js";

export interface IRoom extends Document {
    name: string;
    password: string;
    player1?: Schema.Types.ObjectId;
    player2?: Schema.Types.ObjectId;
    status: 'waiting' | 'playing' | 'finished';
}

const RoomSchema = new Schema<IRoom>({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
    player1: { type: Schema.Types.ObjectId, ref: 'users' },
    player2: { type: Schema.Types.ObjectId, ref: 'users' }
});

export const Room = mongoose.model<IRoom>("Room", RoomSchema);

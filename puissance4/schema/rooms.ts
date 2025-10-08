import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./users.js";

export interface IRoom extends Document {
    name: string;
    password: string;
    player1?: IUser['_id'];
    player2?: IUser['_id'];
    status: 'waiting' | 'playing' | 'finished';
}

const RoomSchema = new Schema<IRoom>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
    player1: { type: Schema.Types.ObjectId, ref: 'users' },
    player2: { type: Schema.Types.ObjectId, ref: 'users' }
});

export const Room = mongoose.model<IRoom>("Room", RoomSchema);

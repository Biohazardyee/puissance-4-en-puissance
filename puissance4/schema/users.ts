import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    roles: string[];
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, sparse: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["user"] }
});

export const User = mongoose.model<IUser>("User", UserSchema);

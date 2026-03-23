import mongoose from 'mongoose';


export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });



const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
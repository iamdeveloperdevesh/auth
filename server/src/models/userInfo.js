import mongoose from "mongoose";

const UserInfoSchema = new mongoose.Schema(
    {
        UserName: {
            type: String,
            required: true,
            unique: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        Password: {
            type: String,
            required: true,
            min: 8,
        },
        isRemember: {
            type: Boolean,
            default: false,
        },
        BlockStatus: {
            type: Boolean,
            default: false,
        },
        JoinedOn: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const UserInfo = mongoose.model('UserInfo', UserInfoSchema, 'UserInfo');
export default UserInfo;

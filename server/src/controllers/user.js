import UserInfo from "../models/userInfo.js";
import mongoose from "mongoose";

/* Fetch User */
export const getUserDetails = async (req, res) => {

    const { UserId } = req.body;
    const userid = req.params.id && parseInt(req.params.id);
    const selectedcol = 'UserName Email JoinedOn';

    const userDetails = !userid
        ? (await UserInfo.find().select(selectedcol))
        : (UserInfo.findOne({ _id: userid }).select(selectedcol));

    res.status(201).json({
        success: true,
        userInfo: userDetails
    });
};

/* Delete User */
export const deleteUser = async (req, res) => {

    const { UserId, id } = req.body;

    const { ObjectId } = mongoose.Types;
    const userid = new ObjectId(id);


    //Checking the records exists or not
    const user = await UserInfo.findOne({ _id: userid });
    if (user) {
        const deleteUser = await UserInfo.deleteOne({ _id: userid });
        if (deleteUser.deletedCount > 0) {
            return res.status(201).json({
                success: true,
                message: "User Deleted Successfully!!!"
            });
        }
    }
    res.status(400).json({ errors: "User Doesn't Exists" });
};
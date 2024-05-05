import UserInfo from "../models/userInfo.js";
import bcrypt from "bcrypt";
import { validationResult } from 'express-validator';
import { createTokenOptions } from "../utils/cookies.js";
import generateTokens from "../utils/token.js";

/* REGISTER USER */
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        const { UserName, Email, Password } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(Password, salt);

        const newUser = new UserInfo({
            UserName,
            Email,
            Password: passwordHash,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            userInfo: {
                Email: newUser.Email
            },
            message: "Register Successfully!!!"
        });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        const { Email, Password, IsRemember = false } = req.body;
        const user = await UserInfo.findOne({ Email });
        if (!user) return res.status(400).json({ message: "Email does not exist." });

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect Password." });

        const { authToken } = await generateTokens(user);

        await UserInfo.findOneAndUpdate(
            { _id: user._id },
            { isRemember: IsRemember },
        );
        
        if (IsRemember) {
            res.cookie('token', authToken, {
                ...createTokenOptions(),
                maxAge: 30 * 24 * 60 * 60 * 1000 //for 30 days
            });

        }

        res.status(200).json({
            success: true,
            message: "Login Successfully!!!",
            token: authToken,
        });
    }
};

/* LOGGING OUT */
export const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.token) return res.sendStatus(204); //No content

    res.clearCookie('token', createTokenOptions());
    res.status(200).json({
        success: true,
        message: "Logout Successfully!!!",
    });
}
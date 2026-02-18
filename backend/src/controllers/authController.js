import User from "../models/User.js";
import { asyncHandler } from "../utils/handler.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already registered!" });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

 
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message: "User created successfully!",
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
});



export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials!" });
    }


    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

export const logout = asyncHandler(async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully!" });
});

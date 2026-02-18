import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyJWT = async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Please login first!" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists!" });
        }

        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        return res.status(401).json({ message: "Invalid token!" });
    }
};

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/connectDB.js";
import User from "../models/User.js";

const Admin = async () => {
    try {

        const name = process.env.ADMIN_NAME || "Admin";
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
        }

        await connectDB(process.env.DB_URI);

        let user = await User.findOne({ email });

        if (user) {
   
            if (user.role !== "admin") {
                user.role = "admin";
                await user.save();
                console.log(`User promoted to admin: ${email}`);
            } else {
                console.log(`Admin already exists: ${email}`);
            }

            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log(`Admin created successfully: ${email}`);

    } catch (error) {
        console.error("Admin seeding failed:", error.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

Admin();

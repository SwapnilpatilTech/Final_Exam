import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Auth API is working" });
});


router.post("/register", register);
router.post("/login", login);

router.post("/logout", verifyJWT, logout);


export default router;

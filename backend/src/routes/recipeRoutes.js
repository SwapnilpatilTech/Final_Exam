import express from "express";
import {
    createReceipe,
    getAllReceipe,
    getAllReceipeAdmin,
    updateReceipe
} from "../controllers/recipeController.js";

import { verifyJWT } from "../middleware/verifyJWT.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();


router.get("/", (_req, res) => {
    res.status(200).json({ message: "Recipe API is working!" });
});


router.get("/my", verifyJWT, getAllReceipe);

router.post("/", verifyJWT, requireRole("user", "admin"), createReceipe);

router.put("/:id", verifyJWT, requireRole("user", "admin"), updateReceipe);

router.get("/admin/all", verifyJWT, requireRole("admin"), getAllReceipeAdmin);


export default router;

import Recipe from "../models/Recipe.js";
import { asyncHandler } from "../utils/handler.util.js";


export const getAllReceipe = asyncHandler(async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    const recipes = await Recipe.find({ user: req.user._id });

    res.status(200).json({
        message: "Your recipes fetched successfully!",
        recipes
    });
});

export const getAllReceipeAdmin = asyncHandler(async (req, res) => {

    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admins only!" });
    }

    const recipes = await Recipe
        .find()
        .populate("user", "name email role");

    res.status(200).json({
        message: "All recipes fetched successfully!",
        recipes
    });
});

export const createReceipe = asyncHandler(async (req, res) => {

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required!" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    const recipe = await Recipe.create({
        title,
        content,
        user: req.user._id
    });

    res.status(201).json({
        message: "Recipe created successfully!",
        recipe
    });
});

export const updateReceipe = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Recipe ID required!" });
    }

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required!" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found!" });
    }

    const isOwner = recipe.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "You are not allowed to update this recipe!"
        });
    }

    recipe.title = title;
    recipe.content = content;

    await recipe.save();

    res.status(200).json({
        message: "Recipe updated successfully!",
        recipe
    });
});

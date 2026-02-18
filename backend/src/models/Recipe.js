import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
{
    title: {
        type: String,
        trim: true
    },

    content: {
        type: String,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{ timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;

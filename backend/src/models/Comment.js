import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
    text: {
        type: String,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receipe"
    }

},
{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

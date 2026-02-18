import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,  
        trim: true
    },

    password: {
        type: String
    },

    role: {
        type: String,
        default: "user"
    },

    refreshToken: {
        type: String,
        default: null
    }
},
{ timestamps: true }
);

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
};

const User = mongoose.model("User", userSchema);
export default User;

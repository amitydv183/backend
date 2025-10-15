const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"], // only allow these two
        default: "user"          // default is normal user
    }
}, { timestamps: true });  // adds createdAt, updatedAt

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;

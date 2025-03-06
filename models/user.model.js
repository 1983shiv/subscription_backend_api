import mongoose from "mongoose";

const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [2, "Name must be at least 2 characters long"],
        maxLength: [50, "Name must be at most 50 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [2, "Email must be at least 2 characters long"],
        maxLength: [255, "Email must be at most 255 characters long"],
        match: [emailRegex, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength: [1024, "Password must be at most 1024 characters long"]
    }
},  {timestamp: true})

export default mongoose.model("User", userSchema);
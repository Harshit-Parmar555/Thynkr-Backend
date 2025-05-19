// Importing required modules
import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide Username"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      unique: true,
    },
    profilePicture: {
      type: String,
      required: [true, "Please Provide Avatar"],
      trim: true,
    },
  },
  { timestamps: true }
);

// User model
export const User = mongoose.model("user", userSchema);

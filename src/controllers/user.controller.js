import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID not provided" });
    }

    // Populate `ideas` and `user` inside `idess`
    const user = await User.findById(id)
      .populate({
        path: "ideas",
        populate: {
          path: "user",
        },
      })
      .exec();

    // If user not found, return error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

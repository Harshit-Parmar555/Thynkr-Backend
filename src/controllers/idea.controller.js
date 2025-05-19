// Import necessary modules and models
import mongoose from "mongoose";

// Models Import
import { Idea } from "../models/idea.model.js";
import { User } from "../models/user.model.js";

// Image operation functions Import
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from "../utils/imageOperation.js";

export const fetchAllIdeas = async (req, res) => {
  try {
    const { query } = req.query;

    if (query) {
      const ideas = await Idea.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
        .populate("user")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Ideas fetched successfully",
        ideas,
      });
    }

    const ideas = await Idea.find().populate("user").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Ideas fetched successfully",
      ideas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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

// Add idea controller
export const postIdea = async (req, res) => {
  try {
    const { title, description, pitch, category } = req.body;

    if (!title || !description || !pitch || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Cover image is required" });
    }

    // Upload the image
    const coverImgURL = await uploadImageToFirebase(req.file);
    if (!coverImgURL) {
      return res
        .status(500)
        .json({ success: false, message: "Error in cover image upload" });
    }

    // Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new startup entry
      const newIdea = new Idea({
        title,
        description,
        pitch,
        category,
        coverImage: coverImgURL,
        user: req.user._id, // req.user is already set by middleware
      });

      await newIdea.save({ session });

      // Find the user and update their starts array
      const user = await User.findById(req.user._id).session(session);
      if (!user) {
        throw new Error("User not found");
      }
      user.ideas.push(newIdea);
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Idea Added Successfully",
        idea: newIdea,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete start controller
export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Id not provided" });
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      return res
        .status(404)
        .json({ success: false, message: "Idea not found" });
    }

    // Ensure only the owner can delete
    if (idea.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    // Remove from user's startups list
    await User.findByIdAndUpdate(req.user._id, { $pull: { ideas: id } });

    deleteImageFromFirebase(idea.coverImage); // Delete image from Firebase
    await idea.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Idea deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

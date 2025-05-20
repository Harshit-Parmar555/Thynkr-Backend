import express from "express";
import {
  fetchAllIdeas,
  postIdea,
  deleteIdea,
} from "../controllers/idea.controller.js";
import { protectedRoute } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const ideaRouter = express.Router();

ideaRouter.get("/fetch-all-ideas", fetchAllIdeas);
ideaRouter.post(
  "/post-idea",
  protectedRoute,
  upload.single("coverImage"),
  postIdea
);
ideaRouter.delete("/delete-idea/:id", protectedRoute, deleteIdea);

export default ideaRouter;

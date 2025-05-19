import express from "express";
import { fetchAllIdeas } from "../controllers/idea.controller.js";

const ideaRouter = express.Router();

ideaRouter.get("/fetch-all-ideas", fetchAllIdeas);

export default ideaRouter;

// Importing necessary modules
import express from "express";
import { signup, logout, checkAuth } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

// User router
const authRouter = express.Router();

// Exporting the user router
export default authRouter;

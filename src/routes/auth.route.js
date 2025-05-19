// Importing necessary modules
import express from "express";
import { signup } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

// User router
const authRouter = express.Router();

authRouter.post("/signup", signup);

// Exporting the user router
export default authRouter;

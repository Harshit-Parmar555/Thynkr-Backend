// Importing necessary modules
import express from "express";
import { signup, logout } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

// User router
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.get("logout", logout);

// Exporting the user router
export default authRouter;

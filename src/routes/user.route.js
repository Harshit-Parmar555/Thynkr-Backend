import express from "express";
import { fetchUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/fetch-user/:id", fetchUser);

export default userRouter;

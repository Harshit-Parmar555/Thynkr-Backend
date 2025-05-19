// Description: This is the main entry point of the application. It sets up the server, connects to the database, and defines the routes for the application.

// Dotenv configuration
import dotenv from "dotenv";
dotenv.config();

// Importing required modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./src/utils/logger.js";

// Database connect function
import { connectDb } from "./src/db/connect.js";

// Express app
const app = express();

// Frontend URL
const FRONTEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : process.env.FRONTEND_URL;

// Middlewares
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Logger for api's
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Port
const PORT = process.env.PORT || 4000;

// Routes
import authRouter from "./src/routes/auth.route.js";

app.use("/api/v1/auth", authRouter);

// App started
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

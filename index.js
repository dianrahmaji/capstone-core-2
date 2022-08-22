import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

import createSocketServer from "./socket/index.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import teamRoute from "./routes/teamRoute.js";
import folderRoute from "./routes/folderRoute.js";
import documentRoute from "./routes/documentRoute.js";
import chatRoute from "./routes/chatRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// servers initalization
const httpServer = createServer(app);
createSocketServer(httpServer);

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Hi mom!",
  });
});

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/team", teamRoute);
app.use("/api/folder", folderRoute);
app.use("/api/document", documentRoute);
app.use("/api/chat", chatRoute);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`.yellow.bold),
);

import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import logger from "./config/logging.js"; // Import the logger
import { startTelegramBot } from "./config/telegramBot.js";

dotenv.config();

const app = express();
startTelegramBot();
// Middleware to log requests
// app.use((req, res, next) => {
//   logger.info("HTTP Request", {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//   });
//   next();
// });

app.use(express.json());
app.use(cors());

// routes
app.use("/api", rootRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 1234;

// Function to start the server
const startServer = async () => {
  try {
    // First, connect to the database
    await connectDB();

    // If database connection is successful, start the server
    app.listen(port, () => {
      logger.info(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

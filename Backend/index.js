import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import promptRoutes from "./routes/prompt.routes.js";
dotenv.config();
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promptRoutes);

app.listen(port, () => {
  console.log(`Server is runninig on port ${port}`);
});

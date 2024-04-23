import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from './routes/user.route.js'

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

const app = express();

app.listen(3000, () => {
  console.log("Sever is running on port 3000");
});

/* app.get("/test", (req, res) => {
    res.json({message: 'API is working'})
}) */

app.use("/api/user", userRoutes);
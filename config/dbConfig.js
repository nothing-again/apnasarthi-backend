import mongoose from "mongoose";
import { MONGODB_URI } from "../config/dotenv.config.js";

let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 45000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = connection.connection;
    console.log("Connected to MongoDB");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err.message || "Error connecting to MongoDB");
    process.exit(1);
  }
}

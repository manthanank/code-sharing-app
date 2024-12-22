const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME || "code_sharing_db";

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.re3ha3x.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
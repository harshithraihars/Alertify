const mongoose = require("mongoose");

const connectDb = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI
      );
      console.log("Connected to MongoDB successfully");
      resolve();
    } catch (err) {
      console.error("MongoDB connection error:", err);
      reject(err);  // Pass the error message when rejecting
    }
  });
};

module.exports = connectDb;

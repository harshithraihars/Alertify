const mongoose = require("mongoose");

const connectDb = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(
        "mongodb+srv://harshith:2005@nodeexpreeproject.5kniwxy.mongodb.net/flipkart-alert?retryWrites=true&w=majority&appName=nodeExpreeproject"
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

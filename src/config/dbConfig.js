const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || "";
  console.log(dbUri);
  try {
    await mongoose.connect(dbUri);
  } catch (e) {
    console.error("the error is ", e.message);
    process.exit(1);
  }
};

module.exports = connectDB;

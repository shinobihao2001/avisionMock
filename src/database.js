const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function connectDB() {
  //console.log("Testing one to w");
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connect to db");
  } catch (error) {
    console.log(error);
  }
};

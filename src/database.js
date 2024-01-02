const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connect to db");
  } catch (error) {
    console.log("Connectdb:" + error);
    connectDB();
  }
  // return mongoose.connect(process.env.DB_CONNECT_STRING, (err) => {
  //   if (err) {
  //     console.error(
  //       "Failed to connect to mongo on startup - retrying in 5 sec",
  //       err
  //     );
  //     setTimeout(connectWithRetry, 5000);
  //   }
  // });
};

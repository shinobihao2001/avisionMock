const moongoose = require("mongoose");
require("dotenv").config();

module.exports = function connectDB() {
  moongoose
    .connect(process.env.DB_CONNECT_STRING)
    .then(() => {
      console.log("Connect to db");
    })
    .catch((err) => {
      console.log(err);
    });
};

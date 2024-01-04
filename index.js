const express = require("express");
const connectDB = require("./src/database");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var session = require("express-session");

const port = process.env.PORT || 3000;
const app = express();

// function setUpEnviroment() {
//   let data = require("./config.json");
//   //process.env.DB_CONNECT_STRING = data.db_connect_string;
//   process.env.warranty_check_api_key = data.checkWarranty["api-key"];
//   process.env.get_warranty_check_info_url = data.checkWarranty["api-url"];
//   process.env.signup_warranty_api_key = data.signUpWarranty["api-key"];
//   process.env.signup_warranty_url = data.signUpWarranty["api-url"];
// }

//setUpEnviroment();
connectDB();

app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
//setupMiddleware -- remember to uncomment this
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// const IPMiddleware = require("./src/middlewares/ipMiddleware.js");
// app.use(IPMiddleware.saveIPMiddleware);
// app.use(IPMiddleware.checkBan);
//setup Router
const router = require("./src/routers/index.js");
router.use("/public", express.static("public"));
app.use("/", router);

//run the tool for crawling
require("./robot.js");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});

const express = require("express");
const connectDB = require("./src/database");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const app = express();

connectDB();
app.use(bodyParser.json());

//setupMiddleware
const IPMiddleware = require("./src/middlewares/ipMiddleware.js");
app.use(IPMiddleware.saveIPMiddleware);
app.use(IPMiddleware.checkBan);
//setup Router
const router = require("./src/routers/index.js");
app.use("/", router);

//run the tool
//require("./robot.js");

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});

const express = require("express");
const connectDB = require("./src/database");
const pageService = require("./src/services/pageService.js");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const { updateOne } = require("./src/models/content.js");

//setup multer storage
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });
//

const port = process.env.PORT || 3000;
const app = express();

connectDB();
app.use(bodyParser.json());
//setup Router

app.get("*", async (req, res) => {
  console.log("URL: " + req.url);
  let filename = (process.env.EN_DOMAIN + req.url).toString();
  console.log("filename 1: " + filename);

  //fix zalo request
  if (filename.includes("?")) {
    filename = filename.split("?")[0];
  }
  console.log("filename 2: " + filename);
  let html = await pageService.getPage(filename);
  //let ren = fs.readFileSync("modified.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(html.toString());
});

app.post("/en/agent/*", upload.single("receipt"), async (req, res) => {
  console.log(req.file);

  //get rid of en/
  let filename = (process.env.EN_DOMAIN + req.url.slice(3)).toString();
  console.log("filename 1: " + filename);
  let html = await pageService.getPage(filename);
  //todo :modify html file again adding the warranty check
  res.setHeader("Content-Type", "text/html");
  res.send(html.toString());
});

////////////

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});

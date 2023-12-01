const express = require("express");
const connectDB = require("./src/database");
const pageService = require("./src/services/pageService.js");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bodyParser = require("body-parser");

connectDB();
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});

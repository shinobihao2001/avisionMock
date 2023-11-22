const express = require("express");
const connectDB = require("./src/database");
const pageService = require("./src/services/pageService.js");
require("dotenv").config();
const fs = require("fs");
connectDB();
const port = 3000;
const app = express();

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});

app.get("*", async (req, res) => {
  const path = (process.env.EN_DOMAIN + req.url).toString();
  console.log(path);
  let html = await pageService.getTranslatePage(path);
  //let ren = fs.readFileSync("modified.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  console.log(pageService.getLocalPath(path));
  res.send(html.toString());
});

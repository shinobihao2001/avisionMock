const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const pageService = require("../services/pageService.js");

router.get("*", async (req, res) => {
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

router.post("/agent/check", async (req, res) => {
  //get rid of en/
  let filename = (process.env.EN_DOMAIN + "/agent/").toString();
  console.log("filename 1: " + filename);
  let html = await pageService.getPage(filename);
  //todo :modify html file again adding the warranty check
  res.setHeader("Content-Type", "text/html");
  res.send(html.toString());
});

router.post(
  "/agent/signUpWarranty",
  upload.single("receipt"),
  async (req, res) => {
    console.log(req.file);
    //get rid of en/
    let filename = (process.env.EN_DOMAIN + "/agent/").toString();
    console.log("filename 1: " + filename);
    let html = await pageService.getPage(filename);
    //todo :modify html file again adding the warranty check
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  }
);

module.exports = router;

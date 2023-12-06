const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const pageService = require("../services/pageService.js");
const agentController = require("../controllers/agentController.js");
const fs = require("fs");

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

router.post("/agent/check", agentController.checkWarranty);

router.post(
  "/agent/signUpWarranty",
  upload.single("receipt"),
  agentController.signUpWarranty
);

module.exports = router;

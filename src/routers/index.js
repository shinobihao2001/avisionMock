const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const pageService = require("../services/pageService.js");
const agentController = require("../controllers/agentController.js");
const emailController = require("../controllers/emailController.js");
const userController = require("../controllers/userController.js");

const multer = require("multer");

const upload2 = multer().none();

router.get("*", async (req, res, next) => {
  console.log("URL: " + req.url);
  console.log(req.path);
  if (req.path === "/logout/") {
    // If it's the "logout" path, skip to the next middleware/route
    return next();
  }
  if (req.path.includes("/public")) {
    console.log("IT RUN TO PUBLICK FOLDER");
    return next();
  }
  let filename = (process.env.EN_DOMAIN + req.url).toString();
  console.log("filename 1: " + filename);

  //fix zalo request
  if (filename.includes("?")) {
    filename = filename.split("?")[0];
  }
  console.log("filename 2: " + filename);
  let html = await pageService.getPage(filename);
  if (req.session.isLogin) {
    html = pageService.getModifyLogged(html);
  }
  res.setHeader("Content-Type", "text/html");
  res.send(html.toString());
});

//handle checking warraty
router.post("/agent/check", upload2, agentController.checkWarranty);

//handle signup warranty
router.post(
  "/agent/signUpWarranty",
  upload.single("receipt"),
  agentController.signUpWarranty
);

//handle seding email
router.post("/contact-us/sendEmail", upload2, emailController.sendMail);

//handle login
router.post("/login", userController.handleLogin);

//handle logout
router.get("/logout", userController.handleLogout);
module.exports = router;

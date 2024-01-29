const express = require("express");
const connectDB = require("./src/database");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const https = require("https");
const http = require("http");
require("dotenv").config();

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

//Set Timezone to Viet Nam
process.env.TZ = "Asia/Ho_Chi_Minh";

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
const redirectToHTTPS = (req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
};

app.use(redirectToHTTPS);
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

//https serve and http serve
let sslPath = __dirname;
const certificate = fs.readFileSync(
  path.join(sslPath, "./SSL/certificate.crt"),
  "utf8"
);
const privateKey = fs.readFileSync(
  path.join(sslPath, "./SSL/private.key"),
  "utf8"
);
const caBundle = fs.readFileSync(
  path.join(sslPath, "./SSL/ca_bundle.crt"),
  "utf8"
);

const credentials = { key: privateKey, cert: certificate, ca: caBundle };
const httpServer = http.createServer(app);

// Tạo server HTTPS
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log(`Server is run on http://localhost:80/`);
});

httpsServer.listen(443, () => {
  console.log(`Server is run on https://localhost:443/`);
});

const gloosaryService = require("./src/services/glossaryService");
const userService = require("./src/services/userService");
const configModel = require("./src/models/config");
const connectDB = require("./src/database");
const ob = require("./config.json");
const crypto = require("crypto");
const ulti = require("./src/services/ulti");
let key = require("./key.json");
//gloosaryService.getGlossaryCsv();
(async () => {
  // await connectDB();
  // let data = new configModel({ data: ob });
  // await data.save();
  // console.log("Done");
  // const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  //   modulusLength: 2048, // Độ dài bit của số nguyên modulus, độ dài khóa
  //   publicKeyEncoding: {
  //     type: "spki",
  //     format: "pem",
  //   },
  //   privateKeyEncoding: {
  //     type: "pkcs8",
  //     format: "pem",
  //   },
  // });
  // console.log("Public Key: " + publicKey);
  // console.log("Private Key: " + privateKey);
  let data = "123456aA@";
  let mahoa = ulti.getEncryptString(data);
  console.log("Mã hóa:" + mahoa);
  let giaima = ulti.getDecryptString(mahoa);
  console.log("Giải mã:" + giaima);
  // console.log(key.private_key);
})();

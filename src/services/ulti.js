const crypto = require("crypto");
let key = require("../../key.json");
module.exports = {
  getLocalName(name) {
    let localname = name
      .toString()
      .slice(27)
      .replaceAll("/", "_")
      .replaceAll("-", "_");

    return localname ? localname : "mainPage";
  },

  getEncryptString(data) {
    const dataToEncrypt = data;
    const encryptedData = crypto.publicEncrypt(
      {
        key: key.public_key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(dataToEncrypt)
    );
    return encryptedData.toString("base64");
  },

  getDecryptString(data) {
    const decryptedData = crypto.privateDecrypt(
      {
        key: key.private_key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, "base64")
    );
    return decryptedData.toString("utf-8");
  },
};

const receiptModel = require("../models/receipt");
const fs = require("fs");
const path = require("path");

class receiptService {
  async saveReceipImage(imageName) {
    let imagePath = path.resolve(__dirname, "../uploads", imageName);
    let imageFile = fs.readFileSync(imagePath);
    try {
      let newImage = new receiptModel({
        name: imageName,
        data: imageFile,
        contentType: imageName.split(".")[1],
      });
      await newImage.save();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new receiptService();

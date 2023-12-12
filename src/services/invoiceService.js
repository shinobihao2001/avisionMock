const invoiceModel = require("../models/invoice");
const fs = require("fs");
const path = require("path");
const invoiceApi = require("./invoiceApi");

function getInvoiceImage(invoiceName) {
  let invoiceImagePath = path.join(__dirname, `../uploads/${invoiceName}`);
  try {
    let image = fs.readFileSync(invoiceImagePath);
    return image;
  } catch (error) {
    console.log(error);
  }
}

class invoiceService {
  async saveInvoiceImage(imageName) {
    let imagePath = path.resolve(__dirname, "../uploads", imageName);
    let imageFile = fs.readFileSync(imagePath);
    try {
      let newImage = new invoiceModel({
        name: imageName,
        data: imageFile,
        contentType: imageName.split(".")[1],
      });
      await newImage.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getInfoInvoice(invoiceName) {
    let image = getInvoiceImage(invoiceName);
    let info = await invoiceApi.getInfo(image);
    console.log("Ivoice Info: ");
    console.log(info.data.data.ARISING_DATE.transcription);
    return info;
  }
  getDateInvoice(stringDate) {
    let arr = stringDate.split("");
    let numArr = arr.filter((value) => "0" <= value && value <= "9");
  }
}

module.exports = new invoiceService();

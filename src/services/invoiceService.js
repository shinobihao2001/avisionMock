const invoiceModel = require("../models/invoice");
const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");
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

async function sendImage(imagePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  try {
    await client.access({
      host: "192.168.1.9",
      user: "nghao",
      password: "123456aA@",
      secure: true,
      secureOptions: {
        rejectUnauthorized: false,
      },
    });
    console.log(await client.list());
    await client.uploadFrom(imagePath, "/FTP/Web_Avision_File/testing.jpg");
  } catch (err) {
    console.log("đây là lỗi của ftp: " + err);
  }
  client.close();
}

class invoiceService {
  async saveInvoiceImageDB(imageName) {
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

  async saveInvoiceImageServe(imageName) {
    let imagePath = path.resolve(__dirname, "../uploads", imageName);
    try {
      await sendImage(imagePath);
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

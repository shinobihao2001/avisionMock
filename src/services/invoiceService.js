const invoiceModel = require("../models/invoice");
const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");
const invoiceApi = require("./invoiceApi");
const pageService = require("./pageService");
const XLSX = require("xlsx");
const emailService = require("./emailService");
const configService = require("./configService");

function getEmailMess(userData) {
  return `
Kính chào dịch vụ bảo hành,
Tôi hy vọng bạn đang có một ngày tốt lành. Tôi muốn thông báo rằng phía bên website Avision Việt Nam đã nhận được một đơn đăng ký bảo hành từ công ty ${userData.companyName}.
Dưới đây là những file được gửi kèm khi đăng ký bảo hành, vui lòng xem qua.
Trân trọng,
  `;
}

async function getInvoiceImage(invoiceName) {
  let invoiceImagePath = path.join(__dirname, `../uploads/${invoiceName}`);
  try {
    let image = await fs.readFileSync(invoiceImagePath);
    return image;
  } catch (error) {
    console.log(error);
  }
}

function getFinalPath(imagePath, userData, folderType) {
  let parrentPath = "/FTP/Web_Avision_File/data";
  let currentDay = new Date();
  let todayPath = currentDay.toDateString().replaceAll(" ", "_");
  let hours = currentDay.getHours().toString().padStart(2, "0");
  let minutes = currentDay.getMinutes().toString().padStart(2, "0");
  let seconds = currentDay.getSeconds().toString().padStart(2, "0");

  let formattedTime = `${hours}:${minutes}:${seconds}`;
  let name = path.basename(imagePath);
  let parts = name.split(".");
  let finalName = parts[0] + "_" + formattedTime + "." + parts[1];

  let dir =
    parrentPath +
    "/" +
    todayPath +
    "/" +
    userData.companyName +
    "/" +
    folderType;

  return {
    dir: dir,
    filename: finalName,
  };
}

async function sendImage(imagePath, userData, folderType) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  try {
    let configData = await configService.getData();
    configData = configData.toJSON().data;
    await client.access({
      host: configData.ftpConfig.host,
      user: configData.ftpConfig.user,
      password: configData.ftpConfig.password,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false,
      },
    });
    console.log(await client.list());
    let finalPath = getFinalPath(imagePath, userData, folderType);
    await client.ensureDir(finalPath.dir);
    await client.uploadFrom(imagePath, finalPath.filename);
  } catch (err) {
    console.log("đây là lỗi của ftp: " + err);
  }
  client.close();
}

async function getSerialCsv(csvName) {
  let csvPath = path.resolve(__dirname, "../uploads", csvName);
  let buf = await fs.readFileSync(csvPath);
  let workbook = XLSX.read(buf);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
  let filtered_data = raw_data.filter((row) => row.length > 0);
  console.log(filtered_data);
  return filtered_data;
}

async function sendEmailWarranty(attachs, userData) {
  try {
    let configData = await configService.getData();
    configData = configData.toJSON().data;
    await emailService.sendMail(
      "Kết quả đăng ký bảo hành",
      getEmailMess(userData),
      null,
      configData.emailWarrantySignUpReceivers,
      attachs
    );
  } catch (error) {
    console.log("Error in sending email warranty: " + error);
    sendEmailWarranty(attachs, userData);
  }
}

async function handleTheRestOfSignUp(files, userData) {
  try {
    let attachs = [];
    //define attachmends
    for (let i = 0; i < files.length; i++) {
      let filePath = path.join(__dirname, `../uploads/${files[i].filename}`);
      attachs.push({ filename: files[i].filename, path: filePath });
    }
    await sendEmailWarranty(attachs, userData);
    // send email mess to sw not user and not need to await this
  } catch (error) {
    console.log("Error in send email warranty" + error);
  }

  //remove all the file
  for (let i = 0; i < files.length; i++) {
    await fs.unlinkSync(
      path.resolve(__dirname, "../uploads", files[i].filename)
    );
  }
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

  async saveInvoiceImageServe(imageName, userData, folderType) {
    let imagePath = path.resolve(__dirname, "../uploads", imageName);
    try {
      await sendImage(imagePath, userData, folderType);
    } catch (error) {
      console.log(error);
    }
  }

  async getInfoInvoice(invoiceName) {
    let image = await getInvoiceImage(invoiceName);
    let info = await invoiceApi.getInfo(image);
    console.log("Ivoice Info: ");
    console.log(info.data.data.ARISING_DATE.transcription);
    return info;
  }
  getDateInvoice(stringDate) {
    let oldDay = stringDate.split(":")[0];
    const regex = /(\d{2}) tháng \(\w+\) (\d{2}) năm \(\w+\) (\d{4})/;

    // Match the regular expression
    const match = oldDay.match(regex);
    return {
      day: match[1],
      month: match[2],
      year: match[3],
    };
  }

  async getWarrantyCheck(serial) {
    let result = "";
    try {
      let info = await invoiceApi.getWarrantyCheckInfo(serial);
      console.log(info.data);
      if (info.data.statusCode == 200) {
        result = pageService.getWarrantyCheckPage(true, info.data.data);
      } else {
        result = pageService.getWarrantyCheckPage(false, info.data);
      }
    } catch (error) {
      console.log(error);
      data = {
        message: " Xin vui lòng gửi lại",
      };
      result = pageService.getWarrantyCheckPage(false, data);
    }
    return result;
  }

  async handleSignUpWarranty(files, userData) {
    //save image into ftp serve
    for (let i = 0; i < files.length; i++) {
      let type = "";
      switch (i) {
        case 0:
          type = "Invoice";
          break;
        case 1:
          type = "SaleReport";
          break;
        default:
          type = "Serial";
          break;
      }
      await this.saveInvoiceImageServe(files[i].filename, userData, type);
    }

    // get the info
    let info = await this.getInfoInvoice(files[0].filename);
    let transcriptionDay = this.getDateInvoice(
      info.data.data.ARISING_DATE.transcription
    );
    console.log(transcriptionDay);
    let serials = await getSerialCsv(files[2].filename);

    //call signAPI
    let reponse = await invoiceApi.putSignUpWarranty(serials, transcriptionDay);
    let mess = reponse.data.message;
    console.log(mess);

    // send mail back to sw and delete all the file
    handleTheRestOfSignUp(files, userData);

    return mess;
  }
}

module.exports = new invoiceService();

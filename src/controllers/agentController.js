const fs = require("fs");
const pageService = require("../services/pageService");
const invoiceService = require("../services/invoiceService");

class agentController {
  checkWarranty = async (req, res, next) => {
    let filename = (process.env.EN_DOMAIN + "/agent/").toString();
    console.log("filename 1: " + filename);

    //todo :modify html file again adding the warranty check
    let serial = req.body.wpforms.fields[1];
    let html = await invoiceService.getWarrantyCheck(serial);
    if (req.session.isLogin) {
      html = pageService.getModifyLogged(html);
    }
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  };

  signUpWarranty = async (req, res, next) => {
    console.log(req.files);
    //save image to db
    //await invoiceService.saveInvoiceImageDB(req.file.filename);
    //await invoiceService.saveInvoiceImageServe(req.file.filename);
    //call api to get Info
    //let info = await invoiceService.getInfoInvoice(req.file.filename);
    let status = true;
    let mess = "";
    try {
      mess = await invoiceService.handleSignUpWarranty(req.files, req.session);
    } catch (error) {
      console.log(error);
      status = false;
      mess = "Có lỗi trong quá trình xử lý xin vui lòng gửi lại";

      //delete allfile;
      for (let i = 0; i < files.length; i++) {
        await fs.unlinkSync(
          path.resolve(__dirname, "../uploads", files[i].filename)
        );
      }
    }

    let html = pageService.getWarrantySignUpPage(status, mess);
    //todo :modify html file again adding the warranty check
    if (req.session.isLogin) {
      html = pageService.getModifyLogged(html);
    }
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  };
}

module.exports = new agentController();

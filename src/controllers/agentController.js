const fs = require("fs");
const pageService = require("../services/pageService");
const invoiceService = require("../services/invoiceService");
const path = require("path");

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
    let status = true;
    let mess = "";
    try {
      mess = await invoiceService.handleSignUpWarranty(req.files, req.session);
    } catch (error) {
      console.log(error);
      status = false;
      mess = "Có lỗi trong quá trình xử lý xin vui lòng gửi lại";

      //delete allfile;
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync(
          path.join(__dirname, "../uploads", req.files[i].filename)
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

const fs = require("fs");
const pageService = require("../services/pageService");
const invoiceService = require("../services/invoiceService");

class agentController {
  checkWarranty = async (req, res, next) => {
    //get rid of en/
    let filename = (process.env.EN_DOMAIN + "/agent/").toString();
    console.log("filename 1: " + filename);
    let html = await pageService.getPage(filename);
    //todo :modify html file again adding the warranty check
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  };

  signUpWarranty = async (req, res, next) => {
    console.log(req.file);
    //save image to db
    await invoiceService.saveInvoiceImage(req.file.filename);

    //call api to get Info
    let info = await invoiceService.getInfoInvoice(req.file.filename);

    let filename = (process.env.EN_DOMAIN + "/agent/").toString();
    console.log("filename 1: " + filename);
    let html = await pageService.getPage(filename);
    //todo :modify html file again adding the warranty check
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  };
}

module.exports = new agentController();

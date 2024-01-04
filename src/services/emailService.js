const nodeMailer = require("nodemailer");
const config = require("../../config.json");
const configService = require("./configService");
const ulti = require("../services/ulti");
class emailService {
  async sendMail(
    subject,
    content,
    sender = null,
    receivers = null,
    attachs = null
  ) {
    let configData = await configService.getData();
    configData = configData.toJSON().data;

    const transporter = nodeMailer.createTransport({
      host: configData.mailHost,
      port: configData.mailPort,
      secure: true,
      auth: {
        user: configData.emailSender.emailName,
        pass: ulti.getDecryptString(configData.emailSender.emailPassword),
      },
    });

    const options = {
      from: sender || configData.emailSender.emailName,
      to: receivers || configData.emailReceivers,
      subject: subject,
      text: content,
      attachments: attachs,
    };

    return await transporter.sendMail(options);
  }
}
module.exports = new emailService();

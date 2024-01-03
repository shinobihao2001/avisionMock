const nodeMailer = require("nodemailer");
const config = require("../../config.json");
const configService = require("./configService");

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
    console.log("Config data:");
    console.log(configData);
    const transporter = nodeMailer.createTransport({
      host: config.mailHost,
      port: config.mailPort,
      secure: true,
      auth: {
        user: config.emailSender.emailName,
        pass: config.emailSender.emailPassword,
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

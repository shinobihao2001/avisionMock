const nodeMailer = require("nodemailer");

const adminEmail = "nghao@dsg.com.vn";
const adminPassword = "Uzunaki456123";
const mailHost = "mail.dsg.com.vn";
const mailPort = 465;
const receiverEmail = "shinobihao2001@gmail.com";
const config = require("../../config.json");

class emailService {
  async sendMail(subject, content, sender, receivers = null) {
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
      from: sender || config.emailSender.emailName,
      to: receivers || config.emailReceivers,
      subject: subject,
      text: content,
    };

    return await transporter.sendMail(options);
  }
}
module.exports = new emailService();

const nodeMailer = require("nodemailer");

const adminEmail = "nghao@dsg.com.vn";
const adminPassword = "Uzunaki456123";

const mailHost = "mail.dsg.com.vn";
const mailPort = 25;

const receiverEmail = "shinobihao2001@gmail.com";

class emailService {
  sendMail(subject, content) {
    const transporter = nodeMailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: false,
      auth: {
        user: adminEmail,
        pass: adminPassword,
      },
    });

    const options = {
      from: adminEmail,
      to: receiverEmail,
      subject: subject,
      text: content,
    };

    return transporter.sendMail(options);
  }
}

module.exports = new emailService();

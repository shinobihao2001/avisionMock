const emailService = require("../services/emailService");

class emailController {
  async sendMail(req, res, next) {
    console.log("Form Fields:");
    const { subject, author, phoneNumber, email, content } = req.body;
    console.log(subject);
    console.log(author);
    console.log(phoneNumber);
    console.log(email);
    console.log(content);
    res.send("Sending Email Testing");
  }
}

module.exports = new emailController();

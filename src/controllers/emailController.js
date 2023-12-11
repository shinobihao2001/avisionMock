const emailService = require("../services/emailService");
const pageService = require("../services/pageService");

class emailController {
  async sendMail(req, res, next) {
    console.log(req.url);
    let { subject, author, phoneNumber, email, content } = req.body;
    content =
      "author: " +
      author +
      "\n" +
      "email: " +
      email +
      "\n" +
      "phone number: " +
      phoneNumber +
      "\n" +
      "content: " +
      content;
    await emailService.sendMail(subject, content);

    //return the page with sending success mess
    let html = await pageService.getEmailPage();
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  }
}

module.exports = new emailController();

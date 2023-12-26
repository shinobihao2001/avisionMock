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

    let html;
    try {
      await emailService.sendMail(subject, content);
      html = await pageService.getEmailPage(true);
    } catch (error) {
      console.log("Email seding error: " + error);
      html = await pageService.getEmailPage(false);
    }

    if (req.session.isLogin) {
      html = pageService.getModifyLogged(html);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  }
}

module.exports = new emailController();

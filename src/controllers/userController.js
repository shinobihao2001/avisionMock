const userService = require("../services/userService");
const pageService = require("../services/pageService");

class userController {
  async handleLogin(req, res, next) {
    let username = req.body["username-2661"];
    let password = req.body["user_password-2661"];

    let user = await userService.findUser(username, password);

    let html;
    if (user) {
      req.session.isLogin = true;
      req.session.fakeData = 100;
      html = await pageService.getPage("/");
      html = pageService.getModifyLogged(html);
    } else {
      html = pageService.getLoginFailPage();
    }
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
    // if sucess return mainPage with modify for login
    // false log error on login page
  }

  async handleLogout(req, res, next) {
    req.session.destroy();
    let html = await pageService.getPage("/");
    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  }
}

module.exports = new userController();

const userService = require("../services/userService");
const pageService = require("../services/pageService");

class userController {
  async handleLogin(req, res, next) {
    let username = req.body["username-2661"];
    let password = req.body["user_password-2661"];

    let user = await userService.findUser(username, password);
    await userService.createUser("giahao", "123456");

    let html;
    if (user) {
      req.session.isLogin = true;
      req.session.companyName = user.companyName;
      req.session.email = user.email;
      req.session.password = password;
      req.session.username = username;
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

  async changePassword(req, res, next) {
    let password = req.body["user_password_99999"];
    let newPass = req.body["user_new_password_99999"];
    let newPass2 = req.body["user_new_password_2"];
    //console.log(req.body);

    let response = "";
    try {
      response = await userService.handleChangePass(
        req.session,
        password,
        newPass,
        newPass2
      );
    } catch (error) {
      console.log("Change pass error: " + error);
      response = {
        status: false,
        mess: "Cố lỗi trong quá trình , xin vui lòng làm lại",
      };
    }
    let html = pageService.getResetPassPage(response.status, response.mess);
    if (req.session.isLogin) {
      html = pageService.getModifyLogged(html);
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html.toString());
  }
}

module.exports = new userController();

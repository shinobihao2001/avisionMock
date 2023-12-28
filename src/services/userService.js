const user = require("../models/user");
const userModel = require("../models/user");
const crypto = require("crypto");

function hashPass(pass) {
  const hash = crypto.createHash("sha256").update(pass).digest("hex");
  return hash;
}

class userService {
  async createUser(name, pass) {
    try {
      pass = hashPass(pass);
      let user = await userModel.create({
        username: name,
        password: pass,
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findUser(name, pass) {
    pass = hashPass(pass);
    let user = await userModel.findOne({ username: name });
    if (user) {
      if (user.password == pass) {
        return user;
      }
    }
    return null;
  }

  async changePass(username, newPass) {
    let user = await userModel.findOne({ username: username });
    let hashPass = hashPass(newPass);
    user.password = hashPass;
    await user.save();
  }

  async handleChangePass(userData, password, newPass, newPass2) {
    if (newPass != newPass2) {
      return { mess: "Mật khẩu mới không trùng với nhau!", status: false };
    }

    if (userData.password != password) {
      return {
        mess: "Sai mật khẩu",
        status: false,
      };
    }

    await userService.changePass(userData.username, newPass);
    return {
      mess: "Đổi mật khẩu thành công",
      status: true,
    };
  }
}

module.exports = new userService();

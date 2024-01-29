const user = require("../models/user");
const userModel = require("../models/user");
const crypto = require("crypto");

function hashPass(pass) {
  const hash = crypto.createHash("sha256").update(pass).digest("hex");
  return hash;
}

async function changePass(username, newPass) {
  let user = await userModel.findOne({ username: username });
  newPass = hashPass(newPass);
  user.password = newPass;
  await user.save();
}

class userService {
  async createUser(name, pass, company, email) {
    try {
      pass = hashPass(pass);
      let user = await userModel.create({
        username: name,
        password: pass,
        companyName: company,
        email: email,
      });
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findUser(name, pass) {
    pass = hashPass(pass);
    let user = await userModel.findOne({
      $or: [{ username: name }, { email: name }],
    });
    if (user) {
      if (user.password == pass) {
        return user;
      }
    }
    return null;
  }

  async handleChangePass(userData, password, newPass, newPass2) {
    if (newPass != newPass2) {
      return { mess: "Mật khẩu mới không trùng với nhau!", status: false };
    }

    if (newPass == "") {
      return { mess: "Mật khẩu không được rỗng!", status: false };
    }

    if (userData.password != password) {
      // console.log("Mât khẫu sess:" + userData.password);
      // console.log("Mật khẩu mới nhập:" + password);
      return {
        mess: "Sai mật khẩu",
        status: false,
      };
    }

    await changePass(userData.username, newPass);
    return {
      mess: "Đổi mật khẩu thành công",
      status: true,
    };
  }
}

module.exports = new userService();

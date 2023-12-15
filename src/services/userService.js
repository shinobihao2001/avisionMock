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
}

module.exports = new userService();

const user = require("../models/user");
const userModel = require("../models/user");

class userService {
  async createUser(name, pass) {
    try {
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

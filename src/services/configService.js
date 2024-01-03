const configModel = require("../models/config");

class configService {
  async getData() {
    let result = await configModel.findOne().exec();
    return result;
  }
}

module.exports = new configService();

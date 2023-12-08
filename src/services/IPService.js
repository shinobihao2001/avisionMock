const IPModel = require("../models/IP");

class IPService {
  async getIPArray() {
    let IPs = await IPModel.find({});
    let result = [];
    for (let ip of IPs) {
      //console.log(ip.toObject());
      result.push(ip.toObject());
    }
    return result;
  }

  async createNewIp(ip, requestTime) {
    let result = await IPModel.create({
      value: ip,
      requests: [requestTime],
    });
    return result;
  }

  async updateRequest(ip, requests) {
    let result = await IPModel.updateOne(
      { value: ip },
      {
        requests: requests,
      }
    );
    return result;
  }

  async updateBan(ip, ban) {
    let result = await IPModel.updateOne(
      {
        value: ip,
      },
      { isBanned: ban }
    );
    return result;
  }
}

module.exports = new IPService();

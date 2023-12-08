const IPService = require("../services/IPService");
const requestIp = require("request-ip");
const { array } = require("./multer");
let IPArray = [];

async function saveIP(newIp) {
  if (IPArray.length == 0) {
    IPArray = await IPService.getIPArray();
  }

  let flag = true;
  let requestTime = new Date();
  //console.log(typeof IPArray);
  for (let Ip of IPArray) {
    if (Ip.value == newIp) {
      Ip.requests.push({ time: requestTime });
      await IPService.updateRequest(newIp, Ip.Requests);
      flag = false;
      break;
    }
  }
  if (flag) {
    IPArray.push({
      value: newIp,
      requests: [{ time: requestTime }],
    });
    IPService.createNewIp(newIp, requestTime);
  }
}

async function updateDdosIp() {
  for (let ip of IPArray) {
    let index = ip.requests.length;
    if (index > 20 && !ip.isBanned) {
      let timeDiff =
        (ip.requests[index - 1].time - ip.requests[index - 20].time) / 1000;
      console.log("Time Diff: " + timeDiff);
      if (timeDiff > 1) {
        ip.isBanned = true;
      }
      await IPService.updateBan(ip.value, true);
    }
  }
}

class IPMiddleware {
  async saveIPMiddleware(req, res, next) {
    let newIp = requestIp.getClientIp(req);
    //console.log(newIp);
    await saveIP(newIp);
    await updateDdosIp();
    //console.log("URL : " + req.url);
    //console.log(IPArray);
    console.log(IPArray[0]);
    next();
  }

  async checkBan(req, res, next) {
    let isBanned = false;
    let newIp = requestIp.getClientIp(req);
    for (let i = 0; i < IPArray.length; i++) {
      if (newIp == IPArray[i].value && IPArray[i].isBanned) {
        isBanned = true;
        break;
      }
    }
    if (isBanned) {
      res.status(404).end();
    } else {
      next();
    }
  }
}

module.exports = new IPMiddleware();

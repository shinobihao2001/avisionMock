const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const configService = require("./configService");

class invoiceAPI {
  async getInfo(image) {
    let configData = await configService.getData();
    configData = configData.toJSON().data;

    const formData = new FormData();
    formData.append("data", image, {
      filename: "invoice.jpg",
      contentType: "image/jpeg",
    });

    let reponse = await axios.post(configData.getInfo["api-url"], formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return reponse;
  }

  async getWarrantyCheckInfo(serial) {
    let configData = await configService.getData();
    configData = configData.toJSON().data;
    let reponse = await axios.get(configData.checkWarranty["api-url"], {
      params: {
        query: serial,
      },
      headers: {
        "api-key": configData.checkWarranty["api-key"],
      },
    });
    return reponse;
  }

  async putSignUpWarranty(serialArr, regisDate) {
    let configData = await configService.getData();
    configData = configData.toJSON().data;

    let serials = [];
    for (let i = 0; i < serialArr.length; i++) {
      serials.push(serialArr[i][1]);
    }

    let registrationDate = `${regisDate.year}-${regisDate.month}-${regisDate.day}`;

    console.log("serial: " + serials);
    console.log("date: " + registrationDate);

    let response = await axios.put(
      configData.signUpWarranty["api-url"],
      {
        serials: serials,
        registrationDate: registrationDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": configData.signUpWarranty["api-key"],
        },
      }
    );
    return response;
  }
}

module.exports = new invoiceAPI();

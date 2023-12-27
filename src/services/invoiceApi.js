const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const getInfoUrl = "http://14.241.244.57:30800/predictions/einvoice";

class invoiceAPI {
  async getInfo(image) {
    const formData = new FormData();
    formData.append("data", image, {
      filename: "invoice.jpg",
      contentType: "image/jpeg",
    });

    let reponse = await axios.post(getInfoUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return reponse;
  }

  async getWarrantyCheckInfo(serial) {
    let reponse = await axios.get(process.env.get_warranty_check_info_url, {
      params: {
        query: serial,
      },
      headers: {
        "api-key": process.env.warranty_check_api_key,
      },
    });
    return reponse;
  }

  async putSignUpWarranty(serialArr, regisDate) {
    let serials = [];
    for (let i = 0; i < serialArr.length; i++) {
      serials.push(serialArr[i][1]);
    }

    let registrationDate = `${regisDate.year}-${regisDate.month}-${regisDate.day}`;

    console.log("serial: " + serials);
    console.log("date: " + registrationDate);

    let response = await axios.put(
      process.env.signup_warranty_url,
      {
        serials: serials,
        registrationDate: registrationDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.signup_warranty_api_key,
        },
      }
    );
    return response;
  }
}

module.exports = new invoiceAPI();

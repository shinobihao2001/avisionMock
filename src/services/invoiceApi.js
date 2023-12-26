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
}

module.exports = new invoiceAPI();

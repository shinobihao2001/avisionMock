const moongoose = require("mongoose");

let invoiceSchema = new moongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

module.exports = moongoose.model("invoiceModel", invoiceSchema);

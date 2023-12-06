const moongoose = require("mongoose");

let receiptSchema = new moongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

module.exports = moongoose.model("receiptModel", receiptSchema);

const moongoose = require("mongoose");

let contentSchema = new moongoose.Schema({
  // url: {
  //   type: String,
  // },
  // tagName: {
  //   type: String,
  // },
  text: {
    type: String,
    unique: true,
  },
  newText: {
    type: String,
  },
  isTranslated: {
    type: Boolean,
  },
});

module.exports = moongoose.model("contentModel", contentSchema);

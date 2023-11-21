const moongoose = require("mongoose");

let contentSchema = new moongoose.Schema({
  url: {
    type: String,
  },
  tagName: {
    type: String,
  },
  text: {
    type: String,
  },
  newText: {
    type: String,
  },
});

module.exports = moongoose.model("contentModel", contentSchema);

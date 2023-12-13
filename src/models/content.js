const moongoose = require("mongoose");

let contentSchema = new moongoose.Schema({
  text: {
    type: String,
    unique: true,
  },
  newText: {
    type: String,
  },
  finalText: {
    type: String,
  },
  isTranslated: {
    type: Boolean,
  },
});

module.exports = moongoose.model("contentModel", contentSchema);

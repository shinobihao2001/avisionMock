const mongoose = require("mongoose");

let glossarySchema = new mongoose.Schema({
  enLink: {
    type: String,
  },
  wrongContent: {
    type: String,
  },
  rightContent: {
    type: String,
  },
});

module.exports = mongoose.model("glossaryModel", glossarySchema);

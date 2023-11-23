const moongoose = require("mongoose");

const linkSchema = new moongoose.Schema({
  value: {
    type: String,
    unique: true,
  },
  isVisit: {
    type: Boolean,
  },
  vnLink: {
    type: String,
  },
  isCrawlNeed: {
    type: Boolean,
  },
});

module.exports = moongoose.model("linkModel", linkSchema);

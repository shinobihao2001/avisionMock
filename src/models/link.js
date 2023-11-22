const moongoose = require("mongoose");

const linkSchema = new moongoose.Schema({
  value: {
    type: String,
  },
  vnLink: {
    type: String,
  },
  isCrawlNeed: {
    type: Boolean,
  },
});

module.exports = moongoose.model("linkModel", linkSchema);

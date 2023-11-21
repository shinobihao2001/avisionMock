const moongoose = require("mongoose");

const linkSchema = new moongoose.Schema({
  value: {
    typeo: String,
  },
  vnLink: {
    type: String,
  },
  isCrawlNeed: {
    type: Boolean,
  },
});

module.exports = mongoose.model("linkModel", linkSchema);

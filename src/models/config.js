const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("configModel", configSchema);

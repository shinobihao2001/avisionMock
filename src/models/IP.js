const mongoose = require("mongoose");

let IPSchema = new mongoose.Schema({
  value: {
    type: String,
  },
  requests: [
    {
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isBanned: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("IPModel", IPSchema);

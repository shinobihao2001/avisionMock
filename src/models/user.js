const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

let userSchema = new moongoose.Schema({
  username: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("userModel", userSchema);

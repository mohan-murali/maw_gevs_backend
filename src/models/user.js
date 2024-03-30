const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const userSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  },
});

module.exports = model("user", userSchema);

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const uvcSchema = new Schema({
  uvcCode: {
    type: String,
    required: true,
  },
  isUsed: {
    type: Boolean,
    required: true,
  },
});

module.exports = model("Uvc", uvcSchema);

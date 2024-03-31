const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const prefrencesSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  prefrence1: {
    type: String,
    required: true,
  },
  prefrence2: {
    type: String,
    required: true
  },
  prefrence3: {
    type: String,
    required: true
  },
});

module.exports = model("prefrences", prefrencesSchema);

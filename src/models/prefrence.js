const mongoose = require("mongoose");
const topic = require("./topic");
const { model, Schema } = mongoose;

const prefrencesSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  prefrence1: {
    type: topic,
    required: true,
  },
  prefrence2: {
    type: topic,
    required: true,
  },
  prefrence3: {
    type: topic,
    required: true,
  },
});

module.exports = model("prefrences", prefrencesSchema);

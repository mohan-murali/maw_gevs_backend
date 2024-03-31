const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const { topicSchema } = require("./topic");

const prefrencesSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  prefrence1: {
    type: topicSchema,
    required: true,
  },
  prefrence2: {
    type: topicSchema,
    required: true,
  },
  prefrence3: {
    type: topicSchema,
    required: true,
  },
});

module.exports = model("prefrences", prefrencesSchema);

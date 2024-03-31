const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const topicSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  supervisor: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  isCustom: {
    type: Boolean,
  },
  isApproved: {
    type: Boolean,
  },
  createdBy: {
    type: String,
  },
});

const TopicModel = model("topic", topicSchema);
module.exports = { topicSchema, TopicModel };

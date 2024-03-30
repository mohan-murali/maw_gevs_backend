const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const topicSchema = new Schema({
  topidId: {
    type: String,
    required: true,
  },
    topic: {
        type: String,
        required: true
    },
    supervisor: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    isCustomTropic: {
        type: Boolean
    },
    isApproved: {
        type: Boolean
    }
});

module.exports = model("topic", topicSchema);
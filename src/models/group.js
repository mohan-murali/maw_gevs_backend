const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const groupSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  supervisor: {
    type: String,
    required: true,
  },
  students: [
    {
      type: String,
      ref: "Student",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;

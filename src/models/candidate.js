const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const candidateSchema = new Schema({
  candidate: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  constituency: {
    type: String,
    required: true,
  },
  voteCount: {
    type: Number,
    required: true,
  },
});

module.exports = model("Candidate", candidateSchema);

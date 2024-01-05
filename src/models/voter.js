const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const voterSchema = new Schema({
  voterId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  dob: {
    type: String,
  },
  uvcCode: {
    type: String,
  },
  constituency: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  hasVoted: {
    type: Boolean,
  },
});

export const VoterModel = model("Voter", voterSchema);

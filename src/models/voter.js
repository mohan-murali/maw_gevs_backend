import { Schema, model } from "mongoose";

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
});

export const VoterModel = model("Voter", voterSchema);

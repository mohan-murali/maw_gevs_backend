import { Schema, model } from "mongoose";

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

export const CandidateModel = model("Candidate", candidateSchema);

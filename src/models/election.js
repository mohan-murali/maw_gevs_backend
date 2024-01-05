import { Schema, model } from "mongoose";

const electionSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
});

export const ElectionModel = model("Election", electionSchema);

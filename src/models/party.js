import { Schema, model } from "mongoose";

const partySchema = new Schema({
  party: {
    type: String,
    required: true,
  },
  seatCount: {
    type: Number,
    required: true,
  },
});

export const PartyModel = model("Party", partySchema);

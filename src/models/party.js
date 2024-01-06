const mongoose = require("mongoose");
const { model, Schema } = mongoose;

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

module.exports = model("Party", partySchema);

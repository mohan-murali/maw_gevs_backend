import { model, Schema } from "mongoose";

const uvcSchema = new Schema({
  uvcCode: {
    type: String,
    required: true,
  },
  isUsed: {
    type: Boolean,
    required: true,
  },
});

export const uvcModel = model("uvc", uvcSchema);

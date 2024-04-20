import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", User);

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending first login", "activate", "deactivate"],
      default: "pending first login",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Account", Account);

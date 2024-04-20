import mongoose from "mongoose";
const Schema = mongoose.Schema;

let Category = new Schema(
  {
    category_name: { type: String, required: true },
    sku: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

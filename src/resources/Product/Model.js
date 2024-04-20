import mongoose from "mongoose";
const Schema = mongoose.Schema();

const Product = new Schema(
  {
    product_name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    activate_code: { type: String, required: true },
    expiry_date: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Unavailable", "Pending", "Sold", "Expired"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

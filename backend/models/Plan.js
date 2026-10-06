const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  products: [String],
  imageUrl: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
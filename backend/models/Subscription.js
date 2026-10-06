const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  preferences: { type: [String], default: [] },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  startDate: { type: Date, default: Date.now },
  nextBillingDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
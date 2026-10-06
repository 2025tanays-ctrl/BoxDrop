const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
  trackingNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "In Transit", "Out for Delivery", "Delivered"],
    default: "Processing"
  },
  shippedDate: Date,
  estimatedDelivery: Date,
  deliveredDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Shipment", shipmentSchema);
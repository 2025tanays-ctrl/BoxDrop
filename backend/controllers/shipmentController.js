const Shipment = require("../models/Shipment");

exports.getShipmentsBySubscription = async (req, res) => {
  try {
    const shipments = await Shipment.find({
      subscription: req.params.id
    }).sort({ createdAt: -1 });

    res.json(shipments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const express = require("express");
const { getShipmentsBySubscription } = require("../controllers/shipmentController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/subscription/:id", auth, getShipmentsBySubscription);

module.exports = router;
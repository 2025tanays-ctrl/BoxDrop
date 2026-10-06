const express = require("express");
const {
  createSubscription,
  getUserSubscriptions,
  cancelSubscription
} = require("../controllers/subscriptionController");

const { auth } = require("../middleware/auth");
const { validateSubscription } = require("../middleware/validation");

const router = express.Router();

router.post("/", auth, validateSubscription, createSubscription);
router.get("/user/:id", auth, getUserSubscriptions);
router.put("/:id/cancel", auth, cancelSubscription);

module.exports = router;
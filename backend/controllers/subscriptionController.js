const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const Shipment = require("../models/Shipment");

exports.createSubscription = async (req, res) => {
  try {
    const { user, plan, preferences, billingCycle } = req.body;
    const selectedPlan = await Plan.findById(plan);

    if (!selectedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const cycle = billingCycle || selectedPlan.billingCycle;
    const nextBillingDate = new Date();

    if (cycle === "yearly") {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      user,
      plan,
      preferences: preferences || [],
      billingCycle: cycle,
      nextBillingDate
    });

    await Shipment.create({
      subscription: subscription._id,
      trackingNumber: "BD" + Date.now(),
      status: "Processing",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.params.id
    }).populate("plan");

    res.json(subscriptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({
      message: "Subscription cancelled successfully",
      subscription
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
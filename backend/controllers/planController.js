const Plan = require("../models/Plan");

exports.getPlans = async (req, res) => {
  try { res.json(await Plan.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch { res.status(400).json({ message: "Invalid plan ID" }); }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, description, category, price, billingCycle, products, imageUrl } = req.body;
    const plan = await Plan.create({
      name, description, category, price,
      billingCycle: billingCycle || "monthly",
      products: typeof products === "string" ? products.split(",").map(x => x.trim()).filter(Boolean) : products || [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : (imageUrl || "")
    });
    res.status(201).json(plan);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updatePlan = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.products === "string") data.products = data.products.split(",").map(x => x.trim()).filter(Boolean);
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const plan = await Plan.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.searchPlans = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const plans = await Plan.find({ $or: [
      { name: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { products: { $regex: keyword, $options: "i" } }
    ] });
    res.json(plans);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

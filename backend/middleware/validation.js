const validatePlan = (req, res, next) => {
  const { name, category, price } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({
      message: "Name, category and price are required"
    });
  }

  if (Number(price) < 0) {
    return res.status(400).json({
      message: "Price cannot be negative"
    });
  }

  next();
};

const validateSubscription = (req, res, next) => {
  const { user, plan } = req.body;

  if (!user || !plan) {
    return res.status(400).json({
      message: "User and plan are required"
    });
  }

  next();
};

module.exports = { validatePlan, validateSubscription };
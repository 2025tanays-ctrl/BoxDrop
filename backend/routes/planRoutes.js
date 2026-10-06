const express = require("express");
const { getPlans, getPlan, createPlan, updatePlan, searchPlans } = require("../controllers/planController");
const { auth } = require("../middleware/auth");
const { validatePlan } = require("../middleware/validation");
const upload = require("../middleware/upload");

const router = express.Router();
router.get("/search", searchPlans);
router.get("/", getPlans);
router.get("/:id", getPlan);
router.post("/", auth, upload, validatePlan, createPlan);
router.put("/:id", auth, upload, validatePlan, updatePlan);
module.exports = router;

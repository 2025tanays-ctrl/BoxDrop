require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.json({ message: "BoxDrop API is running", caseStudy: "Case Study 97 - Subscription Box Service" }));
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

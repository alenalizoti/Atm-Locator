const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Middleware
const authenticateToken = require("./middleware/authenticateToken");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const atmRoutes = require("./routes/atmRoutes");
const cardRoutes = require("./routes/cardRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const bankRoutes = require("./routes/bankRoutes");
const validationRoutes = require("./routes/validationRoutes");

app.use("/users", authenticateToken, userRoutes);
app.use("/auth", authRoutes);
app.use("/atm", authenticateToken, atmRoutes);
app.use("/card", authenticateToken, cardRoutes);
app.use("/withdrawal", withdrawalRoutes);
app.use("/bank", bankRoutes);
app.use("/validation", validationRoutes);

module.exports = app;

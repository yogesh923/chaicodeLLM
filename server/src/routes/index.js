import express from "express";
import askRoutes from "./ask.js";
import indexingRoutes from "./indexing.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is running", success: true });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

router.use("/index", indexingRoutes);
router.use("/ask", askRoutes);

export default router;

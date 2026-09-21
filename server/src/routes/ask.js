import express from "express";
import { enhanceQuery } from "../query/index.js";
import { askWithCorrection } from "../response/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query, k = 5, topK = 5, maxRetries = 1 } = req.body || {};
  if (!query || !String(query).trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Field 'query' is required." });
  }

  try {
    const enhanced = await enhanceQuery(query);
    if (!enhanced.ok) {
      return res
        .status(400)
        .json({ success: false, message: enhanced.reason });
    }
    const result = await askWithCorrection(enhanced, { k, topK, maxRetries });
    res.json({ success: true, query: enhanced.query, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

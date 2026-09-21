import { unlink } from "node:fs/promises";
import express from "express";
import multer from "multer";
import { indexSource } from "../indexing/index.js";

const router = express.Router();
const upload = multer({ dest: "/tmp/chaicodellm-uploads/" });

const TYPES = ["pdf", "audio", "video", "website", "srt", "vtt"];

router.post("/", upload.single("file"), async (req, res) => {
  const sourceType = req.body.sourceType;
  const input = req.file?.path || req.body.input || req.body.link;

  if (!TYPES.includes(sourceType)) {
    return res.status(400).json({
      success: false,
      message: `sourceType must be one of: ${TYPES.join(", ")}`,
    });
  }
  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Provide a file (field 'file') or a link/path (field 'input').",
    });
  }

  try {
    const result = await indexSource(sourceType, input);
    res.json({
      success: true,
      sourceType,
      chunks: result.chunks.length,
      stored: result.stored ?? result.chunks.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (req.file) await unlink(req.file.path).catch(() => {});
  }
});

export default router;

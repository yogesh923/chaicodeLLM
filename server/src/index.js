import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running. Use /api" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

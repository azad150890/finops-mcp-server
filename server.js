import express from "express";
import dotenv from "dotenv";
import { getCostSummary } from "./tools/cost.js";
import { detectAnomaly } from "./tools/anomaly.js";
import { getEmbedding } from "./tools/embedding.js";

dotenv.config();

const app = express();
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "FinOps MCP Server Running" });
});

/* =========================
   TOOL 1: COST SUMMARY
========================= */
app.post("/tool/cost-summary", async (req, res) => {
  const result = await getCostSummary();
  res.json(result);
});

/* =========================
   TOOL 2: ANOMALY DETECTION
========================= */
app.post("/tool/anomaly", async (req, res) => {
  const result = await detectAnomaly();
  res.json(result);
});

/* =========================
   TOOL 3: EMBEDDINGS (RAG)
========================= */
app.post("/tool/embed", async (req, res) => {
  const { text } = req.body;
  const result = await getEmbedding(text);
  res.json(result);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("MCP Server running on port", PORT);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getCostSummary } from "./tools/cost.js";
import { detectAnomaly } from "./tools/anomaly.js";
import { getEmbedding } from "./tools/embedding.js";

/* Load env FIRST */
dotenv.config();

/* App init */
const app = express();

/* Middleware */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "FinOps MCP Server Running" });
});

/* =========================
   DEBUG: CHECK ENV VARIABLES
========================= */
app.get("/debug/config", (req, res) => {
  res.json({
    PHI4_ENDPOINT: process.env.PHI4_ENDPOINT ? "✓ Set" : "✗ Not Set",
    PHI4_KEY: process.env.PHI4_KEY ? "✓ Set (" + process.env.PHI4_KEY.substring(0, 5) + "...)" : "✗ Not Set",
    EMBED_ENDPOINT: process.env.EMBED_ENDPOINT ? "✓ Set" : "✗ Not Set",
    embed_key: process.env.embed_key ? "✓ Set" : "✗ Not Set",
    PORT: process.env.PORT || 3000
  });
});

/* =========================
   TOOL 1: COST SUMMARY
========================= */
app.post("/tool/cost-summary", async (req, res) => {
  try {
    const result = await getCostSummary();
    if (result.error) {
      res.status(500).type('text/plain').send(`Error: ${result.message}`);
    } else {
      res.type('text/plain').send(result.summary);
    }
  } catch (err) {
    res.status(500).type('text/plain').send(`Error: ${err.message}`);
  }
});

/* =========================
   TOOL 2: ANOMALY DETECTION
========================= */
app.post("/tool/anomaly", async (req, res) => {
  try {
    const result = await detectAnomaly();
    if (result.error) {
      res.status(500).type('text/plain').send(`Error: ${result.message}`);
    } else {
      res.type('text/plain').send(result.summary);
    }
  } catch (err) {
    res.status(500).type('text/plain').send(`Error: ${err.message}`);
  }
});

/* =========================
   TOOL 3: EMBEDDINGS (RAG)
========================= */
app.post("/tool/embed", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await getEmbedding(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
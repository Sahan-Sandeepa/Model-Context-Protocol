const express = require("express");
const path = require("path");
require("dotenv").config();
const { answer } = require("./qa");
const resume = require("./data/resume.json");

const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Q&A endpoint{ question: string }
app.post("/ask", (req, res) => {
  const question = (req.body && req.body.question) || "";
  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ error: 'Please provide { "question": "..." } in JSON body.' });
  }
  try {
    const reply = answer(question, resume);
    res.json({ question, answer: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to answer question." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP CV server listening on http://localhost:${PORT}`);
});

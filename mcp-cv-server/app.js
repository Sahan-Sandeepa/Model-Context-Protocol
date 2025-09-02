const express = require("express");
const { answer } = require("./qa");
const resume = require("./data/resume.json");
const axios = require("axios");

const router = express.Router();

// Q&A endpoint
router.post("/ask", (req, res, next) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ error: 'Please provide a valid "question" in the JSON body.' });
  }
  try {
    const reply = answer(question, resume);
    res.json({ question, answer: reply });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

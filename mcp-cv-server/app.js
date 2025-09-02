const express = require("express");
const { answer } = require("./qa");
const resume = require("./data/resume.json");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

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
    // Pass the error to the global error handler in app.js
    next(err);
  }
});

// Email endpoint
router.post("/send-email", async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          name,
          email,
          subject,
          message,
        },
      }
    );

    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("Email sending error:", err.response?.data || err.message);
    next(err);
  }
});

module.exports = router;

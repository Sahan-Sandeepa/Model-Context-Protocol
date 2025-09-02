const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const allowedOrigins = [/\.vercel\.app$/, "http://localhost:3000"];

require("dotenv").config();

const apiRouter = require("./app.js");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => (o instanceof RegExp ? o.test(origin) : o === origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use("/", apiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

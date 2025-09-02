const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const apiRouter = require("./app.js");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Use the API router
app.use("/", apiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

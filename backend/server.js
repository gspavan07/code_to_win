const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { logger } = require("./utils"); // <-- Add this line

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every request globally
app.use((req, res, next) => {
  logger.info(
    `[${req.method}] ${req.originalUrl} | query: ${JSON.stringify(req.query)}`
  );
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/hod", require("./routes/hodRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/meta", require("./routes/metaRoutes"));
app.use("/api/", require("./routes/managementRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

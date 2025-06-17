const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const setupProfileScraperRoutes = require("./profileScraperRoutes");
const { logger } = require("./utils"); // <-- Add this line

const app = express();
app.use(cors());
const server = http.createServer(app);

// ✅ Fix: Allow CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:1432",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

// Routes using Socket.IO
app.use("/api/profile-scraper", setupProfileScraperRoutes(io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

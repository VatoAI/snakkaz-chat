// MCP API Server for SnakkaZ Beta Signups
// Deploy this to mcp.snakkaz.com

const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "https://snakkaz.com",
      "https://www.snakkaz.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

// Data storage (in production, use a proper database)
const DATA_FILE = path.join(__dirname, "beta-signups.json");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "SnakkaZ MCP API",
    version: "1.0.0",
  });
});

// Beta signup endpoint
app.post("/api/beta-signup", async (req, res) => {
  try {
    const { name, email, company, timestamp, source, type } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Create signup record
    const signup = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      company: company || null,
      timestamp: timestamp || new Date().toISOString(),
      source: source || "direct",
      type: type || "beta-signup",
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    };

    // Load existing signups
    let signups = [];
    try {
      const data = await fs.readFile(DATA_FILE, "utf8");
      signups = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      signups = [];
    }

    // Check for duplicate email
    const existingSignup = signups.find((s) => s.email === signup.email);
    if (existingSignup) {
      return res.json({
        success: true,
        message: "You are already registered for beta access!",
        existing: true,
      });
    }

    // Add new signup
    signups.push(signup);

    // Save to file
    await fs.writeFile(DATA_FILE, JSON.stringify(signups, null, 2));

    console.log(`New beta signup: ${name} <${email}> from ${source}`);

    res.json({
      success: true,
      message: "Successfully registered for beta access!",
      id: signup.id,
    });
  } catch (error) {
    console.error("Beta signup error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get signup stats (protected endpoint)
app.get("/api/stats", async (req, res) => {
  try {
    // Simple API key protection
    const apiKey = req.headers["x-api-key"];
    if (
      apiKey !== process.env.ADMIN_API_KEY &&
      apiKey !== "snakkaz-admin-2025"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await fs.readFile(DATA_FILE, "utf8");
    const signups = JSON.parse(data);

    const stats = {
      total: signups.length,
      today: signups.filter((s) => {
        const today = new Date().toDateString();
        const signupDate = new Date(s.timestamp).toDateString();
        return today === signupDate;
      }).length,
      sources: signups.reduce((acc, s) => {
        acc[s.source] = (acc[s.source] || 0) + 1;
        return acc;
      }, {}),
      recent: signups.slice(-10).reverse(),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Could not load stats" });
  }
});

// Export signups (protected)
app.get("/api/export", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (
      apiKey !== process.env.ADMIN_API_KEY &&
      apiKey !== "snakkaz-admin-2025"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await fs.readFile(DATA_FILE, "utf8");
    const signups = JSON.parse(data);

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="snakkaz-beta-signups.json"'
    );
    res.json(signups);
  } catch (error) {
    res.status(500).json({ error: "Export failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SnakkaZ MCP API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Beta signup: POST http://localhost:${PORT}/api/beta-signup`);
});

module.exports = app;

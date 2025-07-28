const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - send all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 SnakkaZ Beta server running at http://localhost:${port}`);
  console.log(`📱 All routes (login, register, demo, beta) now work!`);
});
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS for SnakkaZ integration  
app.use(cors({
  origin: ['https://www.snakkaz.com', 'https://snakkaz.com'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MCP Server endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'MCP Server Active', timestamp: new Date() });
});

app.post('/api/mcp', (req, res) => {
  const { message, type } = req.body;
  
  // Simple MCP response logic
  const responses = {
    'greeting': 'Hei! Jeg er SnakkaZ MCP Server. Hvordan kan jeg hjelpe deg?',
    'help': 'Jeg tilbyr AI-assistanse, chat-tjenester og API-integrasjon.',
    'status': 'MCP Server kjører perfekt og er klar for inntektsgenerering!',
    'default': `Du skrev: "${message}". MCP Server mottok forespørselen og behandler den.`
  };
  
  const response = responses[type] || responses.default;
  
  res.json({
    success: true,
    response: response,
    timestamp: new Date(),
    server: 'SnakkaZ MCP'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>SnakkaZ MCP Server</h1>
    <p>Status: Active and ready for revenue generation!</p>
    <p>API Endpoint: <a href="/api/health">/api/health</a></p>
    <p>Main Site: <a href="https://www.snakkaz.com">www.snakkaz.com</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on port ${PORT}`);
});

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './NorwegianAurora.css';

// TestSprite MCP Mock Client for demonstration
class MockTestspriteClient {
  private apiKey: string;

  constructor(config: { apiKey: string; baseURL?: string }) {
    this.apiKey = config.apiKey;
    console.log('🧪 TestSprite MCP Client initialized');
  }

  async runTest(testConfig: any) {
    console.log('🧪 Running TestSprite test:', testConfig.name);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      testId: Math.random().toString(36).substr(2, 9),
      name: testConfig.name,
      status: 'passed',
      timestamp: new Date().toISOString(),
      steps: testConfig.steps?.length || 0,
      assertions: testConfig.assertions?.length || 0,
      duration: Math.random() * 1000 + 500,
      result: 'All tests passed successfully! 🎉'
    };
  }
}

const testspriteClient = new MockTestspriteClient({
  apiKey: 'sk-user--7d02QRc1B4I5nUbETePhYsweHh08fqcHqI59K-ZiKRtRwlf1NZSRelfHfoi2mIf3Mv2du-SbgIa5rhzgopzt54XSk8lgEUXJlXI0HWrjj1xvciNvCR_b_ldrPaBgy4zO2M'
});

const AuroraLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const testResult = await testspriteClient.runTest({
        name: 'SnakkaZ Norwegian Aurora Login Test',
        description: 'Testing login functionality with TestSprite MCP',
        steps: [
          { action: 'fill', selector: 'input[type="email"]', value: email },
          { action: 'fill', selector: 'input[type="password"]', value: password },
          { action: 'click', selector: '.aurora-primary-btn' }
        ],
        assertions: [
          { type: 'elementVisible', selector: '.aurora-login-card', expected: true }
        ]
      });

      setTestResults(testResult);
    } catch (error) {
      console.error('TestSprite Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aurora-container">
      <div className="aurora-background">
        <div className="aurora-wave"></div>
        <div className="aurora-wave"></div>
        <div className="aurora-wave"></div>
      </div>

      <div className="aurora-login-card">
        <h1 className="aurora-logo">SNAKKAZ</h1>
        <p className="aurora-tagline">Norwegian Aurora Chat System</p>
        <p className="aurora-subtitle">🧪 Powered by TestSprite MCP</p>

        <div className="aurora-form">
          <div className="aurora-input-group">
            <input
              type="email"
              placeholder="din@email.no"
              className="aurora-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="aurora-input-group">
            <input
              type="password"
              placeholder="Passord"
              className="aurora-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="aurora-social-buttons">
            <button className="aurora-social-btn aurora-github">
              <span className="aurora-icon">🐙</span>
              GitHub
            </button>
            <button className="aurora-social-btn aurora-google">
              <span className="aurora-icon">🔍</span>
              Google
            </button>
          </div>

          <button
            className="aurora-primary-btn"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? '🧪 Testing...' : '🚀 Logg Inn'}
          </button>

          {testResults && (
            <div className="aurora-test-results">
              <h3>🧪 TestSprite Results:</h3>
              <div className="test-result-item">
                <strong>✅ {testResults.name}</strong>
                <p>Status: <span className="status-passed">{testResults.status}</span></p>
                <p>Duration: {testResults.duration?.toFixed(0)}ms</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuroraLogin />
    </Router>
  );
};

export default App;

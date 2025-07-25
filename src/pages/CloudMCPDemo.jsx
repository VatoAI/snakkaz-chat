import React from 'react';
import '../styles/cloudmcp-liquid-glass.css';

const CloudMCPDemo = () => {
  return (
    <div className="cloudmcp-container">
      <div className="cloudmcp-header">
        <div className="cloudmcp-brand">
          <div className="cloudmcp-logo">⚡</div>
          <h1 className="cloudmcp-title">CloudMCP</h1>
        </div>
        <p className="cloudmcp-subtitle">Quantum Intelligence Network</p>
      </div>

      <div className="cloudmcp-content">
        <div className="cloudmcp-grid">
          
          {/* Demo Chat Interface */}
          <div className="cloudmcp-panel">
            <div className="panel-header">
              <h3>Neural Chat Interface</h3>
              <div className="status-indicator active"></div>
            </div>
            <div className="chat-demo">
              <div className="message-bubble ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  Welcome to CloudMCP! I&apos;m your quantum AI assistant. How can I help you today?
                </div>
              </div>
              <div className="message-bubble user">
                <div className="message-content">
                  Show me the system status
                </div>
                <div className="message-avatar">👤</div>
              </div>
              <div className="message-bubble ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  All systems operational. Quantum processors running at 98.7% efficiency.
                  <div className="system-metrics">
                    <div className="metric">
                      <span className="metric-label">CPU:</span>
                      <span className="metric-value">98.7%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Memory:</span>
                      <span className="metric-value">847TB</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Network:</span>
                      <span className="metric-value">∞ Gbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="input-area">
              <input 
                type="text" 
                placeholder="Type your message to the quantum AI..."
                className="chat-input"
                disabled
              />
              <button className="send-button" disabled>⚡</button>
            </div>
          </div>

          {/* System Status Panel */}
          <div className="cloudmcp-panel">
            <div className="panel-header">
              <h3>Quantum Status</h3>
              <div className="status-indicator active"></div>
            </div>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-icon">🔮</div>
                <div className="status-info">
                  <div className="status-label">Quantum Core</div>
                  <div className="status-value">Online</div>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">🌐</div>
                <div className="status-info">
                  <div className="status-label">Neural Network</div>
                  <div className="status-value">Connected</div>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">⚡</div>
                <div className="status-info">
                  <div className="status-label">Power Core</div>
                  <div className="status-value">Stable</div>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">🛡️</div>
                <div className="status-info">
                  <div className="status-label">Security</div>
                  <div className="status-value">Maximum</div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Visualization */}
          <div className="cloudmcp-panel">
            <div className="panel-header">
              <h3>Data Flow</h3>
              <div className="status-indicator active"></div>
            </div>
            <div className="data-viz">
              <div className="data-stream">
                <div className="stream-line"></div>
                <div className="stream-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
              <div className="data-metrics">
                <div className="metric-large">
                  <div className="metric-number">2.4PB</div>
                  <div className="metric-label">Data Processed</div>
                </div>
                <div className="metric-large">
                  <div className="metric-number">847</div>
                  <div className="metric-label">Active Connections</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Interface */}
          <div className="cloudmcp-panel">
            <div className="panel-header">
              <h3>Quantum Controls</h3>
              <div className="status-indicator active"></div>
            </div>
            <div className="controls-grid">
              <button className="control-btn primary">Initialize Neural Link</button>
              <button className="control-btn secondary">Boost Quantum Core</button>
              <button className="control-btn tertiary">Calibrate Matrix</button>
              <button className="control-btn warning">Emergency Protocol</button>
            </div>
            <div className="quantum-dial">
              <div className="dial-center">
                <div className="dial-value">98.7%</div>
                <div className="dial-label">Efficiency</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Navigation */}
      <div className="floating-nav">
        <div className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">💬</span>
          <span className="nav-label">Chat</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-label">Analytics</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </div>
      </div>

      {/* Footer */}
      <div className="cloudmcp-footer">
        <p>CloudMCP v2.1.0 | Quantum Intelligence Network | © 2025</p>
        <div className="footer-stats">
          <span>Uptime: 99.98%</span>
          <span>•</span>
          <span>Response: 0.001ms</span>
          <span>•</span>
          <span>Users: 10M+</span>
        </div>
      </div>
    </div>
  );
};

export default CloudMCPDemo;

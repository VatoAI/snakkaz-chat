import React from 'react';

interface MCPMetricsProps {
  stats: {
    users: number;
    chats: number;
    messages: number;
    systemStatus: string;
    lastUpdated: Date;
  };
}

/**
 * MCP Metrics Component
 * 
 * Displays metrics and charts related to the MCP system performance
 * and usage statistics.
 */
const MCPMetrics: React.FC<MCPMetricsProps> = ({ stats }) => {
  return (
    <div className="mcp-metrics">
      <h2 className="component-title">Systemmetrikker</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Bruksstatistikk</h3>
            <div className="time-period">Siste 30 dager</div>
          </div>
          
          <div className="chart-container">
            <div className="mock-chart usage-chart">
              <div className="chart-bar" style={{ height: '60%' }}></div>
              <div className="chart-bar" style={{ height: '45%' }}></div>
              <div className="chart-bar" style={{ height: '75%' }}></div>
              <div className="chart-bar" style={{ height: '90%' }}></div>
              <div className="chart-bar" style={{ height: '65%' }}></div>
              <div className="chart-bar" style={{ height: '80%' }}></div>
              <div className="chart-bar" style={{ height: '70%' }}></div>
            </div>
            <div className="chart-labels">
              <div>Man</div>
              <div>Tir</div>
              <div>Ons</div>
              <div>Tor</div>
              <div>Fre</div>
              <div>Lør</div>
              <div>Søn</div>
            </div>
          </div>
          
          <div className="metrics-summary">
            <div className="metric-item">
              <div className="metric-value">125</div>
              <div className="metric-label">Daglige brukere</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">3,750</div>
              <div className="metric-label">Månedlige brukere</div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <h3>Meldingsvolum</h3>
            <div className="time-period">Siste 30 dager</div>
          </div>
          
          <div className="chart-container">
            <div className="mock-chart messages-chart">
              <div className="chart-line"></div>
            </div>
          </div>
          
          <div className="metrics-summary">
            <div className="metric-item">
              <div className="metric-value">1,842</div>
              <div className="metric-label">Totale meldinger</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">61.4</div>
              <div className="metric-label">Daglig gjennomsnitt</div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <h3>E-postsystem</h3>
            <div className="time-period">Leveringsstatistikk</div>
          </div>
          
          <div className="chart-container">
            <div className="mock-chart pie-chart">
              <div className="pie-segment" style={{ transform: 'rotate(0deg)', backgroundColor: '#4caf50' }}></div>
              <div className="pie-segment" style={{ transform: 'rotate(280deg)', backgroundColor: '#ff9800' }}></div>
              <div className="pie-segment" style={{ transform: 'rotate(330deg)', backgroundColor: '#f44336' }}></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
                <div>Levert (78%)</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
                <div>Åpnet (14%)</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#f44336' }}></div>
                <div>Mislyktes (8%)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <h3>Systemytelse</h3>
            <div className="time-period">Gjennomsnittlig svartid</div>
          </div>
          
          <div className="performance-metrics">
            <div className="performance-item">
              <div className="performance-label">API-responstid</div>
              <div className="performance-bar-container">
                <div className="performance-bar" style={{ width: '15%' }}></div>
                <div className="performance-value">154ms</div>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Databasespørringer</div>
              <div className="performance-bar-container">
                <div className="performance-bar" style={{ width: '25%' }}></div>
                <div className="performance-value">245ms</div>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Krypteringsprosesser</div>
              <div className="performance-bar-container">
                <div className="performance-bar" style={{ width: '35%' }}></div>
                <div className="performance-value">352ms</div>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-label">E-postleveranse</div>
              <div className="performance-bar-container">
                <div className="performance-bar" style={{ width: '65%' }}></div>
                <div className="performance-value">652ms</div>
              </div>
            </div>
          </div>
          
          <div className="system-health-status">
            <div className="health-indicator">
              <div className={`indicator ${stats.systemStatus}`}></div>
              <div>Systemhelse: {stats.systemStatus === 'healthy' ? 'God' : 'Krever oppmerksomhet'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="export-section">
        <button className="export-button">Eksporter rapporter</button>
        <div className="last-updated">
          Sist oppdatert: {stats.lastUpdated.toLocaleString()}
        </div>
      </div>
      
      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .metric-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }
        
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .metric-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .time-period {
          font-size: 0.8rem;
          color: #666;
        }
        
        .chart-container {
          height: 200px;
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .mock-chart {
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 25px;
        }
        
        .chart-bar {
          width: 30px;
          background-color: #d4af37;
          border-radius: 4px 4px 0 0;
        }
        
        .chart-labels {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #666;
        }
        
        .metrics-summary {
          display: flex;
          justify-content: space-around;
        }
        
        .metric-item {
          text-align: center;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }
        
        .metric-label {
          font-size: 0.8rem;
          color: #666;
        }
        
        .messages-chart {
          position: relative;
        }
        
        .chart-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 3px;
          background: linear-gradient(90deg, 
            #d4af37 0%, 
            #d4af37 20%, 
            #88a4bc 40%, 
            #88a4bc 60%, 
            #d4af37 80%, 
            #d4af37 100%
          );
          border-radius: 2px;
        }
        
        .messages-chart::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(0, 0, 0, 0.05) 40px,
            rgba(0, 0, 0, 0.05) 41px
          );
        }
        
        .pie-chart {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #eee;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
        }
        
        .pie-segment {
          position: absolute;
          width: 100%;
          height: 100%;
          clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
        }
        
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .performance-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .performance-label {
          font-size: 0.9rem;
        }
        
        .performance-bar-container {
          height: 8px;
          background-color: #eee;
          border-radius: 4px;
          position: relative;
        }
        
        .performance-bar {
          height: 100%;
          background-color: #d4af37;
          border-radius: 4px;
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .performance-value {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
        }
        
        .system-health-status {
          margin-top: 1.5rem;
          text-align: center;
        }
        
        .health-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #f8f8f8;
          border-radius: 100px;
        }
        
        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .indicator.healthy {
          background-color: #4caf50;
        }
        
        .indicator.warning {
          background-color: #ff9800;
        }
        
        .indicator.error {
          background-color: #f44336;
        }
        
        .export-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .export-button {
          padding: 0.75rem 1.5rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .export-button:hover {
          background-color: #d4af37;
          color: black;
        }
        
        .last-updated {
          font-size: 0.8rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MCPMetrics;

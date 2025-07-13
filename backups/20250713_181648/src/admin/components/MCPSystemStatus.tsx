import React, { useEffect, useState } from 'react';

interface MCPSystemStatusProps {
  systemStatus: string;
  controllers: any;
  presenters: any;
}

/**
 * MCP System Status Component
 * 
 * Displays the current status of the MCP system, including:
 * - System health
 * - Controllers status
 * - Presenters status
 * - Recent activities
 */
const MCPSystemStatus: React.FC<MCPSystemStatusProps> = ({ systemStatus, controllers, presenters }) => {
  const [lastActivity, setLastActivity] = useState<string[]>([
    'System initialized successfully',
    'Controllers connected',
    'Presenters connected',
    'Mock data created for testing'
  ]);
  
  // Simulated system checks
  const [systemChecks, setSystemChecks] = useState({
    encryption: { status: 'healthy', message: 'E2EE functioning properly' },
    database: { status: 'healthy', message: 'Database connections active' },
    apiServices: { status: 'healthy', message: 'API services responding' },
    authentication: { status: 'healthy', message: 'Auth services operational' }
  });
  
  useEffect(() => {
    // Simulate a log of system activities
    const activityInterval = setInterval(() => {
      const activities = [
        `User authentication verified [${new Date().toLocaleTimeString()}]`,
        `Message encryption completed [${new Date().toLocaleTimeString()}]`,
        `Chat synchronization successful [${new Date().toLocaleTimeString()}]`,
        `System health check passed [${new Date().toLocaleTimeString()}]`,
        `API connection verified [${new Date().toLocaleTimeString()}]`
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLastActivity(prev => [randomActivity, ...prev.slice(0, 9)]);
    }, 8000);
    
    return () => clearInterval(activityInterval);
  }, []);
  
  // Get controllers and presenters info
  const controllersInfo = Object.entries(controllers).map(([name, controller]) => ({
    name: name.replace('Controller', ''),
    status: 'active',
    type: 'controller'
  }));
  
  const presentersInfo = Object.entries(presenters).map(([name, presenter]) => ({
    name: name.replace('Presenter', ''),
    status: 'active',
    type: 'presenter'
  }));
  
  const components = [...controllersInfo, ...presentersInfo];
  
  return (
    <div className="mcp-system-status">
      <h2 className="component-title">Systemstatus</h2>
      
      <div className="status-grid">
        <div className="status-section system-health">
          <h3>Systemhelse</h3>
          <div className="health-checks">
            {Object.entries(systemChecks).map(([key, check]) => (
              <div key={key} className="health-check-item">
                <div className="check-name">{key}</div>
                <div className={`check-status ${check.status}`}>
                  <span className="status-dot"></span>
                  {check.message}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="status-section components-status">
          <h3>MCP Komponenter</h3>
          <div className="components-grid">
            {components.map((component, index) => (
              <div key={index} className={`component-card ${component.type}`}>
                <div className="component-icon">
                  {component.type === 'controller' ? '🔄' : '📊'}
                </div>
                <div className="component-name">{component.name}</div>
                <div className="component-status">{component.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="status-section activity-log">
        <h3>Nylig aktivitet</h3>
        <div className="activity-list">
          {lastActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              {activity}
            </div>
          ))}
        </div>
      </div>
      
      <div className="status-section system-tools">
        <h3>Systemverktøy</h3>
        <div className="tools-container">
          <button className="system-tool-button">Restart MCP</button>
          <button className="system-tool-button">Verifiser integritet</button>
          <button className="system-tool-button">Test kryptering</button>
          <button className="system-tool-button">Generer systemrapport</button>
        </div>
      </div>
      
      <style jsx>{`
        .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .status-section {
          margin-bottom: 2rem;
        }
        
        .status-section h3 {
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .health-checks {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .health-check-item {
          display: flex;
          justify-content: space-between;
          background-color: #f8f8f8;
          padding: 0.75rem;
          border-radius: 4px;
        }
        
        .check-name {
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .check-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .check-status.healthy {
          color: #4caf50;
        }
        
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #4caf50;
          display: inline-block;
        }
        
        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }
        
        .component-card {
          background-color: #f8f8f8;
          border-radius: 4px;
          padding: 1rem;
          text-align: center;
        }
        
        .component-card.controller {
          border-bottom: 3px solid #2196f3;
        }
        
        .component-card.presenter {
          border-bottom: 3px solid #ff9800;
        }
        
        .component-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .component-name {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .component-status {
          font-size: 0.8rem;
          color: #4caf50;
        }
        
        .activity-list {
          background-color: #f8f8f8;
          border-radius: 4px;
          padding: 1rem;
          max-height: 250px;
          overflow-y: auto;
        }
        
        .activity-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .tools-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .system-tool-button {
          padding: 0.75rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .system-tool-button:hover {
          background-color: #d4af37;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default MCPSystemStatus;

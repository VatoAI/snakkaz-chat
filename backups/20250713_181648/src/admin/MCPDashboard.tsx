import React, { useState, useEffect } from 'react';
import { SimplifiedMCPFactory } from '../services/encryption/mcp-simplified';
import { User, Message, Chat } from '../services/encryption/mcp-simplified';
import MCPSystemStatus from './components/MCPSystemStatus';
import MCPUserManagement from './components/MCPUserManagement';
import MCPChatManagement from './components/MCPChatManagement';
import MCPEmailIntegration from './components/MCPEmailIntegration';
import MCPMetrics from './components/MCPMetrics';
import RealtimeDashboard from './components/RealtimeDashboard';
import './MCPDashboard.css';

/**
 * MCP Admin Dashboard
 * 
 * Provides a comprehensive dashboard to monitor and manage the MCP architecture
 * in the Snakkaz application.
 */
const MCPDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mcpStats, setMcpStats] = useState({
    users: 0,
    chats: 0,
    messages: 0,
    systemStatus: 'healthy',
    lastUpdated: new Date()
  });
  
  // Initialize MCP system
  const [mcpSystem, setMcpSystem] = useState<any>(null);
  
  useEffect(() => {
    // Initialize the MCP system
    const mcp = SimplifiedMCPFactory.createMCPStack();
    setMcpSystem(mcp);
    
    // Create demo data for the dashboard
    const setupDemoData = async () => {
      try {
        const { userController, chatController, messageController } = mcp.controllers;
        
        // Create test users
        const user1 = await userController.registerUser('johndoe', 'John Doe');
        const user2 = await userController.registerUser('janedoe', 'Jane Doe');
        const user3 = await userController.registerUser('mikebrown', 'Mike Brown');
        
        // Create chats
        const chat1 = await chatController.createChat('General Chat', [user1, user2, user3], 'GROUP');
        const chat2 = await chatController.createChat('Support', [user1, user3], 'GROUP');
        
        // Send messages
        await messageController.sendMessage(chat1.id, user1.id, 'Hello everyone!');
        await messageController.sendMessage(chat1.id, user2.id, 'Hi John, how are you?');
        await messageController.sendMessage(chat1.id, user1.id, 'I\'m doing great, thanks for asking!');
        await messageController.sendMessage(chat2.id, user3.id, 'Any support issues to discuss?');
        
        // Update stats
        setMcpStats({
          users: 3,
          chats: 2,
          messages: 4,
          systemStatus: 'healthy',
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Error setting up demo data:', error);
      }
    };
    
    setupDemoData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMcpStats(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // If MCP system is not initialized yet
  if (!mcpSystem) {
    return <div className="mcp-dashboard-loading">Initialiserer MCP Dashboard...</div>;
  }
  
  return (
    <div className="mcp-dashboard">
      <header className="mcp-dashboard-header">
        <h1>Snakkaz MCP Dashboard</h1>
        <div className="system-status">
          System Status: 
          <span className={`status-indicator ${mcpStats.systemStatus}`}>
            {mcpStats.systemStatus === 'healthy' ? 'Fungerer normalt' : 'Krever oppmerksomhet'}
          </span>
        </div>
      </header>
      
      <div className="mcp-stats-summary">
        <div className="stat-card">
          <h3>Brukere</h3>
          <div className="stat-value">{mcpStats.users}</div>
        </div>
        <div className="stat-card">
          <h3>Chatter</h3>
          <div className="stat-value">{mcpStats.chats}</div>
        </div>
        <div className="stat-card">
          <h3>Meldinger</h3>
          <div className="stat-value">{mcpStats.messages}</div>
        </div>
        <div className="stat-card">
          <h3>Sist oppdatert</h3>
          <div className="stat-value">{mcpStats.lastUpdated.toLocaleTimeString()}</div>
        </div>
      </div>
      
      <nav className="mcp-dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Oversikt
        </button>
        <button 
          className={activeTab === 'realtime' ? 'active' : ''}
          onClick={() => setActiveTab('realtime')}
        >
          Sanntid
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Brukeradministrasjon
        </button>
        <button 
          className={activeTab === 'chats' ? 'active' : ''}
          onClick={() => setActiveTab('chats')}
        >
          Chat-administrasjon
        </button>
        <button 
          className={activeTab === 'email' ? 'active' : ''}
          onClick={() => setActiveTab('email')}
        >
          E-postsystem
        </button>
        <button 
          className={activeTab === 'metrics' ? 'active' : ''}
          onClick={() => setActiveTab('metrics')}
        >
          Metrikker
        </button>
      </nav>
      
      <main className="mcp-dashboard-content">
        {activeTab === 'overview' && (
          <MCPSystemStatus 
            systemStatus={mcpStats.systemStatus} 
            controllers={mcpSystem.controllers}
            presenters={mcpSystem.presenters}
          />
        )}
        
        {activeTab === 'users' && (
          <MCPUserManagement 
            userController={mcpSystem.controllers.userController}
            userPresenter={mcpSystem.presenters.userPresenter}
          />
        )}
        
        {activeTab === 'chats' && (
          <MCPChatManagement 
            chatController={mcpSystem.controllers.chatController}
            messageController={mcpSystem.controllers.messageController}
            userController={mcpSystem.controllers.userController}
          />
        )}
        
        {activeTab === 'email' && (
          <MCPEmailIntegration />
        )}
        
        {activeTab === 'metrics' && (
          <MCPMetrics 
            stats={mcpStats}
          />
        )}
      </main>
      
      <footer className="mcp-dashboard-footer">
        <p>Snakkaz MCP Dashboard © 2025 | Model-Controller-Presenter Architecture</p>
      </footer>
    </div>
  );
};

export default MCPDashboard;

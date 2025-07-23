// src/components/MCPDashboard.tsx - Live MCP Monitoring Component
import React, { useState, useEffect } from 'react';
import { useMCPFallback } from '../hooks/useMCPFallback';

export const MCPDashboard: React.FC = () => {
  const { mcpStatus, isConnected, lastHeartbeat, openMCPDashboard, testAllConnections } = useMCPFallback();
  const [isExpanded, setIsExpanded] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleTestConnections = async () => {
    const results = await testAllConnections();
    setTestResults(results);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
            isConnected 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white' : 'bg-red-200'} animate-pulse`} />
          <span className="text-sm font-medium">MCP</span>
          <span className="text-xs opacity-75">
            {mcpStatus?.chatMessages || 0}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <h3 className="font-semibold text-gray-800">MCP Server Status</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {mcpStatus && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${mcpStatus.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {mcpStatus.status.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Uptime:</span>
            <span className="font-mono text-gray-800">{mcpStatus.uptime}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Requests:</span>
            <span className="font-mono text-blue-600">{mcpStatus.requests.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Chat Messages:</span>
            <span className="font-mono text-purple-600">{mcpStatus.chatMessages.toLocaleString()}</span>
          </div>
          
          {lastHeartbeat && (
            <div className="flex justify-between">
              <span className="text-gray-600">Last Check:</span>
              <span className="font-mono text-gray-600 text-xs">
                {lastHeartbeat.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleTestConnections}
          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
        >
          Test
        </button>
        <button
          onClick={openMCPDashboard}
          className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded transition-colors"
        >
          Dashboard
        </button>
      </div>

      {testResults && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
          <div className="font-medium text-gray-700">Test Results:</div>
          <div className="text-gray-600">
            MCP: {testResults.mcp ? '✅ Connected' : '❌ Failed'}
          </div>
          <div className="text-gray-500">
            {testResults.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <div className="text-red-700 text-sm font-medium">⚠️ MCP Disconnected</div>
          <div className="text-red-600 text-xs">WebRTC only mode active</div>
        </div>
      )}
    </div>
  );
};

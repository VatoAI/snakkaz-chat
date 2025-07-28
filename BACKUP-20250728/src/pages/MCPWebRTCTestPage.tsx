import React, { useState, useEffect } from 'react';
import { useMCPWebRTC } from '@/providers/MCPWebRTCProvider';
import MCPWebRTCStatus from '@/components/chat/MCPWebRTCStatus';

// Eksporter komponenten som default for lazy loading
const MCPWebRTCTestPage: React.FC = () => {
  const [remotePeerId, setRemotePeerId] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{from: string, message: string, timestamp: number}>>([]);
  
  // MCP WebRTC context
  const { 
    isInitialized, 
    isConnecting, 
    error, 
    stats, 
    connectTo, 
    sendMessage,
    controller
  } = useMCPWebRTC();
  
  // Registrer meldingslytter
  useEffect(() => {
    if (controller && isInitialized) {
      controller.onMessage((from: string, msg: any) => {
        setChatHistory(prev => [...prev, {
          from,
          message: typeof msg === 'string' ? msg : JSON.stringify(msg),
          timestamp: Date.now()
        }]);
      });
    }
  }, [controller, isInitialized]);
  
  // Legg til lytter for innkommende meldinger
  useEffect(() => {
    if (isInitialized) {
      onMessage((from, message) => {
        setChatHistory(prev => [
          ...prev, 
          { 
            from, 
            message: typeof message === 'string' ? message : JSON.stringify(message),
            timestamp: Date.now() 
          }
        ]);
      });
    }
  }, [isInitialized, onMessage]);
  
  // Koble til en annen peer
  const handleConnect = async () => {
    if (!remotePeerId) return;
    
    try {
      const success = await connectTo(remotePeerId);
      if (success) {
        console.log(`Tilkoblet til ${remotePeerId}`);
      } else {
        console.error(`Kunne ikke koble til ${remotePeerId}`);
      }
    } catch (err) {
      console.error('Tilkoblingsfeil:', err);
    }
  };
  
  // Send melding
  const handleSendMessage = async () => {
    if (!remotePeerId || !message) return;
    
    try {
      const success = await sendMessage(remotePeerId, message);
      
      if (success) {
        // Legg til meldingen i chat-historien
        setChatHistory(prev => [
          ...prev, 
          { from: 'me', message, timestamp: Date.now() }
        ]);
        
        // Tøm meldingsfeltet
        setMessage('');
      } else {
        console.error(`Kunne ikke sende melding til ${remotePeerId}`);
      }
    } catch (err) {
      console.error('Sendingsfeil:', err);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">MCP WebRTC Test</h1>
      
      {/* Status og feil */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 p-3 rounded">
            <h3 className="font-semibold">Status:</h3>
            <p>
              {isConnecting && 'Kobler til...'}
              {!isConnecting && isInitialized && 'Tilkoblet'}
              {!isConnecting && !isInitialized && 'Ikke tilkoblet'}
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <h3 className="font-semibold">Statistikk:</h3>
            <pre className="text-xs">{stats ? JSON.stringify(stats, null, 2) : 'Ingen statistikk tilgjengelig'}</pre>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-semibold">Feil:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
      
      {/* Tilkobling */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Koble til</h2>
        <div className="flex">
          <input 
            type="text" 
            value={remotePeerId} 
            onChange={(e) => setRemotePeerId(e.target.value)}
            placeholder="Oppgi Peer ID"
            className="flex-1 p-2 border rounded-l"
          />
          <button 
            onClick={handleConnect}
            disabled={!isInitialized || !remotePeerId}
            className="bg-blue-600 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
          >
            Koble til
          </button>
        </div>
      </div>
      
      {/* Chat */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>
        
        {/* Chat-historikk */}
        <div className="border rounded h-64 p-3 mb-3 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 italic">Ingen meldinger enda...</p>
          ) : (
            chatHistory.map((entry, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded ${entry.from === 'me' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'}`}
              >
                <div className="text-xs text-gray-600">
                  {entry.from === 'me' ? 'Deg' : entry.from} - {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
                <div>{entry.message}</div>
              </div>
            ))
          )}
        </div>
        
        {/* Meldingsinput */}
        <div className="flex">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv en melding..."
            className="flex-1 p-2 border rounded-l"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!isInitialized || !remotePeerId || !message}
            className="bg-green-600 text-white px-4 py-2 rounded-r disabled:bg-green-300"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* MCPWebRTCStatus komponent */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Detaljert Status</h2>
        <MCPWebRTCStatus 
          userId="test-user" 
          serverUrl={process.env.REACT_APP_MCP_SERVER_URL || 'wss://mcp.snakkaz.com'}
        />
      </div>
    </div>
  );
};

export default MCPWebRTCTestPage;

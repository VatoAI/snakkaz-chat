import React, { useEffect, useState } from 'react';
import {
  useWebRTC,
  useWebRTCDirectMessaging,
  useSignaling,
  WebRTCStatus,
  WebRTCMonitor,
  initializeWebRTCChat,
  useIntegratedChatWrapper
} from '../../utils/webrtc';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  sent: boolean;
  received: boolean;
  error?: string;
}

/**
 * Test component for verifying WebRTC implementation
 * This component demonstrates using our new WebRTC hooks and components
 */
const WebRTCImplementationTest: React.FC = () => {
  const [userId] = useState<string>(() => `user-${Math.floor(Math.random() * 10000)}`);
  const [peerId, setPeerId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize WebRTC core functionality
  const webrtc = useWebRTC();
  const signaling = useSignaling(userId);

  // Connect to peer when specified
  const directMessaging = useWebRTCDirectMessaging(userId, peerId);

  // Handle new peer connection
  const handleConnectToPeer = () => {
    if (!peerId) {
      setConnectionError('Please enter a peer ID');
      return;
    }
    
    setConnectionError(null);
    directMessaging.connect().catch(err => {
      setConnectionError(`Failed to connect: ${err.message}`);
    });
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: userId,
      content: message,
      timestamp: Date.now(),
      sent: false,
      received: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    directMessaging.sendMessage(message).then(success => {
      if (success) {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, sent: true } 
            : msg
        ));
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, error: 'Failed to send' } 
            : msg
        ));
      }
    }).catch(err => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, error: err.message } 
          : msg
      ));
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">WebRTC Implementation Test</h1>
      
      <div className="mb-4">
        <p>Your User ID: <strong>{userId}</strong></p>
        
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={peerId}
            onChange={e => setPeerId(e.target.value)}
            placeholder="Enter peer ID to connect"
            className="border p-2 rounded mr-2 flex-1"
          />
          <button 
            onClick={handleConnectToPeer}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect
          </button>
        </div>
        
        {connectionError && (
          <p className="text-red-500 mt-2">{connectionError}</p>
        )}
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Connection Status</h2>
        <WebRTCStatus 
          connectionStatus={directMessaging.connectionState}
          isEncrypted={directMessaging.isEncrypted}
          latency={directMessaging.latency}
          className="mb-2"
        />
        
        <WebRTCMonitor 
          userId={userId}
          peerId={peerId}
          className="mt-4"
        />
      </div>
      
      {directMessaging.connectionState === 'p2p' && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Chat</h2>
          <div className="border rounded p-4 h-64 overflow-y-auto mb-2">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`mb-2 p-2 rounded ${msg.sender === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`} style={{ maxWidth: '80%' }}>
                  <p>{msg.content}</p>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    <span>
                      {msg.error ? (
                        <span className="text-red-500">{msg.error}</span>
                      ) : msg.sent ? (
                        <span>✓ Sent</span>
                      ) : (
                        <span>Sending...</span>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message"
              className="border p-2 rounded mr-2 flex-1"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={directMessaging.connectionState !== 'p2p'}
            >
              Send
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Debug Information</h3>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify({
            webrtc: {
              peers: webrtc.peers?.length || 0,
              connectionCount: webrtc.connections?.size || 0,
              ready: webrtc.ready
            },
            directMessaging: {
              state: directMessaging.connectionState,
              encrypted: directMessaging.isEncrypted,
              latency: directMessaging.latency,
              reconnectAttempts: directMessaging.reconnectAttempts,
              messageQueue: directMessaging.messageQueue
            },
            signaling: {
              isSignalingReady: signaling.isSignalingReady,
              onlinePeers: signaling.onlinePeers?.length || 0
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WebRTCImplementationTest;

import React, { useState, useEffect } from 'react';
import { Chat, User } from '../../services/encryption/mcp-simplified';

interface MCPChatManagementProps {
  chatController: any;
  messageController: any;
  userController: any;
}

/**
 * MCP Chat Management Component
 * 
 * Provides an interface for managing chats within the MCP system:
 * - View and search chats
 * - View chat details and messages
 * - Create new chats
 * - Add/remove participants
 */
const MCPChatManagement: React.FC<MCPChatManagementProps> = ({ 
  chatController, 
  messageController,
  userController
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState<any[]>([]);
  const [newChatData, setNewChatData] = useState({
    name: '',
    selectedParticipants: [] as string[]
  });
  
  // Load chats and users
  useEffect(() => {
    // Get all chats from controller
    const allChats = chatController.getAllChats();
    setChats(allChats);
    
    // Get all users
    const allUsers = userController.getAllUsers();
    setUsers(allUsers);
  }, [chatController, userController]);
  
  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const chatMessages = messageController.getMessagesForChat(selectedChat.id);
      setSelectedChatMessages(chatMessages);
    } else {
      setSelectedChatMessages([]);
    }
  }, [selectedChat, messageController]);
  
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };
  
  const handleCreateChat = async () => {
    if (!newChatData.name || newChatData.selectedParticipants.length === 0) return;
    
    try {
      // Get user objects from selected IDs
      const participants = newChatData.selectedParticipants.map(id => 
        users.find(user => user.id === id)
      ).filter(Boolean) as User[];
      
      // Create a new chat
      const newChat = await chatController.createChat(
        newChatData.name, 
        participants, 
        'GROUP'
      );
      
      // Update chat list
      setChats(prev => [...prev, newChat]);
      
      // Reset form
      setNewChatData({
        name: '',
        selectedParticipants: []
      });
      
      // Select the new chat
      setSelectedChat(newChat);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };
  
  const toggleUserSelection = (userId: string) => {
    setNewChatData(prev => {
      const isSelected = prev.selectedParticipants.includes(userId);
      if (isSelected) {
        return {
          ...prev,
          selectedParticipants: prev.selectedParticipants.filter(id => id !== userId)
        };
      } else {
        return {
          ...prev,
          selectedParticipants: [...prev.selectedParticipants, userId]
        };
      }
    });
  };
  
  const getUserDisplayName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.displayName : 'Unknown User';
  };
  
  return (
    <div className="mcp-chat-management">
      <h2 className="component-title">Chat-administrasjon</h2>
      
      <div className="chat-management-container">
        <div className="chat-list-section">
          <div className="section-header">
            <h3>Chatter</h3>
          </div>
          
          <div className="chats-list">
            {chats.length === 0 ? (
              <div className="no-chats">Ingen chatter funnet</div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="chat-icon">💬</div>
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-participants">
                      {chat.participantIds.length} deltakere
                    </div>
                  </div>
                  <div className="chat-date">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="create-chat-section">
            <h3>Opprett ny chat</h3>
            
            <div className="form-group">
              <label>Chatnavn:</label>
              <input 
                type="text" 
                value={newChatData.name}
                onChange={e => setNewChatData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="eks. Prosjektdiskusjon"
              />
            </div>
            
            <div className="form-group">
              <label>Velg deltakere:</label>
              <div className="user-selection">
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className={`user-selection-item ${
                      newChatData.selectedParticipants.includes(user.id) ? 'selected' : ''
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <div className="user-avatar small">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.displayName} />
                      ) : (
                        <div className="avatar-placeholder small">
                          {user.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-selection-name">{user.displayName}</div>
                    <div className="selection-checkbox">
                      {newChatData.selectedParticipants.includes(user.id) && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="create-chat-button"
              onClick={handleCreateChat}
              disabled={!newChatData.name || newChatData.selectedParticipants.length === 0}
            >
              Opprett chat
            </button>
          </div>
        </div>
        
        <div className="chat-details-section">
          {selectedChat ? (
            <>
              <div className="chat-details-header">
                <h3>{selectedChat.name}</h3>
                <div className="chat-details-meta">
                  Opprettet: {new Date(selectedChat.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="chat-participants-list">
                <h4>Deltakere</h4>
                <div className="participants-container">
                  {selectedChat.participantIds.map(userId => (
                    <div key={userId} className="participant-item">
                      <div className="participant-name">
                        {getUserDisplayName(userId)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chat-messages">
                <h4>Meldinger</h4>
                {selectedChatMessages.length === 0 ? (
                  <div className="no-messages">Ingen meldinger ennå</div>
                ) : (
                  <div className="messages-container">
                    {selectedChatMessages.map(message => (
                      <div key={message.id} className="message-item">
                        <div className="message-sender">
                          {getUserDisplayName(message.senderId)}:
                        </div>
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="chat-actions">
                <button className="action-button">Arkiver chat</button>
                <button className="action-button danger">Slett chat</button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-selection-message">
                <div className="no-selection-icon">💬</div>
                <h3>Ingen chat valgt</h3>
                <p>Velg en chat fra listen for å se detaljer, eller opprett en ny chat.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .chat-management-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .section-header {
          margin-bottom: 1rem;
        }
        
        .section-header h3 {
          margin: 0;
        }
        
        .chats-list {
          background-color: #f8f8f8;
          border-radius: 4px;
          overflow: hidden;
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 2rem;
        }
        
        .no-chats {
          padding: 2rem;
          text-align: center;
          color: #666;
        }
        
        .chat-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .chat-item:hover {
          background-color: #f0f0f0;
        }
        
        .chat-item.selected {
          background-color: rgba(212, 175, 55, 0.1);
          border-left: 4px solid #d4af37;
        }
        
        .chat-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        
        .chat-info {
          flex: 1;
        }
        
        .chat-name {
          font-weight: 500;
        }
        
        .chat-participants {
          font-size: 0.8rem;
          color: #666;
        }
        
        .chat-date {
          font-size: 0.8rem;
          color: #999;
        }
        
        .create-chat-section {
          background-color: #f8f8f8;
          padding: 1.5rem;
          border-radius: 4px;
        }
        
        .create-chat-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .user-selection {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .user-selection-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .user-selection-item:hover {
          background-color: #f5f5f5;
        }
        
        .user-selection-item.selected {
          background-color: rgba(212, 175, 55, 0.1);
        }
        
        .user-avatar.small {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 0.75rem;
          overflow: hidden;
        }
        
        .avatar-placeholder.small {
          width: 100%;
          height: 100%;
          background-color: #d4af37;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .user-selection-name {
          flex: 1;
        }
        
        .selection-checkbox {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-weight: bold;
        }
        
        .create-chat-button {
          padding: 0.75rem 1.5rem;
          background-color: #d4af37;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        
        .create-chat-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .chat-details-header {
          margin-bottom: 1.5rem;
        }
        
        .chat-details-header h3 {
          margin: 0 0 0.5rem;
        }
        
        .chat-details-meta {
          font-size: 0.8rem;
          color: #666;
        }
        
        .chat-participants-list {
          margin-bottom: 2rem;
        }
        
        .chat-participants-list h4,
        .chat-messages h4 {
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        
        .participants-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .participant-item {
          background-color: #f0f0f0;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.9rem;
        }
        
        .chat-messages {
          margin-bottom: 2rem;
        }
        
        .no-messages {
          padding: 2rem;
          text-align: center;
          color: #666;
          background-color: #f8f8f8;
          border-radius: 4px;
        }
        
        .messages-container {
          background-color: #f8f8f8;
          border-radius: 4px;
          padding: 1rem;
          max-height: 250px;
          overflow-y: auto;
        }
        
        .message-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .message-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .message-sender {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .message-content {
          margin-bottom: 0.25rem;
        }
        
        .message-time {
          font-size: 0.8rem;
          color: #999;
          text-align: right;
        }
        
        .chat-actions {
          display: flex;
          gap: 1rem;
        }
        
        .action-button {
          padding: 0.75rem 1.5rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .action-button:hover {
          background-color: #ddd;
        }
        
        .action-button.danger {
          color: #f44336;
        }
        
        .action-button.danger:hover {
          background-color: #ffebee;
        }
        
        .no-chat-selected {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .no-selection-message {
          text-align: center;
          padding: 3rem;
        }
        
        .no-selection-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .no-selection-message h3 {
          margin: 0 0 0.5rem;
        }
        
        .no-selection-message p {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MCPChatManagement;

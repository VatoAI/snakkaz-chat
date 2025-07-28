import React, { useState, useEffect } from 'react';
import { User } from '../../services/encryption/mcp-simplified';

interface MCPUserManagementProps {
  userController: any;
  userPresenter: any;
}

/**
 * MCP User Management Component
 * 
 * Provides an interface for managing users within the MCP system:
 * - View and search users
 * - Add new users
 * - Edit user details
 * - Delete users
 */
const MCPUserManagement: React.FC<MCPUserManagementProps> = ({ userController, userPresenter }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
  });
  
  // Load users
  useEffect(() => {
    // Get all users from controller
    const allUsers = userController.getAllUsers();
    setUsers(allUsers);
  }, [userController]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      displayName: user.displayName,
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddUser = async () => {
    if (!formData.username || !formData.displayName) return;
    
    try {
      const newUser = await userController.registerUser(formData.username, formData.displayName);
      setUsers(prev => [...prev, newUser]);
      setFormData({ username: '', displayName: '' });
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user');
    }
  };
  
  return (
    <div className="mcp-user-management">
      <h2 className="component-title">Brukeradministrasjon</h2>
      
      <div className="user-management-container">
        <div className="user-list-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Søk brukere..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <div className="no-users">Ingen brukere funnet</div>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.displayName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.displayName}</div>
                    <div className="user-username">@{user.username}</div>
                  </div>
                  <div className="user-status">
                    {user.isOnline ? (
                      <span className="status-online">Online</span>
                    ) : (
                      <span className="status-offline">Offline</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="user-details-section">
          {selectedUser ? (
            <div className="user-details">
              <h3>Brukerdetaljer</h3>
              
              <div className="user-profile">
                <div className="profile-header">
                  <div className="large-avatar">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.displayName} />
                    ) : (
                      <div className="avatar-placeholder large">
                        {selectedUser.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h4>{selectedUser.displayName}</h4>
                    <div className="username">@{selectedUser.username}</div>
                    <div className="user-id">ID: {selectedUser.id}</div>
                  </div>
                </div>
                
                <div className="profile-details">
                  <div className="detail-item">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">
                      {selectedUser.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Sist sett:</div>
                    <div className="detail-value">
                      {selectedUser.lastSeen.toLocaleString()}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Offentlig nøkkel:</div>
                    <div className="detail-value public-key">
                      {selectedUser.publicKey.substring(0, 20)}...
                    </div>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button className="action-button">Rediger</button>
                  <button className="action-button danger">Deaktiver</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="add-user-form">
              <h3>Legg til ny bruker</h3>
              
              <div className="form-group">
                <label>Brukernavn:</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="eks. johndoe"
                />
              </div>
              
              <div className="form-group">
                <label>Visningsnavn:</label>
                <input 
                  type="text" 
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleFormChange}
                  placeholder="eks. John Doe"
                />
              </div>
              
              <button 
                className="add-user-button" 
                onClick={handleAddUser}
                disabled={!formData.username || !formData.displayName}
              >
                Legg til bruker
              </button>
              
              <div className="info-box">
                <h4>Om MCP Brukermodell</h4>
                <p>
                  MCP arkitekturen håndterer brukere med end-to-end kryptering.
                  Hver bruker får generert et unikt nøkkelpar for sikker kommunikasjon.
                  Brukerkontoen støtter både online og offline kommunikasjon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .user-management-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .search-bar {
          margin-bottom: 1rem;
        }
        
        .search-bar input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .users-list {
          background-color: #f8f8f8;
          border-radius: 4px;
          overflow: hidden;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .no-users {
          padding: 2rem;
          text-align: center;
          color: #666;
        }
        
        .user-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .user-item:hover {
          background-color: #f0f0f0;
        }
        
        .user-item.selected {
          background-color: rgba(212, 175, 55, 0.1);
          border-left: 4px solid #d4af37;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 1rem;
          overflow: hidden;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background-color: #d4af37;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .user-info {
          flex: 1;
        }
        
        .user-name {
          font-weight: 500;
        }
        
        .user-username {
          font-size: 0.8rem;
          color: #666;
        }
        
        .user-status {
          font-size: 0.8rem;
        }
        
        .status-online {
          color: #4caf50;
        }
        
        .status-offline {
          color: #999;
        }
        
        .user-details h3,
        .add-user-form h3 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .profile-header {
          display: flex;
          margin-bottom: 2rem;
        }
        
        .large-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 1.5rem;
          overflow: hidden;
        }
        
        .avatar-placeholder.large {
          font-size: 2rem;
        }
        
        .profile-info h4 {
          margin: 0 0 0.5rem;
          font-size: 1.4rem;
        }
        
        .username {
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .user-id {
          font-size: 0.8rem;
          color: #999;
        }
        
        .profile-details {
          margin-bottom: 2rem;
        }
        
        .detail-item {
          display: flex;
          margin-bottom: 0.75rem;
        }
        
        .detail-label {
          width: 120px;
          color: #666;
        }
        
        .public-key {
          font-family: monospace;
          background-color: #f0f0f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .user-actions {
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
        
        .add-user-button {
          padding: 0.75rem 1.5rem;
          background-color: #d4af37;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        
        .add-user-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .info-box {
          margin-top: 2rem;
          background-color: #f8f8f8;
          padding: 1.5rem;
          border-radius: 4px;
        }
        
        .info-box h4 {
          margin-top: 0;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default MCPUserManagement;

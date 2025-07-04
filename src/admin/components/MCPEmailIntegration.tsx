import React, { useState } from 'react';

/**
 * MCP Email Integration Component
 * 
 * Provides an interface for managing email templates and sending emails
 * through the MCP system.
 */
const MCPEmailIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'send' | 'logs'>('templates');
  
  // Mock email templates
  const [templates, setTemplates] = useState([
    {
      id: 'welcome',
      name: 'Velkommen',
      subject: 'Velkommen til Snakkaz Chat!',
      description: 'Velkomstmelding sendt til nye brukere',
      lastUpdated: new Date(2025, 5, 15)
    },
    {
      id: 'password-reset',
      name: 'Tilbakestilling av passord',
      subject: 'Tilbakestill ditt Snakkaz-passord',
      description: 'Instruksjoner for å tilbakestille passord',
      lastUpdated: new Date(2025, 6, 1)
    },
    {
      id: 'chat-invitation',
      name: 'Chat-invitasjon',
      subject: 'Du har blitt invitert til en chat på Snakkaz',
      description: 'Sendt når en bruker blir lagt til en chat',
      lastUpdated: new Date(2025, 5, 20)
    },
    {
      id: 'notification',
      name: 'Varsling',
      subject: 'Nye meldinger på Snakkaz',
      description: 'Varsling om uleste meldinger',
      lastUpdated: new Date(2025, 6, 2)
    }
  ]);
  
  // Mock email logs
  const [emailLogs] = useState([
    {
      id: 'email_1',
      template: 'welcome',
      to: 'john.doe@example.com',
      subject: 'Velkommen til Snakkaz Chat!',
      status: 'delivered',
      sentAt: new Date(2025, 6, 1, 14, 30)
    },
    {
      id: 'email_2',
      template: 'password-reset',
      to: 'jane.smith@example.com',
      subject: 'Tilbakestill ditt Snakkaz-passord',
      status: 'delivered',
      sentAt: new Date(2025, 6, 2, 9, 15)
    },
    {
      id: 'email_3',
      template: 'chat-invitation',
      to: 'mike.brown@example.com',
      subject: 'Du har blitt invitert til en chat på Snakkaz',
      status: 'delivered',
      sentAt: new Date(2025, 6, 2, 16, 45)
    },
    {
      id: 'email_4',
      template: 'notification',
      to: 'sarah.jones@example.com',
      subject: 'Nye meldinger på Snakkaz',
      status: 'failed',
      sentAt: new Date(2025, 6, 3, 10, 20)
    }
  ]);
  
  // State for send email form
  const [emailForm, setEmailForm] = useState({
    template: 'welcome',
    to: '',
    subject: '',
    customSubject: false
  });
  
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setEmailForm(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setEmailForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle send email
  const handleSendEmail = () => {
    alert(`Email would be sent to: ${emailForm.to} using the ${emailForm.template} template`);
  };
  
  return (
    <div className="mcp-email-integration">
      <h2 className="component-title">E-postsystem</h2>
      
      <div className="email-tabs">
        <button 
          className={`email-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Maler
        </button>
        <button 
          className={`email-tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send e-post
        </button>
        <button 
          className={`email-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Logg
        </button>
      </div>
      
      <div className="email-content">
        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="templates-header">
              <h3>E-postmaler</h3>
              <button className="add-template-button">
                <span>+</span> Ny mal
              </button>
            </div>
            
            <div className="templates-list">
              <table>
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>Emne</th>
                    <th>Beskrivelse</th>
                    <th>Sist oppdatert</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map(template => (
                    <tr key={template.id}>
                      <td>{template.name}</td>
                      <td>{template.subject}</td>
                      <td>{template.description}</td>
                      <td>{template.lastUpdated.toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button className="action-icon edit-icon" title="Rediger">✏️</button>
                        <button className="action-icon preview-icon" title="Forhåndsvis">👁️</button>
                        <button className="action-icon delete-icon" title="Slett">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="template-variables-section">
              <h4>Tilgjengelige variabler</h4>
              <p>Du kan bruke følgende variabler i e-postmaler:</p>
              <div className="variables-grid">
                <div className="variable-item">
                  <code>{{name}}</code>
                  <span>- Brukerens navn</span>
                </div>
                <div className="variable-item">
                  <code>{{username}}</code>
                  <span>- Brukernavnet</span>
                </div>
                <div className="variable-item">
                  <code>{{resetUrl}}</code>
                  <span>- URL for tilbakestilling av passord</span>
                </div>
                <div className="variable-item">
                  <code>{{chatName}}</code>
                  <span>- Navn på chat</span>
                </div>
                <div className="variable-item">
                  <code>{{invitedBy}}</code>
                  <span>- Navn på brukeren som sendte invitasjonen</span>
                </div>
                <div className="variable-item">
                  <code>{{messageCount}}</code>
                  <span>- Antall nye meldinger</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'send' && (
          <div className="send-email-section">
            <h3>Send e-post</h3>
            
            <div className="email-form">
              <div className="form-group">
                <label>Mal:</label>
                <select 
                  name="template" 
                  value={emailForm.template}
                  onChange={handleFormChange}
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Mottaker:</label>
                <input 
                  type="email" 
                  name="to" 
                  placeholder="E-postadresse"
                  value={emailForm.to}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="customSubject" 
                  name="customSubject"
                  checked={emailForm.customSubject}
                  onChange={handleFormChange}
                />
                <label htmlFor="customSubject">Egendefinert emne</label>
              </div>
              
              {emailForm.customSubject && (
                <div className="form-group">
                  <label>Emne:</label>
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="E-postemne"
                    value={emailForm.subject}
                    onChange={handleFormChange}
                  />
                </div>
              )}
              
              <div className="preview-button-container">
                <button className="preview-button">Forhåndsvis</button>
              </div>
              
              <button 
                className="send-button"
                onClick={handleSendEmail}
                disabled={!emailForm.to}
              >
                Send e-post
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div className="email-logs-section">
            <h3>E-postlogg</h3>
            
            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Mal</th>
                    <th>Mottaker</th>
                    <th>Emne</th>
                    <th>Status</th>
                    <th>Sendt</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map(log => (
                    <tr key={log.id}>
                      <td>{templates.find(t => t.id === log.template)?.name || log.template}</td>
                      <td>{log.to}</td>
                      <td>{log.subject}</td>
                      <td>
                        <span className={`status-badge ${log.status}`}>
                          {log.status === 'delivered' ? 'Levert' : 'Mislyktes'}
                        </span>
                      </td>
                      <td>{log.sentAt.toLocaleString()}</td>
                      <td>
                        <button className="action-icon view-icon" title="Vis">👁️</button>
                        <button className="action-icon resend-icon" title="Send på nytt">🔄</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="email-stats">
              <div className="stat-item">
                <div className="stat-label">Totalt sendt</div>
                <div className="stat-value">42</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Levert</div>
                <div className="stat-value">39</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Mislyktes</div>
                <div className="stat-value">3</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Åpningsrate</div>
                <div className="stat-value">76%</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .email-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }
        
        .email-tab {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .email-tab:hover {
          background-color: #f0f0f0;
        }
        
        .email-tab.active {
          background-color: #d4af37;
          color: black;
        }
        
        .email-content {
          background-color: white;
          border-radius: 4px;
          padding: 1.5rem;
          min-height: 400px;
        }
        
        .templates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .templates-header h3 {
          margin: 0;
        }
        
        .add-template-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #d4af37;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .add-template-button span {
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .templates-list {
          margin-bottom: 2rem;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          font-weight: 600;
          background-color: #f8f8f8;
        }
        
        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .action-icon:hover {
          background-color: #f0f0f0;
        }
        
        .template-variables-section {
          background-color: #f8f8f8;
          padding: 1.5rem;
          border-radius: 4px;
        }
        
        .template-variables-section h4 {
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        
        .variables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .variable-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .variable-item code {
          background-color: #e9e9e9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .send-email-section h3,
        .email-logs-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        .email-form {
          max-width: 600px;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .checkbox-group label {
          margin-bottom: 0;
        }
        
        .preview-button-container {
          margin-bottom: 1.5rem;
        }
        
        .preview-button {
          padding: 0.5rem 1rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .send-button {
          padding: 0.75rem 1.5rem;
          background-color: #d4af37;
          color: black;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        
        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .logs-table-container {
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        
        .logs-table {
          min-width: 800px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-badge.delivered {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .status-badge.failed {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .email-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          background-color: #f8f8f8;
          padding: 1.5rem;
          border-radius: 4px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MCPEmailIntegration;

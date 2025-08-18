import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-card">
          <h2>Velkommen til SnakkaZ 👋</h2>
          <p>Din personlige AI-assistent og chat-plattform</p>
          <div className="quick-stats">
            <div className="stat-card">
              <span className="stat-value">47</span>
              <span className="stat-label">Samtaler</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">1.2k</span>
              <span className="stat-label">Meldinger</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">12</span>
              <span className="stat-label">Kontakter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Hurtighandlinger</h3>
        <div className="action-grid">
          <button className="action-card">
            <span className="action-icon">💬</span>
            <span className="action-label">Start Chat</span>
          </button>
          <button className="action-card">
            <span className="action-icon">🤖</span>
            <span className="action-label">AI Assistent</span>
          </button>
          <button className="action-card">
            <span className="action-icon">👥</span>
            <span className="action-label">Gruppe Chat</span>
          </button>
          <button className="action-card">
            <span className="action-icon">🔍</span>
            <span className="action-label">Søk</span>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <h3>Nylig aktivitet</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">💬</span>
            <div className="activity-content">
              <span className="activity-title">Ny melding i Teknologi-gruppen</span>
              <span className="activity-time">5 min siden</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <div className="activity-content">
              <span className="activity-title">Du har en ny venneforespørsel</span>
              <span className="activity-time">10 min siden</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🤖</span>
            <div className="activity-content">
              <span className="activity-title">AI-assistent svarte på spørsmålet ditt</span>
              <span className="activity-time">1 time siden</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="features">
        <h3>Funksjoner</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h4>Sikker kryptering</h4>
              <p>End-to-end kryptering på alle meldinger</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <div className="feature-content">
              <h4>AI-assistent</h4>
              <p>Intelligent chat med norsk AI-teknologi</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-content">
              <h4>Lynrask</h4>
              <p>Sanntids meldinger og reaksjoner</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <div className="feature-content">
              <h4>Cloud Sync</h4>
              <p>Tilgang til dine samtaler fra alle enheter</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
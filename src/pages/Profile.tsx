import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile">
      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img src="/logos/snakkaz-icon-192.png" alt="Profil" />
            <button className="avatar-edit-btn">📷</button>
          </div>
          <div className="profile-info">
            <h2>John Doe</h2>
            <p>@johndoe</p>
            <span className="profile-status online">Online</span>
          </div>
        </div>
        <button className="edit-profile-btn">Rediger profil</button>
      </section>

      {/* Profile Stats */}
      <section className="profile-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">127</span>
            <span className="stat-label">Samtaler</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3.2k</span>
            <span className="stat-label">Meldinger</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">45</span>
            <span className="stat-label">Kontakter</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Grupper</span>
          </div>
        </div>
      </section>

      {/* Profile Actions */}
      <section className="profile-actions">
        <h3>Kontoinformasjon</h3>
        <div className="action-list">
          <button className="action-item">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <div className="action-title">Personlig informasjon</div>
              <div className="action-subtitle">Navn, telefon, e-post</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🔒</div>
            <div className="action-content">
              <div className="action-title">Personvern og sikkerhet</div>
              <div className="action-subtitle">Passord, to-faktor autentisering</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🔔</div>
            <div className="action-content">
              <div className="action-title">Varsler</div>
              <div className="action-subtitle">Push-varsler, lyd, vibrasjon</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🎨</div>
            <div className="action-content">
              <div className="action-title">Utseende</div>
              <div className="action-subtitle">Tema, farger, skriftstørrelse</div>
            </div>
            <div className="action-arrow">›</div>
          </button>
        </div>
      </section>

      {/* Activity Summary */}
      <section className="activity-summary">
        <h3>Aktivitetssammendrag</h3>
        <div className="activity-cards">
          <div className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">📈</span>
              <span className="activity-period">Denne uken</span>
            </div>
            <div className="activity-metric">
              <span className="activity-value">89</span>
              <span className="activity-label">Meldinger sendt</span>
            </div>
            <div className="activity-change positive">+23% fra forrige uke</div>
          </div>

          <div className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">⏱️</span>
              <span className="activity-period">I dag</span>
            </div>
            <div className="activity-metric">
              <span className="activity-value">2t 34m</span>
              <span className="activity-label">Tid i app</span>
            </div>
            <div className="activity-change neutral">Samme som i går</div>
          </div>
        </div>
      </section>

      {/* Recent Conversations */}
      <section className="recent-conversations">
        <h3>Nylige samtaler</h3>
        <div className="conversation-list">
          <div className="conversation-item">
            <div className="conversation-avatar">🤖</div>
            <div className="conversation-content">
              <div className="conversation-name">SnakkaZ AI</div>
              <div className="conversation-last-message">Kan jeg hjelpe deg med noe mer?</div>
            </div>
            <div className="conversation-time">14:23</div>
          </div>

          <div className="conversation-item">
            <div className="conversation-avatar">👨‍💼</div>
            <div className="conversation-content">
              <div className="conversation-name">Support Team</div>
              <div className="conversation-last-message">Takk for henvendelsen! Vi vil komme tilbake...</div>
            </div>
            <div className="conversation-time">12:45</div>
          </div>

          <div className="conversation-item">
            <div className="conversation-avatar">👥</div>
            <div className="conversation-content">
              <div className="conversation-name">Team SnakkaZ</div>
              <div className="conversation-last-message">Velkommen til gruppen!</div>
            </div>
            <div className="conversation-time">10:12</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

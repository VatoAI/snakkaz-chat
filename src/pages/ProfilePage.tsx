import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProfileData {
  fullName: string;
  email: string;
  avatar: string;
  status: string;
  bio: string;
  phone: string;
  location: string;
}

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Ola Nordmann',
    email: 'ola.nordmann@eksempel.no',
    avatar: 'ON',
    status: 'Tilgjengelig',
    bio: 'Elsker sikker chat og norsk teknologi! 🇳🇴',
    phone: '+47 123 45 678',
    location: 'Oslo, Norge'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSaveProfile = () => {
    // TODO: Implement Supabase profile update
    console.log('Lagrer profil:', profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('De nye passordene stemmer ikke overens');
      return;
    }

    // TODO: Implement Supabase password change
    console.log('Endrer passord');
    setShowPasswordChange(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload
    console.log('Endre profilbilde');
  };

  return (
    <div className="profile-page glass-morphism-dark">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Min profil</h1>
          <p className="subtitle">Administrer din SnakkaZ-konto og personvern</p>
        </div>

        {/* Profil kort */}
        <div className="profile-card glass-morphism-light">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="profile-avatar">
                {profileData.avatar}
              </div>
              <button className="avatar-edit-button" onClick={handleAvatarChange}>
                <Camera size={16} />
              </button>
            </div>
            <div className="profile-basic-info">
              <h2>{profileData.fullName}</h2>
              <p className="profile-email">{profileData.email}</p>
              <div className="status-indicator">
                <div className="status-dot online" />
                <span>{profileData.status}</span>
              </div>
            </div>
            <button
              className={`edit-profile-button ${isEditing ? 'editing' : ''}`}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Lagre' : 'Rediger'}
            </button>
          </div>

          {isEditing && (
            <button
              className="cancel-edit-button"
              onClick={() => setIsEditing(false)}
            >
              <X size={16} />
              Avbryt
            </button>
          )}
        </div>

        {/* Profilinformasjon */}
        <div className="profile-details glass-morphism-light">
          <h3>Profilinformasjon</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Fullt navn</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                />
              ) : (
                <p className="form-value">{profileData.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label>E-postadresse</label>
              {isEditing ? (
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                />
              ) : (
                <p className="form-value">{profileData.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>Telefonnummer</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="form-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                />
              ) : (
                <p className="form-value">{profileData.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label>Lokasjon</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                />
              ) : (
                <p className="form-value">{profileData.location}</p>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Om meg</label>
            {isEditing ? (
              <textarea
                className="form-input"
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  bio: e.target.value
                }))}
                placeholder="Fortell litt om deg selv..."
              />
            ) : (
              <p className="form-value">{profileData.bio}</p>
            )}
          </div>
        </div>

        {/* Sikkerhet */}
        <div className="security-section glass-morphism-light">
          <h3>
            <Shield size={20} />
            Sikkerhet og personvern
          </h3>

          <div className="security-items">
            <div className="security-item">
              <div className="security-info">
                <div className="security-title">
                  <Lock size={16} />
                  Passord
                </div>
                <p>Sist endret for 30 dager siden</p>
              </div>
              <button
                className="change-password-button"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                Endre passord
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <div className="security-title">
                  <CheckCircle size={16} />
                  To-faktor autentisering
                </div>
                <p>Aktivert med SMS til +47 *** ** 678</p>
              </div>
              <button className="security-button enabled">
                Aktivert
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <div className="security-title">
                  <Bell size={16} />
                  Varslinger
                </div>
                <p>Push-varsler og e-postvarsler</p>
              </div>
              <button className="security-button">
                Administrer
              </button>
            </div>
          </div>
        </div>

        {/* Passord endring */}
        {showPasswordChange && (
          <div className="password-change-section glass-morphism-light">
            <div className="section-header">
              <h3>Endre passord</h3>
              <button
                className="close-button"
                onClick={() => setShowPasswordChange(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="password-form">
              <div className="form-group">
                <label>Nåværende passord</label>
                <div className="password-input">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    className="form-input"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({
                      ...prev,
                      current: e.target.value
                    }))}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      current: !prev.current
                    }))}
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Nytt passord</label>
                <div className="password-input">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    className="form-input"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({
                      ...prev,
                      new: e.target.value
                    }))}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      new: !prev.new
                    }))}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Bekreft nytt passord</label>
                <div className="password-input">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className="form-input"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({
                      ...prev,
                      confirm: e.target.value
                    }))}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      confirm: !prev.confirm
                    }))}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="password-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  className="save-password-button"
                  onClick={handlePasswordChange}
                >
                  <Shield size={16} />
                  Oppdater passord
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data og personvern */}
        <div className="privacy-section glass-morphism-light">
          <h3>
            <User size={20} />
            Data og personvern
          </h3>

          <div className="privacy-items">
            <div className="privacy-item">
              <AlertCircle size={16} className="warning-icon" />
              <div>
                <strong>Dataeksport</strong>
                <p>Last ned alle dine data fra SnakkaZ</p>
              </div>
              <button className="privacy-button">
                Eksporter data
              </button>
            </div>

            <div className="privacy-item">
              <AlertCircle size={16} className="danger-icon" />
              <div>
                <strong>Slett konto</strong>
                <p>Permanent sletting av kontoen og alle data</p>
              </div>
              <button className="privacy-button danger">
                Slett konto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

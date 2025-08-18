import React from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your SnakkaZ experience</p>
      </div>

      <div className="settings-section">
        <h2>Account Settings</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">👤</div>
            <div className="setting-content">
              <div className="setting-title">Profile Information</div>
              <div className="setting-subtitle">Update your profile details</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔒</div>
            <div className="setting-content">
              <div className="setting-title">Privacy & Security</div>
              <div className="setting-subtitle">Manage your privacy settings</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔐</div>
            <div className="setting-content">
              <div className="setting-title">Change Password</div>
              <div className="setting-subtitle">Update your account password</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>App Preferences</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">🌙</div>
            <div className="setting-content">
              <div className="setting-title">Dark Mode</div>
              <div className="setting-subtitle">Choose your preferred theme</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔔</div>
            <div className="setting-content">
              <div className="setting-title">Notifications</div>
              <div className="setting-subtitle">Configure notification preferences</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🌐</div>
            <div className="setting-content">
              <div className="setting-title">Language</div>
              <div className="setting-subtitle">English</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">💾</div>
            <div className="setting-content">
              <div className="setting-title">Auto-Save Chats</div>
              <div className="setting-subtitle">Automatically save conversations</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Chat Settings</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">💬</div>
            <div className="setting-content">
              <div className="setting-title">Message Preview</div>
              <div className="setting-subtitle">Show message previews in notifications</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">⚡</div>
            <div className="setting-content">
              <div className="setting-title">Send on Enter</div>
              <div className="setting-subtitle">Send messages when Enter is pressed</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">📎</div>
            <div className="setting-content">
              <div className="setting-title">Auto-Download Media</div>
              <div className="setting-subtitle">Automatically download images and files</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Advanced</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">🔧</div>
            <div className="setting-content">
              <div className="setting-title">Developer Mode</div>
              <div className="setting-subtitle">Enable advanced features</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">📊</div>
            <div className="setting-content">
              <div className="setting-title">Analytics</div>
              <div className="setting-subtitle">Help improve SnakkaZ</div>
            </div>
            <label className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🗑️</div>
            <div className="setting-content">
              <div className="setting-title">Clear Cache</div>
              <div className="setting-subtitle">Free up storage space</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Support</h2>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">❓</div>
            <div className="setting-content">
              <div className="setting-title">Help Center</div>
              <div className="setting-subtitle">Get help and support</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">💡</div>
            <div className="setting-content">
              <div className="setting-title">Send Feedback</div>
              <div className="setting-subtitle">Share your thoughts</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">ℹ️</div>
            <div className="setting-content">
              <div className="setting-title">About SnakkaZ</div>
              <div className="setting-subtitle">Version 1.0.0</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      <div className="settings-danger-zone">
        <h2>Account Actions</h2>
        <div className="settings-group">
          <div className="setting-item danger">
            <div className="setting-icon">🚪</div>
            <div className="setting-content">
              <div className="setting-title">Sign Out</div>
              <div className="setting-subtitle">Sign out of your account</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item danger">
            <div className="setting-icon">⚠️</div>
            <div className="setting-content">
              <div className="setting-title">Delete Account</div>
              <div className="setting-subtitle">Permanently delete your account</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>
    </div>

export default Settings;

  export default Settings;
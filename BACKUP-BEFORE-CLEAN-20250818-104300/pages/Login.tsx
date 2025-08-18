import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedSupabaseAuth from '../components/auth/ProtectedSupabaseAuth';
import '../styles/snakkaz-unified-design-system.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/chat');
  };

  return (
    <div className="snakkaz-page snakkaz-flex snakkaz-flex-center">
      {/* Universal Aurora Background */}
      <div className="snakkaz-aurora-bg">
        <div className="snakkaz-aurora-layer-1"></div>
        <div className="snakkaz-aurora-layer-2"></div>
      </div>

      {/* Main Content */}
      <div className="snakkaz-container snakkaz-container-elevated" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="snakkaz-text-center" style={{ marginBottom: 'var(--snakkaz-space-xl)' }}>
          <h1 className="snakkaz-header-title">Velkommen til SnakkaZ</h1>
          <p className="snakkaz-header-subtitle">Logg inn for å oppleve fremtidens chat</p>
        </div>

        <div className="protected-auth-container">
          <ProtectedSupabaseAuth
            mode="login"
            onAuthSuccess={handleAuthSuccess}
          />
        </div>

        {/* Features Preview */}
        <div style={{ marginTop: 'var(--snakkaz-space-xl)' }}>
          <div className="snakkaz-flex snakkaz-flex-center" style={{ gap: 'var(--snakkaz-space-lg)' }}>
            <div className="snakkaz-badge snakkaz-badge-success">
              <span>🔐</span>
              E2E Kryptering
            </div>
            <div className="snakkaz-badge snakkaz-badge-success">
              <span>⚡</span>
              Real-time Chat
            </div>
            <div className="snakkaz-badge snakkaz-badge-success">
              <span>🌟</span>
              Apple Design
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

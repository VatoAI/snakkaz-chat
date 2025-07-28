import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SnakkaZChatBetaV2 from './pages/SnakkaZChatBetaV2';

// Simple Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0f172a',
          color: '#f1f5f9',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ marginBottom: '1rem', color: '#ef4444' }}>
            Oops! Noe gikk galt
          </h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Vennligst last siden på nytt
          </p>
          <button
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={() => window.location.reload()}
          >
            Last på nytt
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  console.log('🚀 SnakkaZ Beta V2 - Clean Start!');

  return (
    <ErrorBoundary>
      <Router>
        <div className="App" style={{ height: '100vh', margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/beta-v2" replace />} />
            <Route path="/beta-v2" element={<SnakkaZChatBetaV2 />} />
            <Route path="/beta" element={<Navigate to="/beta-v2" replace />} />
            <Route path="*" element={<Navigate to="/beta-v2" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
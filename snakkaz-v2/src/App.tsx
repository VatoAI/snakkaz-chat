import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SnakkaZBetaV2 from './components/SnakkaZBetaV2';

// Simple Error Boundary for V2
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SnakkaZ V2 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="glass-card" style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            maxWidth: '500px',
            margin: '2rem auto'
          }}>
            <h1 className="text-gradient" style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)'
            }}>
              SYSTEM ERROR
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1.5rem',
              fontSize: '1.1rem'
            }}>
              SnakkaZ V2 encountered an unexpected error
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              🚀 Restart V2
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  console.log('🚀 SnakkaZ Beta V2 - Clean & Simple Loading');

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<SnakkaZBetaV2 />} />
          <Route path="/chat" element={<SnakkaZBetaV2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
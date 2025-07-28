import React from 'react';
import { getEnvironmentConfig } from '../config/environment.js';

// Enhanced error boundary with comprehensive error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const config = getEnvironmentConfig();
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Log error in development
    if (config.isDevelopment) {
      console.error('🚨 ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, could send to error tracking service
    if (config.isProduction) {
      console.error('Production error caught by ErrorBoundary');
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const config = getEnvironmentConfig();
      
      return React.createElement('div', {
        className: "min-h-screen bg-slate-900 text-white flex items-center justify-center p-4"
      }, 
        React.createElement('div', {
          className: "max-w-md w-full bg-slate-800 rounded-lg p-6 border border-slate-700"
        },
          React.createElement('div', {
            className: "text-center"
          },
            React.createElement('div', {
              className: "w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
            }, 
              React.createElement('svg', {
                className: "w-8 h-8 text-white",
                fill: "none",
                stroke: "currentColor",  
                viewBox: "0 0 24 24"
              },
                React.createElement('path', {
                  strokeLinecap: "round",
                  strokeLinejoin: "round", 
                  strokeWidth: 2,
                  d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                })
              )
            ),
            React.createElement('h2', {
              className: "text-xl font-semibold mb-2"
            }, "Something went wrong"),
            React.createElement('p', {
              className: "text-gray-400 mb-4"
            }, config.isDevelopment 
              ? "A JavaScript error occurred. Check the console for details."
              : "We're sorry, but something unexpected happened. Please try again."
            ),
            config.isDevelopment && this.state.error && React.createElement('div', {
              className: "bg-slate-700 rounded p-3 mb-4 text-left"
            },
              React.createElement('p', {
                className: "text-red-400 text-sm font-mono"
              }, this.state.error.toString())
            ),
            React.createElement('div', {
              className: "space-y-2"
            },
              React.createElement('button', {
                onClick: this.handleRetry,
                className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors",
                disabled: this.state.retryCount >= 3
              }, this.state.retryCount >= 3 ? 'Max retries reached' : `Try Again (${this.state.retryCount}/3)`),
              React.createElement('button', {
                onClick: this.handleReload,
                className: "w-full bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded transition-colors"
              }, "Reload Page")
            ),
            config.isDevelopment && React.createElement('details', {
              className: "mt-4 text-left"
            },
              React.createElement('summary', {
                className: "cursor-pointer text-gray-400 hover:text-white"
              }, "Show Error Details"),
              React.createElement('pre', {
                className: "mt-2 text-xs bg-slate-700 p-2 rounded overflow-auto"
              }, this.state.errorInfo?.componentStack)
            )
          )
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

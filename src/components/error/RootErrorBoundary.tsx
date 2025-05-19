import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Root Error Boundary for Snakkaz Chat
 * 
 * This is the top-level error boundary that catches all errors in the React tree.
 * It provides a user-friendly UI for reporting errors and recovering from them.
 */
export class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for development
    console.error("Snakkaz Chat encountered an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Here you could also log to an error reporting service like Sentry
    // if you have that configured
  }

  private handleReload = () => {
    // Clear the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Reload the page to get a fresh state
    window.location.reload();
  };

  private handleReportError = () => {
    // Create a basic error report with diagnostic info
    const errorReport = {
      error: this.state.error?.toString(),
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // This could be enhanced to send to your error reporting service
    console.info("Error report prepared:", errorReport);
    
    // For now, just open a mailto link
    const subject = encodeURIComponent("Snakkaz Chat Error Report");
    const body = encodeURIComponent(
      `Error Report:\n\n${JSON.stringify(errorReport, null, 2)}`
    );
    window.open(`mailto:support@snakkaz.com?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyberdark-950 p-4">
          <div className="max-w-md w-full bg-cyberdark-900 p-6 rounded-lg shadow-lg border border-cybergold-400/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-cybergold-400">Systemfeil oppdaget</h2>
              <p className="text-gray-400 mt-2">
                Det oppsto en uventet feil i SnakkaZ Chat. Vi beklager ulempen.
              </p>
            </div>
            
            {/* Error Details (Collapsible) */}
            {this.state.error && (
              <div className="mb-6">
                <div className="bg-cyberdark-800 p-3 rounded border border-cyberdark-700">
                  <p className="text-red-400 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <Button
                onClick={this.handleReload}
                className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
              >
                Last siden på nytt
              </Button>
              <Button
                onClick={this.handleReportError}
                variant="outline"
                className="w-full border-cyberdark-700 hover:bg-cyberdark-800 text-cybergold-400"
              >
                Rapporter feilen
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

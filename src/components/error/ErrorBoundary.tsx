import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";
import * as Sentry from "@sentry/react";
import { getConfig } from "../../config/app-config";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const config = getConfig();
    
    this.setState({ errorInfo });
    
    // Rapporter til Sentry hvis i produksjonsmodus og Sentry DSN er konfigurert
    if (!config.debugMode && config.sentryDsn) {
      Sentry.withScope((scope) => {
        scope.setExtras({
          componentStack: errorInfo.componentStack,
          userAgent: navigator.userAgent,
          time: new Date().toISOString(),
          location: window.location.href
        });
        Sentry.captureException(error);
      });
    }

    // Logg feilen hvis i utviklingsmodus
    if (config.debugMode) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleNavigateHome = () => {
    window.location.href = "/";
  };

  private handleReportIssue = () => {
    const config = getConfig();
    
    if (config.sentryDsn) {
      Sentry.showReportDialog({
        eventId: Sentry.lastEventId(),
        title: 'Rapporter feil',
        subtitle: 'Vårt utviklerteam vil få beskjed',
        subtitle2: 'Takk for at du hjelper oss med å forbedre Snakkaz!',
        labelName: 'Navn',
        labelEmail: 'E-post',
        labelComments: 'Hva skjedde?',
        labelClose: 'Lukk',
        labelSubmit: 'Send rapport',
        successMessage: 'Takk for rapporten!'
      });
    } else {
      window.open('mailto:support@snakkaz.com?subject=Feilrapport&body=' + 
        encodeURIComponent('Feilmelding: ' + (this.state.error?.message || 'Ukjent feil')));
    }
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
          <div className="bg-gray-800 p-6 border border-gray-700 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center mb-4">
              <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-red-400">Systemfeil oppdaget</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Det oppsto en uventet feil. Vårt team har blitt varslet om problemet.
            </p>
            
            {getConfig().debugMode && (
              <>
                <div className="mb-4 overflow-auto max-h-32 bg-gray-900 p-3 rounded border border-gray-700">
                  <p className="text-sm text-red-300 font-mono">
                    {this.state.error?.message}
                  </p>
                </div>
                <div className="mb-4 overflow-auto max-h-32 bg-gray-900 p-3 rounded border border-gray-700">
                  <p className="text-xs text-gray-400 font-mono">
                    {this.state.errorInfo?.componentStack}
                  </p>
                </div>
              </>
            )}
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button
                onClick={this.handleReload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Last siden på nytt
              </Button>
              <Button
                onClick={this.handleNavigateHome}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Tilbake til forsiden
              </Button>
              <Button
                onClick={this.handleReportIssue}
                variant="link"
                className="text-blue-400 hover:text-blue-300"
              >
                Rapporter feil
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProfiledErrorBoundary = Sentry.withProfiler(ErrorBoundary);
export default ProfiledErrorBoundary;

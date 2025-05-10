
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen bg-cyberdark-950 text-white p-6">
          <h1 className="text-2xl font-bold mb-4 text-cybergold-400">Noe gikk galt</h1>
          <p className="text-lg mb-4 max-w-md text-center">
            Det oppstod en feil under lasting av SnakkaZ-appen
          </p>
          
          {this.state.error && (
            <div className="bg-cyberdark-800 p-4 rounded mb-4 max-w-md overflow-auto">
              <p className="text-red-400 mb-2">Feilmelding:</p>
              <p className="text-sm text-cyberdark-200 whitespace-pre-wrap">
                {this.state.error.toString()}
              </p>
            </div>
          )}
          
          <Button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-cybergold-600 text-black hover:bg-cybergold-500"
          >
            Last siden på nytt
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

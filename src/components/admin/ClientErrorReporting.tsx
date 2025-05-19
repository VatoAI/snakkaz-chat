import React, { useState, useEffect } from 'react';
import { getErrorLogs, clearErrorLogs } from '@/utils/error/errorMonitoring';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Trash2, Download, ClipboardCopy } from 'lucide-react';

/**
 * Error Reporting Component for Admin Panel
 * 
 * Displays client-side error logs collected by the error monitoring system
 */
export function ErrorReportingPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load logs on mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Load logs from local storage
  const loadLogs = () => {
    setIsLoading(true);
    
    try {
      const errorLogs = getErrorLogs();
      setLogs(errorLogs);
    } catch (error) {
      console.error('Failed to load error logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all logs
  const handleClearLogs = () => {
    if (window.confirm('Er du sikker på at du vil slette alle feillogger?')) {
      clearErrorLogs();
      setLogs([]);
    }
  };

  // Download logs as JSON
  const handleDownloadLogs = () => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', `snakkaz-error-logs-${new Date().toISOString()}.json`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Failed to download logs:', error);
    }
  };

  // Copy logs to clipboard
  const handleCopyLogs = () => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      navigator.clipboard.writeText(dataStr)
        .then(() => alert('Feillogger kopiert til utklippstavlen'))
        .catch(err => {
          console.error('Failed to copy logs to clipboard:', err);
          alert('Kunne ikke kopiere til utklippstavlen');
        });
    } catch (error) {
      console.error('Failed to prepare logs for copying:', error);
    }
  };

  // Format a timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('no-NO');
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <Card className="mb-8 bg-cyberdark-900 border-cyberdark-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-cyberblue-300 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Klientfeil-logger
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            className="border-cyberdark-700 text-gray-300 hover:bg-cyberdark-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearLogs}
            className="border-cyberdark-700 text-gray-300 hover:bg-cyberdark-800"
            disabled={logs.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadLogs}
            className="border-cyberdark-700 text-gray-300 hover:bg-cyberdark-800"
            disabled={logs.length === 0}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLogs}
            className="border-cyberdark-700 text-gray-300 hover:bg-cyberdark-800"
            disabled={logs.length === 0}
          >
            <ClipboardCopy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            Ingen feillogger funnet
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="bg-cyberdark-800 p-3 rounded border border-cyberdark-700">
                <div className="flex justify-between mb-2">
                  <span className="text-cybergold-400 font-medium">
                    {log.type || 'Feil'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="text-sm font-mono space-y-1 overflow-x-auto">
                  {log.details && Object.entries(log.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-400">{key}:</span>{' '}
                      <span className="text-gray-300">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  RefreshCcw, 
  AlertCircle, 
  AlertTriangle,
  Info,
  Loader2,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  details?: any;
}

export const AdminErrorLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // For demonstration purposes, we'll generate mock log data since we 
      // don't have an actual logs table in the database schema
      const mockLogs: LogEntry[] = [
        {
          id: "log-1",
          timestamp: new Date().toISOString(),
          level: "error",
          message: "Failed to establish WebRTC connection",
          source: "WebRTC Manager",
          details: { peerID: "user-123", attempt: 3 }
        },
        {
          id: "log-2",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          level: "warning",
          message: "Media encryption key missing",
          source: "Media Handler",
          details: { messageID: "msg-456" }
        },
        {
          id: "log-3",
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          level: "info",
          message: "System cleanup executed successfully",
          source: "Maintenance Task",
          details: { deletedRecords: 156 }
        },
        {
          id: "log-4",
          timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          level: "error",
          message: "Database connection timeout",
          source: "Supabase Client",
          details: { retryCount: 2 }
        },
        {
          id: "log-5",
          timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
          level: "warning",
          message: "User session expired unexpectedly",
          source: "Auth Manager",
          details: { userID: "user-789" }
        }
      ];
      
      // Attempt to get some real error information from health table
      const { data, error } = await supabase
        .from('health')
        .select('*')
        .ilike('status', '%error%');
      
      if (!error && data && data.length > 0) {
        // Add real error data to our mock logs if available
        data.forEach((item, index) => {
          mockLogs.push({
            id: `db-${item.id.substring(0, 8)}`,
            timestamp: item.last_checked,
            level: "error",
            message: item.status,
            source: "Health Monitor"
          });
        });
      }
      
      setLogs(mockLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleExportLogs = () => {
    // Create a JSON file of the logs
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create a link element and trigger download
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `system-logs-${new Date().toISOString().slice(0,10)}.json`);
    exportLink.click();
  };

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.message.toLowerCase().includes(query) ||
      log.source.toLowerCase().includes(query) ||
      log.level.toLowerCase().includes(query)
    );
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-cyberblue-300 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              System logger
            </CardTitle>
            <CardDescription>Overvåk systemfeil og advarsler</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportLogs}
              className="text-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Eksporter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="text-gray-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Søk i logger..."
            className="pl-10 bg-cyberdark-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyberblue-400" />
          </div>
        ) : (
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-cyberdark-800">
                <TableRow>
                  <TableHead className="w-[100px] text-gray-300">Nivå</TableHead>
                  <TableHead className="text-gray-300">Melding</TableHead>
                  <TableHead className="text-gray-300">Kilde</TableHead>
                  <TableHead className="text-gray-300 text-right">Tidspunkt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-cyberdark-800/50 border-t border-gray-700">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getLevelIcon(log.level)}
                          <span className={`text-xs font-medium ${
                            log.level === 'error' ? 'text-red-400' : 
                            log.level === 'warning' ? 'text-yellow-400' : 
                            'text-blue-400'
                          }`}>
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm text-gray-300">{log.message}</TableCell>
                      <TableCell className="text-sm text-gray-400">{log.source}</TableCell>
                      <TableCell className="text-xs text-gray-400 text-right">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                      {searchQuery ? 'Ingen logger samsvarer med søket' : 'Ingen logger funnet'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

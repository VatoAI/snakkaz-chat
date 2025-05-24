import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Bitcoin,
  Wallet,
  ArrowDownUp,
  ListFilter
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface ElectrumStatus {
  isConnected: boolean;
  serverInfo: {
    host: string;
    port: number;
    protocol: string;
  };
}

interface WalletBalance {
  confirmed: number;
  unconfirmed: number;
}

interface Transaction {
  txid: string;
  confirmations: number;
  amount: number;
  timestamp: number;
  blockHeight?: number;
}

export function ElectrumAdminPanel() {
  const [status, setStatus] = useState<ElectrumStatus | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<{
    status: boolean;
    balance: boolean;
    transactions: boolean;
    reconnect: boolean;
  }>({
    status: true,
    balance: true,
    transactions: true,
    reconnect: false
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchElectrumStatus();
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  const fetchElectrumStatus = async () => {
    setLoading(prev => ({ ...prev, status: true }));
    try {
      const response = await axios.get('/api/admin/electrum/status');
      if (response.data.success) {
        setStatus(response.data.status);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch Electrum status');
      console.error('Error fetching Electrum status:', err);
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const fetchWalletBalance = async () => {
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await axios.get('/api/admin/electrum/balance');
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  const fetchTransactions = async () => {
    setLoading(prev => ({ ...prev, transactions: true }));
    try {
      const response = await axios.get('/api/admin/electrum/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const resetConnection = async () => {
    setLoading(prev => ({ ...prev, reconnect: true }));
    try {
      const response = await axios.post('/api/admin/electrum/reset-connection');
      
      if (response.data.success) {
        toast({
          title: 'Connection Reset',
          description: 'Electrum connection was reset successfully',
        });
        
        // Refetch all data
        fetchElectrumStatus();
        fetchWalletBalance();
        fetchTransactions();
      } else {
        toast({
          variant: "destructive",
          title: 'Reset Failed',
          description: response.data.message || 'Failed to reset Electrum connection',
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: 'Reset Failed',
        description: 'An error occurred while resetting the connection',
      });
      console.error('Error resetting connection:', err);
    } finally {
      setLoading(prev => ({ ...prev, reconnect: false }));
    }
  };

  const formatSatoshiAsBTC = (satoshi: number): string => {
    return (satoshi / 100000000).toFixed(8);
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <Card className="w-full max-w-6xl mx-auto mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5" /> Electrum Bitcoin Wallet Administration
        </CardTitle>
        <CardDescription>
          Manage and monitor Bitcoin payments through Electrum wallet integration
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading.status ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : status ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {status.isConnected ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={status.isConnected ? "text-green-500" : "text-red-500"}>
                      {status.isConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {status.serverInfo.host}:{status.serverInfo.port} ({status.serverInfo.protocol})
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading.balance ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : balance ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-medium">
                      {formatSatoshiAsBTC(balance.confirmed)} BTC
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Unconfirmed: {formatSatoshiAsBTC(balance.unconfirmed)} BTC
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetConnection} disabled={loading.reconnect}>
                  {loading.reconnect ? (
                    <>
                      <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Reset Connection
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  fetchElectrumStatus();
                  fetchWalletBalance();
                  fetchTransactions();
                }}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="pending-payments">Pending Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Table>
              <TableCaption>Recent Bitcoin transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount (BTC)</TableHead>
                  <TableHead>Confirmations</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading.transactions ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading transactions...</TableCell>
                  </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.txid}>
                      <TableCell className="font-mono text-xs">{tx.txid.substring(0, 10)}...</TableCell>
                      <TableCell>{formatSatoshiAsBTC(tx.amount)}</TableCell>
                      <TableCell>{tx.confirmations}</TableCell>
                      <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/admin/electrum/transaction/${tx.txid}`}>
                            <ArrowDownUp className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="pending-payments">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Pending Payments</h3>
              <Button variant="outline" size="sm">
                <ListFilter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center py-8">
              Pending payment functionality will be implemented in the next update.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Electrum wallet integration v1.0
        </div>
        <Button variant="link" size="sm" asChild>
          <a href="/docs/Premium/ELECTRUM-BITCOIN-INTEGRATION-GUIDE.md" target="_blank">
            Documentation
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ElectrumAdminPanel;

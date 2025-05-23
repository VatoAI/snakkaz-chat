import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bitcoin,
  Check,
  X,
  RotateCw,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  CircleSlash,
  ArrowLeftRight,
  Loader2
} from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  btc_amount: number;
  product_type: string;
  product_id: string;
  payment_method: string;
  bitcoin_address: string;
  transaction_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  admin_notes?: string;
  confirmation_count?: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

interface PaymentLog {
  id: string;
  payment_id: string;
  admin_id?: string;
  action: string;
  previous_status?: string;
  new_status?: string;
  metadata?: any;
  ip_address?: string;
  created_at: string;
}

export function PaymentVerificationPanel() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination settings
  const itemsPerPage = 10;
  const pageOffset = (currentPage - 1) * itemsPerPage;

  // Fetch payments on mount and when filters change
  useEffect(() => {
    fetchPayments();
  }, [filterStatus, currentPage]);

  // Fetch payment logs when a payment is selected
  useEffect(() => {
    if (selectedPayment) {
      fetchPaymentLogs(selectedPayment.id);
      setNewStatus(selectedPayment.status);
      setAdminNotes(selectedPayment.admin_notes || '');
    }
  }, [selectedPayment]);

  // Fetch payments from the API
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      let url = `/api/payments/admin/all?limit=${itemsPerPage}&offset=${pageOffset}`;
      
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setPayments(response.data.payments);
        
        // Calculate total pages based on total count and items per page
        // Note: In a real implementation, the API would return a total count
        const totalCount = response.data.total || 100; // Fallback to assumed value
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        toast({
          title: "Feil ved henting av betalinger",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Feil ved henting av betalinger",
        description: "Kunne ikke hente betalinger fra serveren.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payment logs for a specific payment
  const fetchPaymentLogs = async (paymentId: string) => {
    setIsLoadingLogs(true);
    try {
      // In a real implementation, this would be an API call
      // For this demo we'll simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration purposes
      const mockLogs: PaymentLog[] = [
        {
          id: '1',
          payment_id: paymentId,
          action: 'status_update',
          previous_status: 'pending',
          new_status: 'confirmed',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          payment_id: paymentId,
          admin_id: 'admin1',
          action: 'admin_status_update',
          previous_status: 'confirmed',
          new_status: 'completed',
          metadata: { notes: 'Verified blockchain transaction' },
          ip_address: '192.168.1.1',
          created_at: new Date(Date.now() - 1800000).toISOString(),
        }
      ];
      
      setPaymentLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching payment logs:', error);
      toast({
        title: "Feil ved henting av logger",
        description: "Kunne ikke hente betalingslogger.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async () => {
    if (!selectedPayment) return;
    
    setIsUpdatingStatus(true);
    try {
      const response = await axios.patch(`/api/payments/admin/${selectedPayment.id}`, {
        status: newStatus,
        notes: adminNotes
      });
      
      if (response.data.success) {
        toast({
          title: "Status oppdatert",
          description: `Betalingsstatus ble endret til ${getStatusLabel(newStatus)}.`,
        });
        
        // Update the payment in the list
        setPayments(payments.map(p => 
          p.id === selectedPayment.id ? response.data.payment : p
        ));
        
        // Update the selected payment
        setSelectedPayment(response.data.payment);
        
        // Refresh payment logs
        fetchPaymentLogs(selectedPayment.id);
        
        // Close the dialog
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Feil ved oppdatering av status",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Feil ved oppdatering av status",
        description: "Kunne ikke oppdatere betalingsstatus.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'confirmed': return 'secondary';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <Check className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <ArrowLeftRight className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Helper function to get human-readable status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Venter';
      case 'confirmed': return 'Bekreftet';
      case 'completed': return 'Fullført';
      case 'failed': return 'Mislykket';
      case 'refunded': return 'Refundert';
      default: return status;
    }
  };

  // Render action buttons based on current status
  const renderActionButtons = (payment: Payment) => {
    switch (payment.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-green-900/20 hover:bg-green-900/40 border-green-600/30 text-green-500"
              onClick={() => {
                setSelectedPayment(payment);
                setNewStatus('confirmed');
                setIsDialogOpen(true);
              }}
            >
              <Check className="h-4 w-4 mr-1" /> Bekreft
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-red-900/20 hover:bg-red-900/40 border-red-600/30 text-red-500"
              onClick={() => {
                setSelectedPayment(payment);
                setNewStatus('failed');
                setIsDialogOpen(true);
              }}
            >
              <X className="h-4 w-4 mr-1" /> Avvis
            </Button>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-green-900/20 hover:bg-green-900/40 border-green-600/30 text-green-500"
              onClick={() => {
                setSelectedPayment(payment);
                setNewStatus('completed');
                setIsDialogOpen(true);
              }}
            >
              <Check className="h-4 w-4 mr-1" /> Fullfør
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-red-900/20 hover:bg-red-900/40 border-red-600/30 text-red-500"
              onClick={() => {
                setSelectedPayment(payment);
                setNewStatus('failed');
                setIsDialogOpen(true);
              }}
            >
              <X className="h-4 w-4 mr-1" /> Avvis
            </Button>
          </div>
        );
      default:
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPayment(payment)}
          >
            <FileText className="h-4 w-4 mr-1" /> Detaljer
          </Button>
        );
    }
  };

  return (
    <Card className="bg-cyberdark-900 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <Bitcoin className="h-5 w-5 text-cybergold-400" /> Bitcoin Betalingsverifisering
            </CardTitle>
            <CardDescription>
              Administrer og verifiser Bitcoin-betalinger
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-700"
            onClick={fetchPayments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Oppdater</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="status-filter" className="mr-2">Status:</Label>
              <Select 
                value={filterStatus} 
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px] bg-cyberdark-800 border-gray-700">
                  <SelectValue placeholder="Velg status" />
                </SelectTrigger>
                <SelectContent className="bg-cyberdark-800 border-gray-700">
                  <SelectGroup>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="pending">Venter</SelectItem>
                    <SelectItem value="confirmed">Bekreftet</SelectItem>
                    <SelectItem value="completed">Fullført</SelectItem>
                    <SelectItem value="failed">Mislykket</SelectItem>
                    <SelectItem value="refunded">Refundert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-cyberdark-800 border-gray-700">
              {isLoading ? 'Laster...' : `${payments.length} betalinger`}
            </Badge>
          </div>
        </div>
        
        {/* Payments Table */}
        <div className="rounded-md border border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-cyberdark-800/50 bg-cyberdark-800">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Bruker</TableHead>
                <TableHead>Beløp</TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dato</TableHead>
                <TableHead className="text-right">Handling</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <span className="mt-2 block text-sm text-gray-400">Laster betalinger...</span>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-400">Ingen betalinger funnet</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-cyberdark-800/50">
                    <TableCell className="font-mono text-xs">
                      {payment.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {payment.profiles ? (
                        payment.profiles.full_name || payment.profiles.username
                      ) : (
                        <span className="text-gray-400">Ukjent</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{payment.amount} {payment.currency}</span>
                        <span className="text-xs text-gray-400">
                          {payment.btc_amount} BTC
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="bg-cyberdark-800">
                              {payment.product_type}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Produkt ID: {payment.product_id}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(payment.status)} 
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(payment.status)}
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm">
                              {formatDistanceToNow(new Date(payment.created_at), { 
                                addSuffix: true,
                                locale: nb 
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {format(new Date(payment.created_at), 'PPpp', { locale: nb })}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      {renderActionButtons(payment)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Forrige
          </Button>
          <span className="text-sm text-gray-400">
            Side {currentPage} av {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            Neste
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>

      {/* Payment Details Dialog */}
      <Dialog open={selectedPayment !== null} onOpenChange={open => !open && setSelectedPayment(null)}>
        <DialogContent className="bg-cyberdark-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-cybergold-400" /> 
              Betalingsdetaljer
            </DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <span className="text-sm text-gray-400">
                  ID: {selectedPayment.id}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3 bg-cyberdark-800">
                  <TabsTrigger value="details">Detaljer</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="logs">Logg</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Bruker</Label>
                      <div className="mt-1">
                        {selectedPayment.profiles ? (
                          selectedPayment.profiles.full_name || selectedPayment.profiles.username
                        ) : (
                          <span className="text-gray-400">Ukjent</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Opprettet</Label>
                      <div className="mt-1">
                        {format(new Date(selectedPayment.created_at), 'PPpp', { locale: nb })}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Beløp</Label>
                      <div className="mt-1">
                        {selectedPayment.amount} {selectedPayment.currency}
                        <span className="text-sm text-gray-400 block">
                          {selectedPayment.btc_amount} BTC
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Status</Label>
                      <div className="mt-1">
                        <Badge 
                          variant={getStatusVariant(selectedPayment.status)} 
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(selectedPayment.status)}
                          {getStatusLabel(selectedPayment.status)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Produkt</Label>
                      <div className="mt-1">
                        <Badge variant="outline" className="bg-cyberdark-800">
                          {selectedPayment.product_type}
                        </Badge>
                        <span className="text-sm block mt-1">
                          ID: {selectedPayment.product_id}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Bekreftelser</Label>
                      <div className="mt-1">
                        {selectedPayment.confirmation_count || 0} / 3
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400">Bitcoin Adresse</Label>
                    <div className="mt-1 bg-cyberdark-800 p-2 rounded font-mono text-sm break-all">
                      {selectedPayment.bitcoin_address}
                    </div>
                  </div>
                  
                  {selectedPayment.transaction_id && (
                    <div>
                      <Label className="text-gray-400">Transaksjons-ID</Label>
                      <div className="mt-1 bg-cyberdark-800 p-2 rounded font-mono text-sm break-all">
                        {selectedPayment.transaction_id}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-gray-400">Notater</Label>
                    <div className="mt-1 bg-cyberdark-800 p-2 rounded text-sm">
                      {selectedPayment.notes || <span className="text-gray-400">Ingen notater</span>}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400">Admin Notater</Label>
                    <div className="mt-1 bg-cyberdark-800 p-2 rounded text-sm">
                      {selectedPayment.admin_notes || <span className="text-gray-400">Ingen admin notater</span>}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="status" className="space-y-4 mt-4">
                  <div className="bg-cyberdark-800 p-4 rounded">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Endre betalingsstatus</h3>
                      <Badge variant={getStatusVariant(selectedPayment.status)}>
                        {getStatusLabel(selectedPayment.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status">Ny status</Label>
                        <Select 
                          value={newStatus} 
                          onValueChange={setNewStatus}
                        >
                          <SelectTrigger className="w-full bg-cyberdark-900 border-gray-700 mt-1">
                            <SelectValue placeholder="Velg status" />
                          </SelectTrigger>
                          <SelectContent className="bg-cyberdark-900 border-gray-700">
                            <SelectGroup>
                              <SelectItem value="pending">Venter</SelectItem>
                              <SelectItem value="confirmed">Bekreftet</SelectItem>
                              <SelectItem value="completed">Fullført</SelectItem>
                              <SelectItem value="failed">Mislykket</SelectItem>
                              <SelectItem value="refunded">Refundert</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="adminNotes">Admin notater</Label>
                        <Textarea
                          id="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="mt-1 bg-cyberdark-900 border-gray-700"
                          placeholder="Legg til kommentarer om denne statusendringen"
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={updatePaymentStatus}
                        disabled={isUpdatingStatus || newStatus === selectedPayment.status}
                        className="w-full"
                      >
                        {isUpdatingStatus ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Oppdaterer...
                          </>
                        ) : (
                          <>
                            <RotateCw className="h-4 w-4 mr-2" />
                            Oppdater status
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="logs" className="space-y-4 mt-4">
                  {isLoadingLogs ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="mt-2 block text-sm text-gray-400">Laster logger...</span>
                    </div>
                  ) : paymentLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-400">Ingen logger funnet</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {paymentLogs.map(log => (
                        <div 
                          key={log.id} 
                          className="p-3 bg-cyberdark-800 rounded border border-gray-700"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="bg-cyberdark-900">
                              {log.action}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(log.created_at), { 
                                addSuffix: true,
                                locale: nb
                              })}
                            </span>
                          </div>
                          
                          {log.previous_status && log.new_status && (
                            <div className="flex items-center mt-2 text-sm">
                              <Badge 
                                variant={getStatusVariant(log.previous_status)}
                                className="mr-2"
                              >
                                {getStatusLabel(log.previous_status)}
                              </Badge>
                              <ArrowLeftRight className="h-3 w-3 mx-2 text-gray-400" />
                              <Badge variant={getStatusVariant(log.new_status)}>
                                {getStatusLabel(log.new_status)}
                              </Badge>
                            </div>
                          )}
                          
                          {log.admin_id && (
                            <div className="mt-2 text-xs text-gray-400">
                              Admin: {log.admin_id}
                            </div>
                          )}
                          
                          {log.metadata && log.metadata.notes && (
                            <div className="mt-2 text-sm border-t border-gray-700 pt-2">
                              {log.metadata.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedPayment(null)}
            >
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-cyberdark-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Bekreft statusendring</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil endre betalingsstatus til {getStatusLabel(newStatus)}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminNotesConfirm">Admin notater</Label>
              <Textarea
                id="adminNotesConfirm"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1 bg-cyberdark-900 border-gray-700"
                placeholder="Legg til kommentarer om denne statusendringen"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Avbryt
            </Button>
            <Button 
              onClick={updatePaymentStatus}
              disabled={isUpdatingStatus}
              variant={newStatus === 'failed' || newStatus === 'refunded' ? 'destructive' : 'default'}
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Oppdaterer...
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Bekreft endring
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

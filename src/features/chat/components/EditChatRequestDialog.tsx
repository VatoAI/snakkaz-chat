import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit3, 
  Send, 
  History, 
  Copy, 
  Trash2, 
  Clock,
  MessageSquare,
  Bot,
  RotateCcw
} from 'lucide-react';

export interface ChatRequest {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  mode: string;
  model: string;
  tokens: number;
  status: 'completed' | 'failed' | 'pending';
}

interface EditChatRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onResubmit: (editedMessage: string, originalRequest: ChatRequest) => void;
  chatHistory: ChatRequest[];
}

export const EditChatRequestDialog: React.FC<EditChatRequestDialogProps> = ({
  isOpen,
  onClose,
  onResubmit,
  chatHistory
}) => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ChatRequest | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<ChatRequest[]>([]);

  useEffect(() => {
    if (chatHistory) {
      const filtered = chatHistory.filter(request => 
        request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.response.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [chatHistory, searchTerm]);

  const handleSelectRequest = (request: ChatRequest) => {
    setSelectedRequest(request);
    setEditedMessage(request.message);
  };

  const handleResubmit = () => {
    if (!selectedRequest || !editedMessage.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst velg en forespørsel og skriv inn en melding",
        variant: "destructive",
      });
      return;
    }

    onResubmit(editedMessage, selectedRequest);
    onClose();
    
    toast({
      title: "Forespørsel sendt på nytt",
      description: "Den redigerte forespørselen er sendt til AI-assistenten",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Tekst kopiert til utklippstavlen",
    });
  };

  const getStatusColor = (status: ChatRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/40 max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400 flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Rediger og send på nytt
          </DialogTitle>
          <DialogDescription className="text-cybergold-600">
            Velg en tidligere forespørsel, rediger den og send på nytt
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4">
          {/* Chat History List */}
          <div className="w-1/2 flex flex-col">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Søk i historikk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-cyberdark-800 border border-cybergold-500/30 rounded text-cybergold-300 placeholder-cybergold-600"
              />
            </div>

            <ScrollArea className="flex-1 bg-cyberdark-800 border border-cybergold-500/30 rounded">
              <div className="p-4 space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="text-center text-cybergold-600 py-8">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ingen forespørsler funnet</p>
                    <p className="text-sm mt-2">Prøv å endre søkeordet</p>
                  </div>
                ) : (
                  filteredHistory.map((request) => (
                    <Card 
                      key={request.id}
                      className={`cursor-pointer transition-all ${
                        selectedRequest?.id === request.id 
                          ? 'bg-cyberdark-700 border-cybergold-500/60 ring-2 ring-cybergold-500/30' 
                          : 'bg-cyberdark-700 border-cybergold-500/20 hover:bg-cyberdark-600'
                      }`}
                      onClick={() => handleSelectRequest(request)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(request.status)}`} />
                            <span className="text-sm text-cybergold-600">
                              {formatTimestamp(request.timestamp)}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                            {request.mode}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-cybergold-300 line-clamp-3">
                          {request.message}
                        </p>
                        {request.response && (
                          <p className="text-xs text-cybergold-600 mt-2 line-clamp-2">
                            Svar: {request.response}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 text-xs text-cybergold-600">
                          <span>Tokens: {request.tokens}</span>
                          <span>Model: {request.model}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Edit Panel */}
          <div className="w-1/2 flex flex-col">
            {selectedRequest ? (
              <div className="flex-1 flex flex-col">
                <Card className="bg-cyberdark-800 border-cybergold-500/30 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Valgt forespørsel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-cybergold-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(selectedRequest.timestamp)}</span>
                        <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                          {selectedRequest.mode}
                        </Badge>
                      </div>
                      <div className="bg-cyberdark-700 p-3 rounded border border-cybergold-500/20">
                        <p className="text-sm text-cybergold-300">
                          {selectedRequest.message}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(selectedRequest.message)}
                          className="border-cybergold-500/40"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Kopier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditedMessage(selectedRequest.message)}
                          className="border-cybergold-500/40"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Tilbakestill
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-cyberdark-800 border-cybergold-500/30 flex-1">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400 flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Rediger forespørsel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <Textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      placeholder="Rediger forespørselen din..."
                      className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300 resize-none flex-1"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-cybergold-600">
                        Tegn: {editedMessage.length}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="border-cybergold-500/40"
                        >
                          Avbryt
                        </Button>
                        <Button
                          onClick={handleResubmit}
                          disabled={!editedMessage.trim()}
                          className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send på nytt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Original Response */}
                {selectedRequest.response && (
                  <Card className="bg-cyberdark-800 border-cybergold-500/30 mt-4">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Opprinnelig svar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-cyberdark-700 p-3 rounded border border-cybergold-500/20">
                        <p className="text-sm text-cybergold-300 whitespace-pre-wrap">
                          {selectedRequest.response}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(selectedRequest.response)}
                          className="border-cybergold-500/40"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Kopier svar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-cybergold-600">
                  <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Velg en forespørsel fra historikken</p>
                  <p className="text-sm mt-2">Klikk på en forespørsel for å redigere den</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
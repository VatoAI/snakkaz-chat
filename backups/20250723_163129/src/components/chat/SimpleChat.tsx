import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Enkel, fungerende chat for gratis brukere
const SimpleChat: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, user: string, timestamp: Date}>>([]);

  const sendMessage = () => {
    if (message.trim() && user) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        user: user.email || 'Anonym',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Logg inn for å chatte</h3>
        <p className="text-muted-foreground">Du må være logget inn for å bruke chat-funksjonen.</p>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Snakkaz Chat - Gratis versjon</h3>
        <p className="text-sm text-muted-foreground">Velkommen {user.email}</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>Ingen meldinger ennå. Send den første meldingen!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 bg-muted rounded">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv en melding..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            Send
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Oppgrader til Premium for end-to-end kryptering og private grupper
        </p>
      </div>
    </Card>
  );
};

export default SimpleChat;

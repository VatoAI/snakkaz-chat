import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lock, Shield, Zap, MessageCircle, Phone, Video, Settings, Search, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
    id: string;
    type: 'user' | 'contact';
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    encrypted: boolean;
}

interface Contact {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    avatar?: string;
    online: boolean;
    unread: number;
    encrypted: boolean;
}

const SnakkaZChatOriginal: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'contact',
            content: 'Hei! Velkommen til SnakkaZ. Alle meldinger er end-to-end kryptert 🔒',
            timestamp: new Date(Date.now() - 300000),
            status: 'read',
            encrypted: true,
        },
        {
            id: '2',
            type: 'user',
            content: 'Flott! Takk for den sikre meldingstjenesten',
            timestamp: new Date(Date.now() - 240000),
            status: 'delivered',
            encrypted: true,
        },
        {
            id: '3',
            type: 'contact',
            content: 'Vi bruker samme kryptering som Signal og WhatsApp, men med norsk eleganse ✨',
            timestamp: new Date(Date.now() - 180000),
            status: 'read',
            encrypted: true,
        },
    ]);

    const [contacts] = useState<Contact[]>([
        {
            id: '1',
            name: 'Erik Nordmann',
            lastMessage: 'Vi bruker samme kryptering som Signal...',
            timestamp: new Date(Date.now() - 180000),
            online: true,
            unread: 0,
            encrypted: true,
        },
        {
            id: '2',
            name: 'Astrid Bergen',
            lastMessage: 'Møtes vi i morgen på kontoret?',
            timestamp: new Date(Date.now() - 3600000),
            online: false,
            unread: 2,
            encrypted: true,
        },
        {
            id: '3',
            name: 'Tech Team',
            lastMessage: 'MCP integration er nå live! 🚀',
            timestamp: new Date(Date.now() - 7200000),
            online: true,
            unread: 1,
            encrypted: true,
        },
    ]);

    const [inputValue, setInputValue] = useState('');
    const [selectedContact, setSelectedContact] = useState(contacts[0]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
            status: 'sent',
            encrypted: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate contact response
        setTimeout(() => {
            const responses = [
                'Interessant! Fortell meg mer om det.',
                'Det høres bra ut 👍',
                'Enig! SnakkaZ gjør kommunikasjon tryggere.',
                'Takk for meldingen. Jeg svarer snart.',
                'Perfekt timing! Jeg tenkte på det samme.',
            ];

            const response: Message = {
                id: (Date.now() + 1).toString(),
                type: 'contact',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                status: 'delivered',
                encrypted: true,
            };

            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('no-NO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatusIcon = ({ status }: { status: Message['status'] }) => {
        switch (status) {
            case 'sent':
                return <Check className="w-3 h-3 text-gray-400" />;
            case 'delivered':
                return <CheckCheck className="w-3 h-3 text-gray-400" />;
            case 'read':
                return <CheckCheck className="w-3 h-3" style={{ color: 'var(--snakkaz-blue)' }} />;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto h-[100vh] bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 liquid-glass border-r border-white/20 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full aurora-primary flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-white">SnakkaZ</h1>
                                <p className="text-xs text-white/60">Sikker • Norsk • Premium</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                                <Lock className="w-3 h-3 mr-1" />
                                Kryptert
                            </Badge>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                            placeholder="Søk i samtaler..."
                            className="pl-10 liquid-glass border-white/20 text-white placeholder:text-white/40"
                        />
                    </div>
                </div>

                {/* Contacts */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 mb-2 ${selectedContact.id === contact.id
                                        ? 'aurora-primary snakkaz-glow'
                                        : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 border-2 border-white/20">
                                            <AvatarImage src={contact.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {contact.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {contact.online && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 pulse-secure" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-white truncate">{contact.name}</h3>
                                            <div className="flex items-center gap-1">
                                                {contact.encrypted && (
                                                    <Shield className="w-3 h-3" style={{ color: 'var(--snakkaz-green)' }} />
                                                )}
                                                <span className="text-xs text-white/60">
                                                    {formatTime(contact.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-white/70 truncate">{contact.lastMessage}</p>
                                            {contact.unread > 0 && (
                                                <Badge
                                                    variant="default"
                                                    className="min-w-[20px] h-5 rounded-full text-xs"
                                                    style={{ backgroundColor: 'var(--snakkaz-blue)' }}
                                                >
                                                    {contact.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 liquid-glass border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white/20">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {selectedContact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold text-white">{selectedContact.name}</h2>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full pulse-secure" />
                                    <span className="text-sm text-white/60">Online</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-400">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-xs">End-to-end kryptert</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <Video className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 aurora-secondary">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.type === 'contact' && (
                                    <Avatar className="w-8 h-8 border border-white/20 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                            {selectedContact.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-1' : ''}`}>
                                    <Card className={`p-3 relative ${message.type === 'user'
                                            ? 'aurora-primary ml-auto snakkaz-glow border-white/30'
                                            : 'liquid-glass border-white/20'
                                        }`}>
                                        <p className="text-sm leading-relaxed text-white">{message.content}</p>

                                        <div className="flex items-center justify-between mt-2 gap-2">
                                            <div className="flex items-center gap-1">
                                                {message.encrypted && (
                                                    <Lock className="w-3 h-3" style={{ color: 'var(--snakkaz-green)' }} />
                                                )}
                                                <span className="text-xs text-white/60">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>

                                            {message.type === 'user' && (
                                                <StatusIcon status={message.status} />
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                {message.type === 'user' && (
                                    <Avatar className="w-8 h-8 border border-white/20 flex-shrink-0">
                                        <AvatarFallback style={{ backgroundColor: 'var(--snakkaz-blue)' }} className="text-white text-xs">
                                            Du
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8 border border-white/20 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <Card className="p-3 liquid-glass border-white/20">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                </Card>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 liquid-glass border-t border-white/10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 relative">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Skriv en sikker melding..."
                                    className="liquid-glass border-white/20 text-white placeholder:text-white/40 pr-12 py-3 rounded-2xl"
                                    disabled={isTyping}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                    <Lock className="w-4 h-4" style={{ color: 'var(--snakkaz-green)' }} />
                                    <Zap className="w-4 h-4" style={{ color: 'var(--snakkaz-blue)' }} />
                                </div>
                            </div>

                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                size="icon"
                                className="aurora-primary rounded-full w-12 h-12 snakkaz-glow hover:scale-105 transition-transform"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-center mt-2 gap-2 text-xs text-white/40">
                            <Shield className="w-3 h-3" style={{ color: 'var(--snakkaz-green)' }} />
                            <span>End-to-end kryptert med norsk eleganse</span>
                            <span>•</span>
                            <span>SnakkaZ 🇳🇴</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZChatOriginal;

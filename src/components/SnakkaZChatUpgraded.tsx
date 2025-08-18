import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, Shield, Zap, MessageCircle, Phone, Video, Search, MoreVertical, Check, CheckCheck, Smile, Plus, Paperclip, Mic, Image, Star } from 'lucide-react';
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

const SnakkaZChatUpgraded: React.FC = () => {
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
        {
            id: '4',
            type: 'user',
            content: 'Ser fram til å teste ut alle funksjonene! 🚀',
            timestamp: new Date(Date.now() - 120000),
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
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            online: true,
            unread: 0,
            encrypted: true,
        },
        {
            id: '2',
            name: 'Astrid Bergen',
            lastMessage: 'Møtes vi i morgen på kontoret?',
            timestamp: new Date(Date.now() - 3600000),
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            online: false,
            unread: 2,
            encrypted: true,
        },
        {
            id: '3',
            name: 'Tech Team',
            lastMessage: 'MCP integration er nå live! 🚀',
            timestamp: new Date(Date.now() - 7200000),
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
            online: true,
            unread: 1,
            encrypted: true,
        },
        {
            id: '4',
            name: 'Nina Solberg',
            lastMessage: 'Har du sett den nye designen?',
            timestamp: new Date(Date.now() - 10800000),
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            online: true,
            unread: 0,
            encrypted: true,
        },
        {
            id: '5',
            name: 'Oslo Utviklere',
            lastMessage: 'Ny meetup neste uke! 👨‍💻',
            timestamp: new Date(Date.now() - 14400000),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            online: false,
            unread: 5,
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
                'Flott å høre fra deg! 😊',
                'SnakkaZ holder høy kvalitet på sikkerheten.',
                'Norsk teknologi på sitt beste! 🇳🇴',
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
                return <CheckCheck className="w-3 h-3 text-snakkaz-blue" />;
        }
    };

    return (
        <div className="w-full max-w-8xl mx-auto h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800 relative overflow-hidden font-snakkaz">
            {/* Aurora Background Effects */}
            <div className="absolute inset-0 aurora-bg opacity-20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-snakkaz-blue/20 rounded-full blur-3xl animate-snakkaz-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-snakkaz-purple/20 rounded-full blur-3xl animate-snakkaz-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-cyberdark-950/80 to-transparent" />

            {/* Main Content */}
            <div className="relative z-10 h-full flex shadow-2xl">
                {/* Enhanced Sidebar */}
                <div className="w-80 backdrop-blur-2xl bg-black/30 border-r border-snakkaz-blue/20 flex flex-col shadow-xl">
                    {/* Premium Header */}
                    <div className="p-5 border-b border-snakkaz-blue/20 bg-gradient-to-r from-snakkaz-blue/10 to-snakkaz-purple/10">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-snakkaz-blue to-snakkaz-purple flex items-center justify-center shadow-xl animate-snakkaz-glow">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-wide">SnakkaZ</h1>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-3 h-3 text-snakkaz-orange" />
                                        <p className="text-xs text-white/80 font-snakkaz-mono">Premium • Sikker • Norsk 🇳🇴</p>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-snakkaz-green/20 text-snakkaz-green border-snakkaz-green/40 animate-pulse shadow-lg">
                                <Lock className="w-3 h-3 mr-1" />
                                E2E
                            </Badge>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-snakkaz-blue transition-all duration-300" />
                            <Input
                                placeholder="Søk i samtaler og kontakter..."
                                className="pl-12 h-12 backdrop-blur-md bg-black/40 border-snakkaz-blue/30 text-white placeholder:text-white/60 rounded-2xl focus:border-snakkaz-blue/70 focus:ring-2 focus:ring-snakkaz-blue/20 transition-all duration-300 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Enhanced Contacts */}
                    <ScrollArea className="flex-1 p-2">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 mb-2 group ${selectedContact.id === contact.id
                                        ? 'bg-gradient-to-r from-snakkaz-blue/20 to-snakkaz-purple/20 border border-snakkaz-blue/30 shadow-xl animate-snakkaz-glow'
                                        : 'hover:bg-white/5 hover:backdrop-blur-md hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="w-14 h-14 border-2 border-snakkaz-blue/30 shadow-lg">
                                            <AvatarImage src={contact.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-snakkaz-blue to-snakkaz-purple text-white font-semibold">
                                                {contact.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {contact.online && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-snakkaz-green rounded-full border-3 border-cyberdark-900 animate-snakkaz-pulse shadow-lg" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-white truncate text-base">{contact.name}</h3>
                                            <div className="flex items-center gap-2">
                                                {contact.encrypted && (
                                                    <Shield className="w-3 h-3 text-snakkaz-green" />
                                                )}
                                                <span className="text-xs text-white/70 font-snakkaz-mono">
                                                    {formatTime(contact.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">
                                                {contact.lastMessage}
                                            </p>
                                            {contact.unread > 0 && (
                                                <Badge className="min-w-[24px] h-6 rounded-full text-xs bg-snakkaz-orange text-white font-semibold shadow-lg animate-bounce">
                                                    {contact.unread > 9 ? '9+' : contact.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* Enhanced Chat Area */}
                <div className="flex-1 flex flex-col backdrop-blur-sm bg-black/10">
                    {/* Premium Chat Header */}
                    <div className="p-5 backdrop-blur-xl bg-black/20 border-b border-snakkaz-blue/20 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-snakkaz-blue/40 shadow-lg">
                                <AvatarImage src={selectedContact.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-snakkaz-blue to-snakkaz-purple text-white font-semibold">
                                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-bold text-white text-lg">{selectedContact.name}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-snakkaz-green rounded-full animate-snakkaz-pulse" />
                                        <span className="text-sm text-white/80">Aktiv nå</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-snakkaz-green">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-xs font-snakkaz-mono">End-to-end kryptert</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button size="icon" className="bg-snakkaz-blue/20 hover:bg-snakkaz-blue/30 text-white border border-snakkaz-blue/30 transition-all duration-300 hover:scale-105">
                                <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="icon" className="bg-snakkaz-purple/20 hover:bg-snakkaz-purple/30 text-white border border-snakkaz-purple/30 transition-all duration-300 hover:scale-105">
                                <Video className="w-4 h-4" />
                            </Button>
                            <Button size="icon" className="bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Premium Messages */}
                    <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-transparent to-black/5">
                        <div className="space-y-6 max-w-5xl mx-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-4 animate-in slide-in-from-bottom-4 duration-500 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {message.type === 'contact' && (
                                        <Avatar className="w-9 h-9 border border-snakkaz-blue/20 flex-shrink-0 shadow-md">
                                            <AvatarImage src={selectedContact.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-snakkaz-blue to-snakkaz-purple text-white text-sm">
                                                {selectedContact.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className={`max-w-[75%] ${message.type === 'user' ? 'order-1' : ''}`}>
                                        <Card className={`p-4 relative shadow-xl transition-all duration-300 hover:scale-[1.02] ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-snakkaz-blue/30 to-snakkaz-purple/30 ml-auto border-snakkaz-blue/40 text-white'
                                                : 'backdrop-blur-xl bg-black/30 border-snakkaz-blue/20 text-white'
                                            }`}>
                                            <p className="text-sm leading-relaxed font-medium">{message.content}</p>

                                            <div className="flex items-center justify-between mt-3 gap-3">
                                                <div className="flex items-center gap-2">
                                                    {message.encrypted && (
                                                        <Lock className="w-3 h-3 text-snakkaz-green" />
                                                    )}
                                                    <span className="text-xs text-white/70 font-snakkaz-mono">
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
                                        <Avatar className="w-9 h-9 border border-snakkaz-blue/20 flex-shrink-0 shadow-md">
                                            <AvatarFallback className="bg-snakkaz-blue text-white text-sm font-semibold">
                                                Du
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-in fade-in duration-500">
                                    <Avatar className="w-9 h-9 border border-snakkaz-blue/20 flex-shrink-0 shadow-md">
                                        <AvatarImage src={selectedContact.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-snakkaz-blue to-snakkaz-purple text-white text-sm">
                                            {selectedContact.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Card className="p-4 backdrop-blur-xl bg-black/30 border-snakkaz-blue/20 shadow-xl">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-snakkaz-blue rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-snakkaz-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-2 h-2 bg-snakkaz-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </Card>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Premium Input Area */}
                    <div className="p-5 backdrop-blur-xl bg-black/20 border-t border-snakkaz-blue/20 shadow-xl">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex gap-3 items-end">
                                <div className="flex gap-2">
                                    <Button size="icon" className="bg-snakkaz-purple/20 hover:bg-snakkaz-purple/30 text-white border border-snakkaz-purple/30 transition-all duration-300 hover:scale-105 shadow-lg">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" className="bg-snakkaz-blue/20 hover:bg-snakkaz-blue/30 text-white border border-snakkaz-blue/30 transition-all duration-300 hover:scale-105 shadow-lg">
                                        <Image className="w-4 h-4" />
                                    </Button>
                                </div>

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
                                        className="h-14 backdrop-blur-md bg-black/30 border-snakkaz-blue/30 text-white placeholder:text-white/60 pr-16 rounded-2xl focus:border-snakkaz-blue/70 focus:ring-2 focus:ring-snakkaz-blue/20 transition-all duration-300 shadow-lg font-snakkaz"
                                        disabled={isTyping}
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                        <Button size="icon" className="bg-transparent hover:bg-snakkaz-green/20 text-snakkaz-green w-8 h-8 transition-all duration-300 hover:scale-110">
                                            <Lock className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" className="bg-transparent hover:bg-snakkaz-blue/20 text-snakkaz-blue w-8 h-8 transition-all duration-300 hover:scale-110">
                                            <Zap className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isTyping}
                                    size="icon"
                                    className="bg-gradient-to-r from-snakkaz-blue to-snakkaz-purple rounded-2xl w-14 h-14 shadow-xl animate-snakkaz-glow hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send className="w-6 h-6 text-white" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-center mt-3 gap-2 text-xs text-white/60">
                                <Shield className="w-3 h-3 text-snakkaz-green" />
                                <span className="font-snakkaz-mono">End-to-end kryptert med norsk eleganse</span>
                                <span>•</span>
                                <Star className="w-3 h-3 text-snakkaz-orange" />
                                <span className="font-bold">SnakkaZ Premium 🇳🇴</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZChatUpgraded;

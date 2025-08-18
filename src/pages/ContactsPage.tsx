import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SnakkaZNavigation from '../components/navigation/SnakkaZNavigationFixed';
import {
    Search,
    Plus,
    MessageCircle,
    Phone,
    Video,
    Users,
    Shield,
    UserPlus,
    MoreVertical,
    Star,
    Clock
} from 'lucide-react';

interface Contact {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
    lastSeen?: string;
    isStarred?: boolean;
    isGroup?: boolean;
    memberCount?: number;
}

const ContactsPage: React.FC = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'contacts' | 'groups'>('all');

    // Mock contacts data - in real app this would come from API
    const [contacts] = useState<Contact[]>([
        {
            id: '1',
            name: 'Erik Nordmann',
            username: '@erikn',
            status: 'online',
            isStarred: true,
            lastSeen: '17:17'
        },
        {
            id: '2',
            name: 'Astrid Bergen',
            username: '@astrid',
            status: 'offline',
            lastSeen: '16:20'
        },
        {
            id: '3',
            name: 'Tech Team',
            username: '@techteam',
            status: 'online',
            isGroup: true,
            memberCount: 5,
            lastSeen: '15:20'
        },
        {
            id: '4',
            name: 'Marketing Team',
            username: '@marketing',
            status: 'away',
            isGroup: true,
            memberCount: 8,
            lastSeen: '14:45'
        },
        {
            id: '5',
            name: 'Lars Andersen',
            username: '@lars',
            status: 'online',
            lastSeen: '13:30'
        }
    ]);

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.username.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeFilter === 'contacts') return matchesSearch && !contact.isGroup;
        if (activeFilter === 'groups') return matchesSearch && contact.isGroup;
        return matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status: string, lastSeen?: string) => {
        switch (status) {
            case 'online': return 'Online';
            case 'away': return 'Borte';
            case 'offline': return lastSeen ? `Sett ${lastSeen}` : 'Offline';
            default: return 'Ukjent';
        }
    };

    return (
        <div className="snakkaz-contacts-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
            {/* Navigation */}
            <SnakkaZNavigation
                userName={user?.user_metadata?.username || "Erik Nordmann"}
                notificationCount={3}
            />

            {/* Main Chat Layout */}
            <div className="flex h-[calc(100vh-73px)]">
                {/* Left Sidebar - Contacts List */}
                <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/30">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700/30">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">🇳🇴</span>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">SnakkaZ</h1>
                                    <p className="text-xs text-gray-400">Sikker • Norsk • Premium</p>
                                </div>
                            </div>
                            <Shield className="w-5 h-5 text-green-400" />
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Søk i kontakter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex mt-4 bg-gray-700/30 rounded-lg p-1">
                            {[
                                { key: 'all', label: 'Alle', icon: Users },
                                { key: 'contacts', label: 'Kontakter', icon: MessageCircle },
                                { key: 'groups', label: 'Grupper', icon: Users }
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(key as any)}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeFilter === key
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contacts List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center p-4 hover:bg-gray-700/30 cursor-pointer border-b border-gray-700/20 transition-colors group"
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {contact.isGroup ? (
                                            <Users className="w-6 h-6" />
                                        ) : (
                                            contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-gray-800`}></div>
                                </div>

                                {/* Contact Info */}
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold text-white truncate">{contact.name}</h3>
                                            {contact.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                                        </div>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:bg-gray-600 rounded">
                                                <MessageCircle className="w-4 h-4 text-gray-400" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-600 rounded">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-600 rounded">
                                                <Video className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-400">{contact.username}</p>
                                        <span className="text-xs text-gray-500">
                                            {getStatusText(contact.status, contact.lastSeen)}
                                        </span>
                                    </div>
                                    {contact.isGroup && contact.memberCount && (
                                        <p className="text-xs text-gray-500 mt-1">{contact.memberCount} medlemmer</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredContacts.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">Ingen kontakter funnet</p>
                                <p className="text-gray-500 text-sm mt-1">Prøv et annet søkeord</p>
                            </div>
                        )}
                    </div>

                    {/* Add Contact Button */}
                    <div className="p-4 border-t border-gray-700/30">
                        <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                            <UserPlus className="w-5 h-5" />
                            <span>Legg til kontakt</span>
                        </button>
                    </div>
                </div>

                {/* Right Side - Contact Details/Actions */}
                <div className="flex-1 bg-gray-800/30 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Velg en kontakt</h2>
                        <p className="text-gray-400 max-w-md">
                            Velg en kontakt fra listen for å starte en samtale eller se detaljer.
                        </p>

                        {/* Quick Actions */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                <UserPlus className="w-5 h-5" />
                                <span>Ny kontakt</span>
                            </button>
                            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                <Users className="w-5 h-5" />
                                <span>Ny gruppe</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageCircle,
    Users,
    Shield,
    Zap,
    TrendingUp,
    Clock,
    Activity,
    Bot,
    UserPlus,
    ChevronRight,
    Settings,
    Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SnakkaZNavigation from '../components/navigation/SnakkaZNavigationFixed';
import { SnakkaZLogo } from '../components/branding/SnakkaZLogo';

const EnhancedDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [timeOfDay, setTimeOfDay] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('God morgen');
        else if (hour < 18) setTimeOfDay('God dag');
        else setTimeOfDay('God kveld');
    }, []);

    const stats = {
        totalMessages: 1247,
        activeChats: 8,
        contacts: 23,
        encryptedMessages: 1247,
        todayMessages: 34,
        responseTime: '2.3s'
    };

    const quickActions = [
        {
            title: 'Start ny chat',
            description: 'Send din første krypterte melding',
            icon: <MessageCircle className="h-5 w-5" />,
            action: () => navigate('/chat'),
            color: 'bg-blue-500'
        },
        {
            title: 'Legg til kontakt',
            description: 'Utvid nettverket ditt',
            icon: <UserPlus className="h-5 w-5" />,
            action: () => navigate('/contacts'),
            color: 'bg-green-500'
        },
        {
            title: 'Sikkerhet',
            description: 'Sjekk krypteringsinnstillinger',
            icon: <Shield className="h-5 w-5" />,
            action: () => navigate('/settings'),
            color: 'bg-purple-500'
        },
        {
            title: 'Profil',
            description: 'Oppdater profilinformasjon',
            icon: <Star className="h-5 w-5" />,
            action: () => navigate('/profile'),
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="snakkaz-dashboard min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Navigation */}
            <SnakkaZNavigation
                userName="Erik Nordmann"
                notificationCount={3}
            />

            {/* Main Dashboard */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {timeOfDay}, Erik! 👋
                            </h1>
                            <p className="text-gray-600">
                                Her er en oversikt over din SnakkaZ aktivitet
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <SnakkaZLogo variant="hero" animated={true} />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="snakkaz-stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total meldinger</CardTitle>
                            <MessageCircle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalMessages}</div>
                            <p className="text-xs text-green-600">
                                +{stats.todayMessages} i dag
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="snakkaz-stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktive chatter</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeChats}</div>
                            <p className="text-xs text-gray-600">
                                {stats.contacts} totale kontakter
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="snakkaz-stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Krypterte meldinger</CardTitle>
                            <Shield className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.encryptedMessages}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Progress value={100} className="flex-1 h-2" />
                                <span className="text-xs text-green-600">100%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="snakkaz-stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Responstid</CardTitle>
                            <Zap className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.responseTime}</div>
                            <p className="text-xs text-green-600">
                                ⚡ Supersonic hastighet
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Hurtighandlinger
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="h-auto p-4 text-left justify-start"
                                    onClick={action.action}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <div className="font-medium">{action.title}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {action.description}
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Status Banner */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-100">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-green-900">
                                        SnakkaZ sikkerhet er aktiv
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        Alle dine meldinger er beskyttet med end-to-end kryptering
                                    </p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                ✅ Sikker
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EnhancedDashboardPage;

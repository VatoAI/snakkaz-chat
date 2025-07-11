import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { 
  MessageSquare, 
  Users, 
  Bot, 
  Heart, 
  Settings, 
  UserPlus,
  Globe,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('God morgen');
    else if (hour < 18) setTimeOfDay('God dag');
    else setTimeOfDay('God kveld');
  }, []);

  const quickActions = [
    {
      title: 'Start Chat',
      description: 'Begynn en ny samtale',
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate('/basic-chat'),
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Finn Venner',
      description: 'Utvid nettverket ditt',
      icon: <UserPlus className="h-6 w-6" />,
      action: () => navigate('/find-friends'),
      color: 'bg-green-500/10 text-green-400 border-green-500/20'
    },
    {
      title: 'AI Assistent',
      description: 'Chat med AI',
      icon: <Bot className="h-6 w-6" />,
      action: () => navigate('/ai-chat'),
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      title: 'Grupper',
      description: 'Bli med i grupper',
      icon: <Globe className="h-6 w-6" />,
      action: () => navigate('/group-chat'),
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    }
  ];

  const recentActivity = [
    { type: 'message', title: 'Ny melding i Teknologi-gruppen', time: '5 min siden' },
    { type: 'friend', title: 'Du har en ny venneforespørsel', time: '10 min siden' },
    { type: 'ai', title: 'AI-assistent svarte på spørsmålet ditt', time: '1 time siden' }
  ];

  const chatHubItems = [
    {
      title: 'Private Samtaler',
      description: 'En-til-en chat',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/basic-chat',
      count: 3
    },
    {
      title: 'Venner',
      description: 'Dine forbindelser',
      icon: <Heart className="h-5 w-5" />,
      path: '/friends',
      count: 12
    },
    {
      title: 'Grupper',
      description: 'Felleskap og team',
      icon: <Users className="h-5 w-5" />,
      path: '/group-chat',
      count: 5
    },
    {
      title: 'AI Chat',
      description: 'Intelligent assistent',
      icon: <Bot className="h-5 w-5" />,
      path: '/ai-chat',
      badge: 'BETA'
    }
  ];

  return (
    <UnifiedLayout 
      title="Dashboard"
      subtitle="Din sikre kommunikasjonsplattform"
    >
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-cybergold-600/20 to-cybergold-400/20 border border-cybergold-500/30 rounded-xl p-4">
            <h1 className="text-xl font-bold text-cybergold-400">
              {timeOfDay}, {user?.user_metadata?.username || 'Bruker'}!
            </h1>
            <p className="text-cybergold-300 mt-1 text-sm">
              Velkommen til SnakkaZ Chat
            </p>
          </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 rounded-lg p-3 border border-cybergold-500/30">
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} className="text-cybergold-400" />
                <div>
                  <div className="text-lg font-bold text-cybergold-400">24</div>
                  <div className="text-xs text-cyberdark-300">Chats</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyberblue-500/20 to-cyberblue-600/20 rounded-lg p-3 border border-cyberblue-500/30">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-cyberblue-400" />
                <div>
                  <div className="text-lg font-bold text-cyberblue-400">8</div>
                  <div className="text-xs text-cyberdark-300">Grupper</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cybergreen-500/20 to-cybergreen-600/20 rounded-lg p-3 border border-cybergreen-500/30">
              <div className="flex items-center space-x-2">
                <TrendingUp size={18} className="text-cybergreen-400" />
                <div>
                  <div className="text-lg font-bold text-cybergreen-400">156</div>
                  <div className="text-xs text-cyberdark-300">Venner</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyberred-500/20 to-cyberred-600/20 rounded-lg p-3 border border-cyberred-500/30">
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-cyberred-400" />
                <div>
                  <div className="text-lg font-bold text-cyberred-400">12</div>
                  <div className="text-xs text-cyberdark-300">Uleste</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">⚡ Quick Actions</h3>
            
            {quickActions.slice(0, 4).map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full p-4 rounded-lg border transition-all duration-200 active:scale-95 ${action.color}`}
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div className="text-left">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm opacity-70">{action.description}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </div>
              </button>
            ))}
          </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chatHubItems.map((item, index) => (
                    <Card 
                      key={index}
                      className="bg-cyberdark-800/50 border-cyberdark-600 hover:bg-cyberdark-800 transition-colors cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cybergold-500/20 rounded-lg text-cybergold-400">
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-cybergold-300">{item.title}</h3>
                              <p className="text-sm text-cybergold-600">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.count && (
                              <Badge variant="secondary" className="bg-cybergold-500/20 text-cybergold-400">
                                {item.count}
                              </Badge>
                            )}
                            {item.badge && (
                              <Badge className="bg-blue-500/20 text-blue-400">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="h-4 w-4 text-cybergold-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Hurtighandlinger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color}`}
                      onClick={action.action}
                    >
                      {action.icon}
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs opacity-70">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Nylig aktivitet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 hover:bg-cyberdark-800/50 rounded-lg">
                        <div className="p-1 bg-cybergold-500/20 rounded">
                          {activity.type === 'message' && <MessageSquare className="h-3 w-3 text-cybergold-400" />}
                          {activity.type === 'friend' && <Heart className="h-3 w-3 text-cybergold-400" />}
                          {activity.type === 'ai' && <Bot className="h-3 w-3 text-cybergold-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cybergold-300 truncate">{activity.title}</p>
                          <p className="text-xs text-cybergold-600">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Profile */}
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Din profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cybergold-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cybergold-400 font-medium">
                        {user?.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-cybergold-300">
                        {user?.user_metadata?.username || 'Brukernavn'}
                      </p>
                      <p className="text-sm text-cybergold-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/profile')}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-cybergold-600 text-cybergold-400"
                    >
                      Rediger profil
                    </Button>
                    <Button
                      onClick={() => navigate('/settings')}
                      size="sm"
                      variant="outline"
                      className="border-cyberdark-600 text-cyberdark-400"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Dine tall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-cybergold-600 text-sm">Meldinger sendt</span>
                    <span className="text-cybergold-400 font-medium">248</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cybergold-600 text-sm">Venner</span>
                    <span className="text-cybergold-400 font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cybergold-600 text-sm">Grupper</span>
                    <span className="text-cybergold-400 font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cybergold-600 text-sm">Trust Score</span>
                    <Badge className="bg-green-500/20 text-green-400">Verifisert ✅</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
        }
      </div>
    </UnifiedLayout>
  );
};

export default Dashboard;

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/mobile/MobileLayout';
import Layout from '@/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedFriendsList } from '@/components/chat/friends/EnhancedFriendsList';
import { Heart, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * Friends Page - Main friends management page
 * 
 * Displays the user's friends list with all friend management functionality
 * Uses the existing EnhancedFriendsList component for comprehensive friend features
 */
const Friends = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const content = (
    <div className="min-h-screen bg-cyberdark-950 text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cybergold-500/20 rounded-lg">
                <Heart className="h-8 w-8 text-cybergold-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cybergold-100">Mine Venner</h1>
                <p className="text-cyberdark-300">Administrer dine vennskap og forbindelser</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
                onClick={() => navigate('/find-friends')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Finn Venner
              </Button>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-cybergold-500/30 to-transparent" />
        </div>

        {/* Friends Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Friends Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cybergold-200">
                  <Users className="h-5 w-5" />
                  Venneliste
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.id ? (
                  <EnhancedFriendsList currentUserId={user.id} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cyberdark-400">Du må være logget inn for å se venner</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with quick actions and stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Hurtighandlinger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-cybergold-500 hover:bg-cybergold-600 text-black"
                  onClick={() => navigate('/find-friends')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Finn Nye Venner
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
                  onClick={() => navigate('/chat')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            {/* Connection Tips */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Tips for Å Koble Seg Til</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-cyberdark-300">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Bruk søkefunksjonen for å finne venner ved brukernavn</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Send venneforespørsler til folk du kjenner</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Administrer forespørsler i "Pending" fanen</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Start private samtaler direkte fra vennelisten</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Use mobile layout if on mobile
  if (isMobile) {
    return (
      <MobileLayout>
        {content}
      </MobileLayout>
    );
  }

  // Use regular layout for desktop
  return (
    <Layout>
      {content}
    </Layout>
  );
};

export default Friends;

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/mobile/MobileLayout';
import Layout from '@/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FriendsSearchSection } from '@/components/chat/friends/FriendsSearchSection';
import { EnhancedFriendRequestHandler } from '@/components/chat/friends/enhanced/EnhancedFriendRequestHandler';
import { Search, UserPlus, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '@/hooks/useFriends';

/**
 * Find Friends Page - Search and connect with new friends
 * 
 * Provides functionality to search for users, send friend requests,
 * and manage incoming/outgoing friend requests
 */
const FindFriends = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { friends, handleSendFriendRequest } = useFriends();

  // Get existing friend IDs to filter from search results
  const existingFriendIds = friends.map(friend => friend.user_id);

  const content = (
    <div className="min-h-screen bg-cyberdark-950 text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cybergold-500/20 rounded-lg">
                <Search className="h-8 w-8 text-cybergold-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cybergold-100">Finn Venner</h1>
                <p className="text-cyberdark-300">Søk etter nye venner og administrer forespørsler</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
                onClick={() => navigate('/friends')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Mine Venner
              </Button>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-cybergold-500/30 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Friend Search */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cybergold-200">
                  <Search className="h-5 w-5" />
                  Søk Etter Venner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.id ? (
                  <FriendsSearchSection
                    currentUserId={user.id}
                    onSendFriendRequest={handleSendFriendRequest}
                    existingFriends={existingFriendIds}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cyberdark-400">Du må være logget inn for å søke etter venner</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Friend Request Management */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cybergold-200">
                  <UserPlus className="h-5 w-5" />
                  Venneforespørsler
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.id ? (
                  <EnhancedFriendRequestHandler 
                    currentUserId={user.id}
                    onRequestAccepted={(userId) => {
                      console.log('Friend request accepted:', userId);
                      // The friends list will be updated automatically through the hook
                    }}
                    onRequestRejected={(userId) => {
                      console.log('Friend request rejected:', userId);
                    }}
                    onRequestCancelled={(userId) => {
                      console.log('Friend request cancelled:', userId);
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-cyberdark-400">Du må være logget inn for å se forespørsler</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with tips and stats */}
          <div className="space-y-6">
            {/* Search Tips */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Søketips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-cyberdark-300">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Søk etter eksakt brukernavn for beste resultater</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Brukernavnet må være minst 3 tegn langt</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cybergold-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Du kan ikke sende forespørsler til eksisterende venner</p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Personvern</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-cyberdark-300">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Kun brukernavn vises i søkeresultater</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Du kan alltid blokkere uønskede forespørsler</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Venneforespørsler kan trekkes tilbake</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-cyberdark-900/50 border-cyberdark-800">
              <CardHeader>
                <CardTitle className="text-cybergold-200">Hurtighandlinger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-cybergold-500 hover:bg-cybergold-600 text-black"
                  onClick={() => navigate('/friends')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Se Mine Venner
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

export default FindFriends;

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MainNav from '@/components/navigation/MainNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Camera, Check, Trash2, User, Crown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PremiumEmailManager from '@/components/Premium/PremiumEmailManager';

const Profile = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  // Mock profile data - would be fetched from database in a real app
  const [profile, setProfile] = useState({
    username: 'brukernavn', // Default placeholder
    displayName: '',
    bio: '',
    avatarUrl: '',
    status: 'online',
    publicProfile: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile(editedProfile);
      toast({
        title: "Profil oppdatert",
        description: "Profilendringene dine har blitt lagret.",
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      publicProfile: checked
    }));
  };
  
  const handleAvatarUpload = () => {
    // Mock implementation - would open a file picker in real app
    toast({
      title: "Bilde-opplasting",
      description: "Funksjon for å laste opp profilbilde er under utvikling.",
    });
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
      <MainNav />
      
      <main className="container max-w-4xl py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-cybergold-400">Min profil</h1>
          <div className="flex items-center gap-2">
            {isPremium && (
              <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900 flex items-center gap-1">
                <Crown className="h-3 w-3" /> Premium
              </Badge>
            )}
            <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
              {user?.email}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-cyberdark-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
              Profildetaljer
            </TabsTrigger>
            {isPremium && (
              <TabsTrigger value="email" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
                Premium E-post
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile picture and basic info */}
              <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-1">
                <CardHeader className="pb-0">
                  <CardTitle className="text-cybergold-400">Profilbilde</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32 border-4 border-cybergold-600">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback className="bg-cyberdark-800 text-cybergold-500 text-4xl">
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 bg-cybergold-600 hover:bg-cybergold-500 text-black rounded-full h-10 w-10"
                        onClick={handleAvatarUpload}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-center w-full">
                    <h2 className="text-xl font-bold text-cybergold-400 mb-1">
                      {isEditing ? (
                        <Input 
                          name="displayName"
                          value={editedProfile.displayName} 
                          onChange={handleInputChange} 
                          placeholder="Visningsnavn"
                          className="bg-cyberdark-800 border-cyberdark-700 text-center"
                        />
                      ) : (
                        profile.displayName || 'Legg til visningsnavn'
                      )}
                    </h2>
                    
                    <p className="text-cybergold-600 mb-3">
                      @{isEditing ? (
                        <Input 
                          name="username"
                          value={editedProfile.username} 
                          onChange={handleInputChange} 
                          placeholder="brukernavn"
                          className="bg-cyberdark-800 border-cyberdark-700 text-center mt-2"
                        />
                      ) : (
                        profile.username
                      )}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className={`h-2 w-2 rounded-full ${
                        profile.status === 'online' ? 'bg-green-500' : 
                        profile.status === 'away' ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`} />
                      <span className="text-sm text-cybergold-500 capitalize">
                        {profile.status}
                      </span>
                    </div>
                    
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      className={isEditing ? 
                        "bg-cybergold-600 hover:bg-cybergold-500 text-black w-full" : 
                        "bg-cyberdark-800 border-cyberdark-700 hover:bg-cyberdark-700 w-full"
                      }
                      onClick={handleEditToggle}
                    >
                      {isEditing ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Lagre endringer
                        </>
                      ) : (
                        'Rediger profil'
                      )}
                    </Button>
                    
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        className="bg-red-900/20 border-red-900/50 hover:bg-red-900/30 text-red-400 mt-2 w-full"
                        onClick={() => {
                          setEditedProfile({...profile});
                          setIsEditing(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Avbryt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Profile details */}
              <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-cybergold-400">Profildetaljer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio section */}
                  <div>
                    <Label htmlFor="bio" className="text-sm text-cybergold-500">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Skriv litt om deg selv..."
                        value={editedProfile.bio}
                        onChange={handleInputChange}
                        className="mt-2 bg-cyberdark-800 border-cyberdark-700 min-h-[120px]"
                      />
                    ) : (
                      <div className="mt-2 p-3 bg-cyberdark-800 rounded-md min-h-[80px]">
                        {profile.bio || <span className="text-cybergold-600 italic">Ingen biografi enda</span>}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="bg-cyberdark-700" />
                  
                  {/* Public profile setting */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-cybergold-400">Offentlig profil</h3>
                      <p className="text-xs text-cybergold-600">Tillat andre å se profilen din</p>
                    </div>
                    {isEditing ? (
                      <Switch 
                        checked={editedProfile.publicProfile}
                        onCheckedChange={handleSwitchChange}
                        className="data-[state=checked]:bg-cybergold-500"
                      />
                    ) : (
                      <Badge 
                        variant="outline" 
                        className={
                          profile.publicProfile ? 
                          "border-green-600 text-green-400" : 
                          "border-red-600 text-red-400"
                        }
                      >
                        {profile.publicProfile ? "Synlig" : "Privat"}
                      </Badge>
                    )}
                  </div>
                  
                  <Separator className="bg-cyberdark-700" />
                  
                  {/* Account info */}
                  <div>
                    <h3 className="text-sm font-medium text-cybergold-400 mb-4">Kontoinformasjon</h3>
                    
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 items-center text-sm">
                        <span className="text-cybergold-600">E-post</span>
                        <span className="col-span-2 text-cybergold-300">{user?.email}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center text-sm">
                        <span className="text-cybergold-600">Medlem siden</span>
                        <span className="col-span-2 text-cybergold-300">Mai 2025</span>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center text-sm">
                        <span className="text-cybergold-600">Abonnement</span>
                        <span className="col-span-2 text-cybergold-300">
                          {isPremium ? (
                            <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900">
                              Premium
                            </Badge>
                          ) : (
                            'Standard'
                          )}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 items-center text-sm">
                        <span className="text-cybergold-600">ID</span>
                        <span className="col-span-2 text-cybergold-300 break-all">
                          {user?.id || 'Ikke tilgjengelig'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Activity stats */}
              <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-cybergold-400">Aktivitet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                      <h3 className="text-cybergold-600 text-sm mb-1">Meldinger</h3>
                      <p className="text-2xl font-bold text-cybergold-400">0</p>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                      <h3 className="text-cybergold-600 text-sm mb-1">Grupper</h3>
                      <p className="text-2xl font-bold text-cybergold-400">0</p>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                      <h3 className="text-cybergold-600 text-sm mb-1">Kontakter</h3>
                      <p className="text-2xl font-bold text-cybergold-400">0</p>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                      <h3 className="text-cybergold-600 text-sm mb-1">Delte filer</h3>
                      <p className="text-2xl font-bold text-cybergold-400">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isPremium && (
            <TabsContent value="email">
              <PremiumEmailManager />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;

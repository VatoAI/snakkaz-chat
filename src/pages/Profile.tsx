import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Camera, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette,
  CloudUpload
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>({
    username: '',
    fullName: '',
    bio: '',
    email: '',
    avatarUrl: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    // Simuler lasting av profildata
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        // I en ekte implementasjon ville vi hente profildataene fra Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProfile({
          username: user.email?.split('@')[0] || 'bruker',
          fullName: 'Snakkaz Bruker',
          bio: 'Dette er en testbruker for Snakkaz Chat-appen. Redigér profilen for å legge til din egen bio!',
          email: user.email,
          avatarUrl: null,
        });
        
        setFormData({
          username: user.email?.split('@')[0] || 'bruker',
          fullName: 'Snakkaz Bruker',
          bio: 'Dette er en testbruker for Snakkaz Chat-appen. Redigér profilen for å legge til din egen bio!',
          email: user.email,
          avatarUrl: null,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Feil ved henting av profil:', error);
        toast({
          variant: 'destructive',
          title: 'Feil ved lasting',
          description: 'Kunne ikke laste profildata',
        });
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Simuler API-kall for å lagre profil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Oppdater profilen lokalt
      setProfile({...formData});
      setIsEditing(false);
      
      toast({
        title: 'Profil oppdatert',
        description: 'Profilendringene dine har blitt lagret.',
      });
    } catch (error) {
      console.error('Feil ved lagring av profil:', error);
      toast({
        variant: 'destructive',
        title: 'Feil ved lagring',
        description: 'Kunne ikke lagre profilendringene dine.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      
      // Simuler opplasting av profilbilde
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // I en ekte implementasjon ville vi lastet opp filen til Supabase Storage
      // og deretter oppdatert brukerens profilbilde-URL
      
      // For demo-formål, lag en midlertidig URL for bildet
      const avatarUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({...prev, avatarUrl}));
      
      toast({
        title: 'Profilbilde lastet opp',
        description: 'Profilbildet ditt har blitt oppdatert.',
      });
    } catch (error) {
      console.error('Feil ved opplasting av profilbilde:', error);
      toast({
        variant: 'destructive',
        title: 'Opplastingsfeil',
        description: 'Kunne ikke laste opp profilbilde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4 bg-cyberdark-950 text-cybergold-200">
      <h1 className="text-3xl font-bold mb-6 text-cybergold-300">Min profil</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 bg-cyberdark-900 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-300">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-300">
            <Lock className="h-4 w-4 mr-2" />
            Sikkerhet
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-300">
            <Bell className="h-4 w-4 mr-2" />
            Varsler
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-cyberdark-800 data-[state=active]:text-cybergold-300">
            <Palette className="h-4 w-4 mr-2" />
            Utseende
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {isLoading ? (
            <Card className="bg-cyberdark-900 border-cyberdark-800">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-full bg-cyberdark-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24 bg-cyberdark-800" />
                    <Skeleton className="h-4 w-40 bg-cyberdark-800" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20 bg-cyberdark-800" />
                  <Skeleton className="h-10 w-full bg-cyberdark-800" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20 bg-cyberdark-800" />
                  <Skeleton className="h-10 w-full bg-cyberdark-800" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20 bg-cyberdark-800" />
                  <Skeleton className="h-24 w-full bg-cyberdark-800" />
                </div>
                <Skeleton className="h-10 w-40 bg-cyberdark-800" />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-cyberdark-900 border-cyberdark-800">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="relative group mb-4 sm:mb-0 sm:mr-6">
                    <Avatar className="h-24 w-24 border-2 border-cybergold-600">
                      {formData.avatarUrl ? (
                        <AvatarImage src={formData.avatarUrl} alt={formData.username} />
                      ) : (
                        <AvatarFallback className="bg-cybergold-900 text-cybergold-200 text-xl">
                          {formData.username?.substring(0, 2).toUpperCase() || 'SB'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <label 
                          htmlFor="avatar-upload" 
                          className="cursor-pointer bg-cybergold-600 text-black p-2 rounded-full hover:bg-cybergold-500"
                        >
                          <Camera className="h-5 w-5" />
                          <input 
                            type="file" 
                            id="avatar-upload"
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleAvatarUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-cybergold-300">{profile.username}</h2>
                    <p className="text-cybergold-500">{profile.email}</p>
                    {!isEditing && <p className="text-sm text-cybergold-400 mt-1">{profile.bio}</p>}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username" className="text-cybergold-300">Brukernavn</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="fullName" className="text-cybergold-300">Fullt navn</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio" className="text-cybergold-300">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 h-24"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                      >
                        {isLoading ? 'Lagrer...' : 'Lagre endringer'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFormData({...profile});
                          setIsEditing(false);
                        }}
                        className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700"
                      >
                        Avbryt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-cybergold-500">Brukernavn</h3>
                      <p className="mt-1 text-cybergold-300">{profile.username}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-cybergold-500">Fullt navn</h3>
                      <p className="mt-1 text-cybergold-300">{profile.fullName}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-cybergold-500">Bio</h3>
                      <p className="mt-1 text-cybergold-300">{profile.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-cybergold-500">E-post</h3>
                      <p className="mt-1 text-cybergold-300">{profile.email}</p>
                    </div>
                    
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="outline"
                      className="border-cybergold-600/40 hover:bg-cyberdark-800 text-cybergold-300"
                    >
                      Redigér profil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-cyberdark-900 border-cyberdark-800">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center text-cybergold-300">
                <Shield className="mr-2 h-5 w-5" />
                Sikkerhetsinnstillinger
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">To-faktor autentisering</h3>
                    <p className="text-sm text-cybergold-500">Sikre kontoen din med en ekstra verifikasjonskode</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-cybergold-300">Endre passord</h3>
                  <Button 
                    variant="outline"
                    className="border-cybergold-600/40 hover:bg-cyberdark-800 text-cybergold-300"
                  >
                    Oppdater passord
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-cybergold-300">Aktive økter</h3>
                  <Card className="bg-cyberdark-800 border-cyberdark-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-cybergold-300">Denne enheten</p>
                          <p className="text-xs text-cybergold-500">Sist aktiv: Nå</p>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-red-400 hover:text-red-300"
                        >
                          Logg ut
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-cyberdark-900 border-cyberdark-800">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center text-cybergold-300">
                <Bell className="mr-2 h-5 w-5" />
                Varslingsinnstillinger
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">Direktemeldinger</h3>
                    <p className="text-sm text-cybergold-500">Få varsler om nye meldinger</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">Gruppemeldinger</h3>
                    <p className="text-sm text-cybergold-500">Få varsler om nye gruppemeldinger</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">Venneforespørsler</h3>
                    <p className="text-sm text-cybergold-500">Få varsler om nye venneforespørsler</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">E-postvarsler</h3>
                    <p className="text-sm text-cybergold-500">Motta viktige varsler på e-post</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="bg-cyberdark-900 border-cyberdark-800">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center text-cybergold-300">
                <Palette className="mr-2 h-5 w-5" />
                Utseendeinnstillinger
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-cybergold-300 mb-2">Tema</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-2 border-cybergold-500 bg-cyberdark-800 p-2 rounded-md cursor-pointer text-center">
                      <div className="h-12 bg-gradient-to-b from-cyberdark-950 to-cyberdark-900 mb-2 rounded"></div>
                      <p className="text-xs text-cybergold-300">Mørk</p>
                    </div>
                    <div className="border border-cyberdark-700 bg-cyberdark-800 p-2 rounded-md cursor-pointer text-center">
                      <div className="h-12 bg-gradient-to-b from-gray-100 to-gray-200 mb-2 rounded"></div>
                      <p className="text-xs text-cybergold-300">Lys</p>
                    </div>
                    <div className="border border-cyberdark-700 bg-cyberdark-800 p-2 rounded-md cursor-pointer text-center">
                      <div className="h-12 bg-gradient-to-b from-blue-900 to-purple-900 mb-2 rounded"></div>
                      <p className="text-xs text-cybergold-300">Neon</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-cybergold-300 mb-2">Tekststørrelse</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700">
                      <span className="text-sm">A</span>
                    </Button>
                    <Button variant="outline" className="border-cybergold-500 bg-cyberdark-700 hover:bg-cyberdark-600">
                      <span className="text-base">A</span>
                    </Button>
                    <Button variant="outline" className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700">
                      <span className="text-lg">A</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-cybergold-300">Animasjoner</h3>
                    <p className="text-sm text-cybergold-500">Aktivér animasjonseffekter</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Key, Lock, LogOut, ShieldCheck, Upload, User } from "lucide-react";
import { PremiumUser } from "@/components/profile/PremiumUser";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";

export default function Profile() {
  const { user, signOut, updateUserProfile } = useAuth();
  const { isPremium, upgradeToPremium } = useGroups();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile({
        name: displayName,
      });

      toast({
        title: "Profil oppdatert",
        description: "Din profilinformasjon har blitt oppdatert.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved oppdatering",
        description: "Kunne ikke oppdatere profilinformasjonen. Prøv igjen senere.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // I en virkelig implementasjon ville dette laste opp bildet til en server
    // og deretter oppdatere brukerens avatar_url
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result.toString());

        toast({
          title: "Profilbilde oppdatert",
          description: "Ditt profilbilde har blitt oppdatert.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-cybergold-400">Min Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <User className="h-5 w-5" /> Brukerinfo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group mb-4">
                <Avatar className="h-24 w-24 border-2 border-cybergold-500/50">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-cyberdark-700 text-cybergold-400 text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <label htmlFor="avatar-upload" className="cursor-pointer p-2 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700">
                    <Upload className="h-5 w-5 text-cybergold-400" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-1">{displayName}</h2>
              <p className="text-sm text-gray-400 mb-4">{user?.email}</p>

              <div className="w-full space-y-2">
                {isPremium && (
                  <div className="flex items-center justify-center p-2 rounded-md bg-cybergold-500/20 text-cybergold-400 text-sm">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Premium-medlem
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full border-cyberdark-600 text-gray-300 hover:bg-cyberdark-800"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logg ut
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium-komponent */}
          <div className="mt-6">
            <PremiumUser isPremium={isPremium} onUpgrade={upgradeToPremium} />
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-cyberdark-800">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Sikkerhet</TabsTrigger>
              <TabsTrigger value="privacy">Personvern</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <Edit className="h-5 w-5" /> Rediger profil
                  </CardTitle>
                  <CardDescription>
                    Oppdater din profilinformasjon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Visningsnavn</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-cyberdark-800 border-cyberdark-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-cyberdark-800 border-cyberdark-600 opacity-70"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="bg-cyberblue-600 hover:bg-cyberblue-500"
                  >
                    Lagre endringer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <Key className="h-5 w-5" /> Sikkerhet
                  </CardTitle>
                  <CardDescription>
                    Administrer passord og sikkerhetsfunksjoner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full border-cyberdark-600 text-gray-300">
                    <Lock className="h-4 w-4 mr-2" /> Endre passord
                  </Button>

                  {isPremium && (
                    <Button variant="outline" className="w-full border-cyberdark-600 text-gray-300">
                      <Eye className="h-4 w-4 mr-2" /> Administrer to-faktor autentisering
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <ShieldCheck className="h-5 w-5" /> Personvern
                  </CardTitle>
                  <CardDescription>
                    Administrer personverninnstillinger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Vis online-status</h3>
                        <p className="text-xs text-gray-400">La andre se når du er pålogget</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="online-status"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Lesebekreftelser</h3>
                        <p className="text-xs text-gray-400">Send og motta lesebekreftelser</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="read-receipts"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Tillat invitasjoner</h3>
                        <p className="text-xs text-gray-400">Tillat andre å invitere deg til grupper</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allow-invites"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-cyberblue-600 hover:bg-cyberblue-500">
                    Lagre innstillinger
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

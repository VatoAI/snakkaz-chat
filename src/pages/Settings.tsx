import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
    const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(true);
    const [language, setLanguage] = useState<string>("no");

    const handleSaveAppearance = () => {
        setLoading(true);

        // Simulerer en API-kall med en timeout
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Innstillinger lagret",
                description: "Dine visningsinnstillinger er nå oppdatert.",
            });
        }, 1000);
    };

    const handleSaveNotifications = () => {
        setLoading(true);

        // Simulerer en API-kall med en timeout
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Innstillinger lagret",
                description: "Dine varslingsinnstillinger er nå oppdatert.",
            });
        }, 1000);
    };

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-cybergold-400">Innstillinger</h1>
                <p className="text-cyberdark-300">Tilpass Snakkaz etter dine behov</p>
            </div>

            <Tabs defaultValue="appearance" className="max-w-3xl">
                <TabsList className="mb-6">
                    <TabsTrigger value="appearance">Utseende</TabsTrigger>
                    <TabsTrigger value="notifications">Varsler</TabsTrigger>
                    <TabsTrigger value="privacy">Personvern</TabsTrigger>
                    <TabsTrigger value="devices">Enheter</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Utseende</CardTitle>
                            <CardDescription>
                                Tilpass hvordan Snakkaz ser ut for deg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="dark-mode">Mørkt tema</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Bruk mørkt tema for mindre belastning på øynene
                                    </p>
                                </div>
                                <Switch
                                    id="dark-mode"
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">Språk</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder="Velg språk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no">Norsk</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="sv">Svenska</SelectItem>
                                        <SelectItem value="da">Dansk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveAppearance} disabled={loading}>
                                {loading ? "Lagrer..." : "Lagre endringer"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Varsler</CardTitle>
                            <CardDescription>
                                Bestem hvordan du vil motta varsler fra Snakkaz
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="notifications">Aktiver varsler</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Få varsler når du mottar nye meldinger
                                    </p>
                                </div>
                                <Switch
                                    id="notifications"
                                    checked={notificationsEnabled}
                                    onCheckedChange={setNotificationsEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="sounds">Varsellyder</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Spill av lyd når du mottar nye meldinger
                                    </p>
                                </div>
                                <Switch
                                    id="sounds"
                                    checked={soundsEnabled}
                                    onCheckedChange={setSoundsEnabled}
                                    disabled={!notificationsEnabled}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveNotifications} disabled={loading}>
                                {loading ? "Lagrer..." : "Lagre endringer"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personvern</CardTitle>
                            <CardDescription>
                                Administrer dine personverninnstillinger
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Les kvittering</Label>
                                    <p className="text-sm text-muted-foreground">
                                        La andre se når du har lest meldingene deres
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Aktiv status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Vis andre når du er pålogget
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="space-y-2">
                                <Label>Databehandling</Label>
                                <Button variant="outline" className="w-full justify-start">
                                    Last ned dine data
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-red-500">
                                    Slett konto og alle data
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-muted-foreground">
                                Din e-post: {user?.email}
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="devices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tilkoblede enheter</CardTitle>
                            <CardDescription>
                                Administrer enheter som er pålogget din konto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-cyberdark-900 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cybergold-500/20 p-2 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cybergold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                                <path d="M12 18h.01" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Denne enheten</p>
                                            <p className="text-xs text-muted-foreground">Chrome • Oslo, Norge</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Aktiv nå
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between bg-cyberdark-900 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyberdark-700 p-2 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyberdark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="16" height="10" x="4" y="7" rx="2" />
                                                <path d="M12 22v-4" />
                                                <path d="M6 22h12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Desktop</p>
                                            <p className="text-xs text-muted-foreground">Firefox • Oslo, Norge</p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm">
                                        Logg ut
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full justify-center text-red-500">
                                Logg ut fra alle enheter
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
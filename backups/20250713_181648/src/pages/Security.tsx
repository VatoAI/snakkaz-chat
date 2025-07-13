import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, RefreshCw, Share2, Shield, ShieldCheck } from "lucide-react";
import { TOTPSetup } from "@/features/auth/two-factor/TOTPSetup";
import { BackupCodeManager } from "@/features/auth/two-factor/BackupCodeManager";
import { useTOTP } from "@/features/auth/hooks/useTOTP";

export default function Security() {
    const { toast } = useToast();
    const { user } = useAuth();
    const { disableTOTP, loading: totpLoading } = useTOTP();
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [showTOTPSetup, setShowTOTPSetup] = useState<boolean>(false);
    const [showBackupCodes, setShowBackupCodes] = useState<boolean>(false);

    const [pin2FA, setPin2FA] = useState<string>("");
    const [pinEnabled, setPinEnabled] = useState<boolean>(false);
    const [bioEnabled, setBioEnabled] = useState<boolean>(false);
    const [backupEnabled, setBackupEnabled] = useState<boolean>(true);

    // Check if user has TOTP enabled
    const totpEnabled = user?.user_metadata?.totp_enabled || false;

    // Simulering av en token for sharing
    const securityToken = "snakkaz-" + Math.random().toString(36).substring(2, 10);

    const handleCopyToken = () => {
        navigator.clipboard.writeText(securityToken);
        setCopied(true);
        toast({
            title: "Kopiert!",
            description: "Sikkerhetstokenet er kopiert til utklippstavlen."
        });

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleEnablePin = () => {
        if (pin2FA.length < 6) {
            toast({
                title: "For kort PIN-kode",
                description: "PIN-koden må være minst 6 tegn.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setPinEnabled(true);
            setLoading(false);
            toast({
                title: "PIN-kode aktivert",
                description: "Din konto er nå beskyttet med PIN-kode."
            });
        }, 1000);
    };

    const handleGenerateQRCode = () => {
        setShowQRCode(true);
    };

    const handleTOTPSetupComplete = (secret: string, backupCodes: string[]) => {
        setShowTOTPSetup(false);
        toast({
            title: "2FA aktivert!",
            description: "To-faktor autentisering er nå aktivert for din konto.",
        });
    };

    const handleTOTPSetupCancel = () => {
        setShowTOTPSetup(false);
    };

    const handleBackupCodesClose = () => {
        setShowBackupCodes(false);
    };

    const handleDisableTOTP = async () => {
        const result = await disableTOTP();
        if (result.success) {
            toast({
                title: "2FA deaktivert",
                description: "To-faktor autentisering er deaktivert.",
            });
        } else {
            toast({
                title: "Feil",
                description: result.error || "Kunne ikke deaktivere 2FA",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-cybergold-400">Sikkerhet</h1>
                <p className="text-cyberdark-300">Administrer sikkerhetsinnstillinger for din konto</p>
            </div>

            <Tabs defaultValue="2fa" className="max-w-3xl">
                <TabsList className="mb-6">
                    <TabsTrigger value="2fa">To-faktor</TabsTrigger>
                    <TabsTrigger value="qrcode">QR-kode</TabsTrigger>
                    <TabsTrigger value="backup">Sikkerhetskopi</TabsTrigger>
                    <TabsTrigger value="access">Tilgangskontroll</TabsTrigger>
                </TabsList>

                <TabsContent value="2fa">
                    {showTOTPSetup ? (
                        <TOTPSetup
                            userId={user?.id || ''}
                            userEmail={user?.email || ''}
                            onSetupComplete={handleTOTPSetupComplete}
                            onCancel={handleTOTPSetupCancel}
                        />
                    ) : showBackupCodes ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Backup-koder for 2FA</h2>
                                <Button 
                                    variant="outline" 
                                    onClick={handleBackupCodesClose}
                                >
                                    Tilbake
                                </Button>
                            </div>
                            <BackupCodeManager />
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {totpEnabled ? (
                                        <>
                                            <ShieldCheck className="h-5 w-5 text-green-500" />
                                            To-faktor autentisering aktivert
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="h-5 w-5 text-yellow-500" />
                                            To-faktor autentisering
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {totpEnabled 
                                        ? "Din konto er beskyttet med to-faktor autentisering"
                                        : "Sikre kontoen din med et ekstra lag beskyttelse"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {totpEnabled ? (
                                    <>
                                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                                <ShieldCheck className="h-4 w-4" />
                                                <span className="font-medium">2FA er aktivert</span>
                                            </div>
                                            <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                                                Din konto er beskyttet med TOTP-basert to-faktor autentisering.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                onClick={handleDisableTOTP}
                                                disabled={totpLoading}
                                            >
                                                {totpLoading ? "Deaktiverer..." : "Deaktiver 2FA"}
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowBackupCodes(true)}>
                                                Vis backup-koder
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                                                <Shield className="h-4 w-4" />
                                                <span className="font-medium">2FA ikke aktivert</span>
                                            </div>
                                            <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                                                Vi anbefaler sterkt å aktivere to-faktor autentisering for økt sikkerhet.
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={() => setShowTOTPSetup(true)}
                                            className="w-full"
                                        >
                                            Aktiver to-faktor autentisering
                                        </Button>
                                    </>
                                )}

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>PIN-basert sikkerhet</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Krev PIN-kode hver gang du logger inn
                                        </p>
                                    </div>
                                    <Switch
                                        checked={pinEnabled}
                                        onCheckedChange={setPinEnabled}
                                    />
                                </div>

                                {!pinEnabled && (
                                    <div className="space-y-2">
                                        <Label htmlFor="pin-code">Lag en PIN-kode</Label>
                                        <Input
                                            id="pin-code"
                                            type="password"
                                            value={pin2FA}
                                            onChange={(e) => setPin2FA(e.target.value)}
                                            placeholder="Minst 6 tegn"
                                            className="max-w-xs"
                                        />
                                        <Button
                                            onClick={handleEnablePin}
                                            disabled={loading || pin2FA.length < 6}
                                        >
                                            {loading ? "Aktiverer..." : "Aktiver PIN"}
                                        </Button>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Biometrisk sikkerhet</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Bruk fingeravtrykk eller ansiktsgjenkjenning
                                        </p>
                                    </div>
                                    <Switch
                                        checked={bioEnabled}
                                        onCheckedChange={setBioEnabled}
                                    />
                                </div>

                                {!bioEnabled && (
                                    <Button variant="outline">
                                        Konfigurer biometrisk sikkerhet
                                    </Button>
                                )}
                            </CardContent>
                            <CardFooter>
                                <p className="text-xs text-muted-foreground">
                                    Sist endret: {new Date().toLocaleDateString()}
                                </p>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="qrcode">
                    <Card>
                        <CardHeader>
                            <CardTitle>QR-kode sikkerhet</CardTitle>
                            <CardDescription>
                                Generer en unik QR-kode for sikker deling av kontaktinformasjon
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-6">
                                {showQRCode ? (
                                    <div className="p-4 bg-white rounded-lg">
                                        <QRCodeSVG
                                            value={`https://snakkaz.com/user/${user?.id}?token=${securityToken}`}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                ) : (
                                    <Button onClick={handleGenerateQRCode} className="mb-4">
                                        Generer QR-kode
                                    </Button>
                                )}

                                <div className="flex flex-col items-center space-y-2 mt-4">
                                    <p className="text-sm text-center max-w-md">
                                        Del denne QR-koden med andre Snakkaz-brukere for å koble til sikkert uten å oppgi kontaktinformasjon.
                                    </p>

                                    <div className="flex items-center space-x-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyToken}
                                            className="flex items-center"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 mr-1" />
                                            ) : (
                                                <Copy className="h-4 w-4 mr-1" />
                                            )}
                                            Kopier token
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center"
                                        >
                                            <Share2 className="h-4 w-4 mr-1" />
                                            Del QR-kode
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Badge variant="outline" className="text-cybergold-500">
                                Gyldig i 24 timer
                            </Badge>

                            <Button variant="ghost" size="sm" className="flex items-center">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Generer ny
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="backup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sikkerhetskopi og gjenoppretting</CardTitle>
                            <CardDescription>
                                Administrer dine krypterte sikkerhetskopier
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Automatisk sikkerhetskopi</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Lagre krypterte sikkerhetskopier av samtaler ukentlig
                                    </p>
                                </div>
                                <Switch
                                    checked={backupEnabled}
                                    onCheckedChange={setBackupEnabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Gjenopprettingsnøkkel</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        value="XXXX-XXXX-XXXX-XXXX"
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button variant="outline" size="sm">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-red-500">
                                    Oppbevar denne nøkkelen trygt! Den kan ikke gjenopprettes hvis du mister den.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button variant="outline">Last ned sikkerhetskopi</Button>
                            </div>
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground">
                            <p>
                                Siste sikkerhetskopi: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="access">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tilgangskontroll</CardTitle>
                            <CardDescription>
                                Administrer hvilke enheter og apper som kan få tilgang til din konto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-cyberdark-900 p-4 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-cybergold-500 text-black">Aktiv</Badge>
                                            <h3 className="font-medium">Web-app</h3>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            Trekk tilbake
                                        </Button>
                                    </div>
                                    <p className="text-xs text-cyberdark-400">
                                        Sist brukt: {new Date().toLocaleDateString()} fra Oslo, Norge
                                    </p>
                                </div>

                                <div className="bg-cyberdark-900 p-4 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-cyberdark-600 text-cyberdark-200">Utløpt</Badge>
                                            <h3 className="font-medium">iOS-app</h3>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Detaljer
                                        </Button>
                                    </div>
                                    <p className="text-xs text-cyberdark-400">
                                        Sist brukt: for 30 dager siden fra Bergen, Norge
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full text-red-500">
                                Logg ut av alle enheter
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
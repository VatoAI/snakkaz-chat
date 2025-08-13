
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, Lock, Shield, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BitcoinPayment } from "../payment/BitcoinPayment";

interface CommunityUserProps {
    isPremium: boolean;
    onUpgrade?: () => Promise<void>;
}

export function CommunityUser({ isPremium, onUpgrade }: CommunityUserProps) {
    const { toast } = useToast();
    const [showPayment, setShowPayment] = useState(false);

    const handleSupportSuccess = async () => {
        toast({
            title: "Fellesskapsstøtte aktivert!",
            description: "Takk for at du støtter vårt fellesskap.",
        });

        setShowPayment(false);

        if (onUpgrade) {
            await onUpgrade();
        }
    };

    const handlePaymentError = (error: string) => {
        toast({
            variant: "destructive",
            title: "Betalingsfeil",
            description: error || "Det oppstod en feil ved betaling. Prøv igjen senere.",
        });
    };

    if (isPremium) {
        return (
            <Card className="border-green-500/30 bg-green-900/20">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-green-400 flex items-center gap-2">
                            <Shield className="h-5 w-5" /> Fellesskapsstøtter
                        </CardTitle>
                        <Badge variant="outline" className="bg-green-500/20 text-green-200 border-green-500/30">
                            Aktiv
                        </Badge>
                    </div>
                    <CardDescription>
                        Du støtter vårt fellesskap og har tilgang til alle funksjoner
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center">
                        <div className="w-32 h-32 relative">
                            <img 
                                src="/snakkaz-logo.png" 
                                alt="SnakkaZ Fellesskap" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Sikre fellesskapgrupper</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Økt sikkerhet med ende-til-ende kryptering</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Ubegrenset meldingshistorikk</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Sikker fildeling opptil 1GB</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Tilgang til Electrum-lommebok</span>
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button 
                        variant="outline" 
                        className="w-full border-green-500/30 text-green-400"
                        onClick={() => window.open('https://electrum.org/', '_blank')}
                    >
                        Åpne Electrum-lommebok
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-green-500/30 bg-green-900/20">
            {showPayment ? (
                <CardContent className="pt-6">
                    <BitcoinPayment
                        amount={99}
                        productType="community_support"
                        onSuccess={handleSupportSuccess}
                        onError={handlePaymentError}
                    />
                    <Button
                        variant="ghost"
                        className="w-full mt-4 text-green-300"
                        onClick={() => setShowPayment(false)}
                    >
                        Avbryt
                    </Button>
                </CardContent>
            ) : (
                <>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-green-400 flex items-center gap-2">
                                <Zap className="h-5 w-5" /> Støtt Felleskapet
                            </CardTitle>
                            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/20">
                                99 kr/mnd
                            </Badge>
                        </div>
                        <CardDescription>
                            Bli en del av vårt fellesskap og få tilgang til alle funksjoner
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-green-400" />
                                <span>Sikre fellesskapgrupper</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                <span>Økt sikkerhet med ende-til-ende kryptering</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-green-400" />
                                <span>Ubegrenset meldingshistorikk</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-green-400" />
                                <span>Tilgang til Electrum-lommebok</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => setShowPayment(true)}
                            className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400"
                        >
                            Støtt nå
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

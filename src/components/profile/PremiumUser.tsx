import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, Lock, Shield, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BitcoinPayment } from "../payment/BitcoinPayment";

interface PremiumUserProps {
    isPremium: boolean;
    onUpgrade?: () => Promise<void>;
}

export function PremiumUser({ isPremium, onUpgrade }: PremiumUserProps) {
    const { toast } = useToast();
    const [showPayment, setShowPayment] = useState(false);

    const handlePaymentSuccess = async () => {
        toast({
            title: "Premium aktivert!",
            description: "Din konto er nå oppgradert til premium.",
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
            <Card className="border-cybergold-500/30 bg-cyberdark-800">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-cybergold-400 flex items-center gap-2">
                            <Crown className="h-5 w-5" /> Premium-medlem
                        </CardTitle>
                        <Badge variant="outline" className="bg-cybergold-500/20 text-cybergold-200 border-cybergold-500/30">
                            Aktiv
                        </Badge>
                    </div>
                    <CardDescription>
                        Du har tilgang til alle premium-funksjoner
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cybergold-400" />
                            <span>Krypterte premium-grupper</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cybergold-400" />
                            <span>Økt sikkerhet med ende-til-ende kryptering</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cybergold-400" />
                            <span>Ubegrenset meldingshistorikk</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cybergold-400" />
                            <span>Sikker fildeling opptil 1GB</span>
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full border-cybergold-500/30 text-cybergold-400">
                        Premium aktiv
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-cyberdark-500/30 bg-cyberdark-900">
            {showPayment ? (
                <CardContent className="pt-6">
                    <BitcoinPayment
                        amount={99}
                        productType="premium_account"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />
                    <Button
                        variant="ghost"
                        className="w-full mt-4 text-cyberdark-300"
                        onClick={() => setShowPayment(false)}
                    >
                        Avbryt
                    </Button>
                </CardContent>
            ) : (
                <>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-cyberblue-400 flex items-center gap-2">
                                <Zap className="h-5 w-5" /> Oppgrader til Premium
                            </CardTitle>
                            <Badge variant="outline" className="bg-cyberblue-500/10 text-cyberblue-300 border-cyberblue-500/20">
                                99 kr/mnd
                            </Badge>
                        </div>
                        <CardDescription>
                            Få tilgang til alle premium-funksjoner
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-cyberblue-400" />
                                <span>Krypterte premium-grupper</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-cyberblue-400" />
                                <span>Økt sikkerhet med ende-til-ende kryptering</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-cyberblue-400" />
                                <span>Ubegrenset meldingshistorikk</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => setShowPayment(true)}
                            className="w-full bg-gradient-to-r from-cyberblue-700 to-cyberblue-500 hover:from-cyberblue-600 hover:to-cyberblue-400"
                        >
                            Oppgrader nå
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
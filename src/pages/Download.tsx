import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Laptop } from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="container py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-cybergold-400 mb-2">
                    Last ned Snakkaz
                </h1>
                <p className="text-lg text-cyberdark-300 max-w-2xl mx-auto">
                    Få tilgang til sikker kryptert kommunikasjon på alle dine enheter
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Mobilapp */}
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-cybergold-400">
                            <Smartphone className="h-5 w-5" />
                            <span>Snakkaz for iOS & Android</span>
                        </CardTitle>
                        <CardDescription>
                            Sikker kommunikasjon og meldinger på farten
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex flex-col justify-center items-center text-center space-y-2">
                            <img
                                src="/icons/snakkaz-icon-192.png"
                                alt="Snakkaz Mobilapp"
                                className="h-16 w-16 object-contain mb-2"
                            />
                            <p className="text-xs text-cyberdark-400">
                                Full ende-til-ende kryptering, støtte for offline-modus, og lavt dataforbruk
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <img src="/apple-logo.svg" alt="Apple App Store" className="h-5 w-5 mr-2" />
                            App Store
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <img src="/google-play.svg" alt="Google Play" className="h-5 w-5 mr-2" />
                            Google Play
                        </Button>
                    </CardFooter>
                </Card>

                {/* Desktop */}
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-cybergold-400">
                            <Laptop className="h-5 w-5" />
                            <span>Snakkaz for Desktop</span>
                        </CardTitle>
                        <CardDescription>
                            Komplett klient for Windows, macOS og Linux
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex flex-col justify-center items-center text-center space-y-2">
                            <img
                                src="/snakkaz-logo.png"
                                alt="Snakkaz Desktop"
                                className="h-16 w-auto object-contain mb-2"
                            />
                            <p className="text-xs text-cyberdark-400">
                                Alle funksjoner, lokalt lagret sikkerhetskopi, og avanserte sikkerhetsfunksjoner
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button variant="default" className="w-full bg-cybergold-600 hover:bg-cybergold-700 text-black">
                            <Download className="mr-2 h-4 w-4" />
                            Last ned for alle plattformer
                        </Button>
                    </CardFooter>
                </Card>

                {/* Web-versjon */}
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-cybergold-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            <span>Snakkaz Web</span>
                        </CardTitle>
                        <CardDescription>
                            Kjør direkte i nettleseren
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex flex-col justify-center items-center text-center space-y-2">
                            <img
                                src="/thumbnails/snakkaz-guardian-chat.png"
                                alt="Snakkaz Web"
                                className="h-16 w-auto object-contain mb-2"
                            />
                            <p className="text-xs text-cyberdark-400">
                                Ingen installasjon nødvendig, fungerer i alle moderne nettlesere med full kryptering
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full" onClick={() => window.location.href = "/"}>
                            Åpne Snakkaz Web
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-12 text-center">
                <h2 className="text-xl font-semibold text-cybergold-500 mb-2">Hvorfor velge Snakkaz?</h2>
                <ul className="max-w-3xl mx-auto grid gap-4 md:grid-cols-3 mt-6">
                    <li className="bg-cyberdark-900/50 p-4 rounded-lg">
                        <h3 className="font-medium text-cybergold-400">Ende-til-ende kryptering</h3>
                        <p className="text-sm text-cyberdark-400 mt-1">Alle meldinger er kryptert på enheten din</p>
                    </li>
                    <li className="bg-cyberdark-900/50 p-4 rounded-lg">
                        <h3 className="font-medium text-cybergold-400">Ingen datalagring</h3>
                        <p className="text-sm text-cyberdark-400 mt-1">Vi lagrer ikke metadata om samtalene dine</p>
                    </li>
                    <li className="bg-cyberdark-900/50 p-4 rounded-lg">
                        <h3 className="font-medium text-cybergold-400">Åpen kildekode</h3>
                        <p className="text-sm text-cyberdark-400 mt-1">Full åpenhet om hvordan appen fungerer</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
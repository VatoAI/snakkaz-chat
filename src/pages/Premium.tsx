import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Home, Zap, Crown, Shield, Lock, Gift, Star, Check, 
  MessageSquare, Tag, RefreshCw, Clock, Download, Sparkles, CreditCard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PremiumPage = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  
  return (
    <div className="min-h-screen bg-cyberdark-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="mr-2" size={20} /> Tilbake
          </Button>
          <h1 
            className="text-3xl font-bold"
            style={{
              background: 'linear-gradient(90deg, #ffd700 0%, #ffffff 50%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '-3px 0 10px rgba(255,215,0,0.5), 3px 0 10px rgba(255,215,0,0.5)',
            }}
          >
            SnakkaZ Premium
          </h1>
          
          <Button 
            variant="outline"
            className="ml-auto border-cybergold-500/70 text-cybergold-400 hover:bg-cybergold-900/50"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2" size={18} />
            Hjem
          </Button>
        </div>        {/* Premium Hero Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className="p-8 rounded-xl mb-8 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/95 backdrop-blur-sm"
            style={{
              borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4) 1',
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(59, 130, 246, 0.15)',
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <Crown className="text-blue-400 mr-3" size={32} />
              <h2 
                className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                Utvidet Plan
              </h2>
            </div>
            
            <p className="mb-6 text-lg text-slate-300 leading-relaxed text-center max-w-2xl mx-auto">
              Få tilgang til alle avanserte funksjoner, ubegrenset lagringskapasitet og 
              enda bedre sikkerhet med vår utvidede plan. Designet for de som ønsker 
              maksimal ytelse og fleksibilitet.
            </p>

            {isPremium ? (
              <div className="mb-8 p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/50 text-center">
                <Check className="inline-block text-emerald-400 mb-2" size={24} />
                <p className="text-emerald-300 font-medium">
                  Du har allerede utvidet tilgang! Nyt alle våre eksklusive funksjoner.
                </p>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-10 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => navigate("/settings?tab=subscription")}
                >
                  <Crown className="mr-2" size={18} />
                  Få Utvidet Tilgang
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <Shield className="text-blue-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-blue-300">Utvidet sikkerhet</h3>
                <p className="text-slate-400">
                  Ytterligere sikkerhetslag, avansert E2EE med forlenget nøkkellengde og biometrisk autentisering.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <Zap className="text-purple-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Ubegrenset lagring</h3>
                <p className="text-slate-400">
                  Ingen lagringsgrenser for meldinger, medier eller filer. Behold alle dine samtaler så lenge du ønsker.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <Sparkles className="text-cyan-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">Eksklusive funksjoner</h3>
                <p className="text-slate-400">
                  Tidlig tilgang til nye funksjoner, tilpassede temaer og utvidede integrasjonsmuligheter.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Premium Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-8 border border-indigo-500/20">
            <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-300">
              Hvorfor velge SnakkaZ Premium?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                  <Lock className="mr-2" size={20} />
                  Maksimal sikkerhet
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>End-to-end kryptering med 256-bit AES</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Biometrisk autentisering for ekstra sikkerhet</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Avansert nøkkelrotasjon hver 30. dag</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                  <Sparkles className="mr-2" size={20} />
                  Eksklusiv opplevelse
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Ubegrenset lagring av meldinger og medier</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Prioritert kundestøtte innen 2 timer</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Tidlig tilgang til nye funksjoner</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-emerald-500/30">
              <div className="flex items-center justify-center mb-2">
                <Gift className="text-emerald-400 mr-2" size={20} />
                <span className="text-emerald-300 font-semibold">Spesialtilbud!</span>
              </div>
              <p className="text-slate-300 text-center">
                De første 1000 brukerne får <strong className="text-emerald-400">50% rabatt</strong> på årlige abonnement. 
                Ikke gå glipp av denne muligheten!
              </p>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-cybergold-300">
            Alle Avanserte Funksjoner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Lock className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Avansert kryptering
                </h3>
                <p className="text-gray-400">
                  Oppgraderte nøkkellengder, flere krypteringslag og avansert nøkkelrotasjon for maksimal sikkerhet.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Clock className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Selvdestruerende meldinger
                </h3>
                <p className="text-gray-400">
                  Sett utløpstid på meldinger og medier, fra sekunder til dager, med bekreftelse på sletting.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <MessageSquare className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Ubegrenset meldingshistorikk
                </h3>
                <p className="text-gray-400">
                  Ingen begrensninger på antall lagrede meldinger eller søkehistorikk. Full tilgang til alle tidligere samtaler.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Star className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Prioritert support
                </h3>
                <p className="text-gray-400">
                  Få raskere hjelp med dedikert premium-support og direkte tilgang til vårt supportteam.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <RefreshCw className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Multienhet-synkronisering
                </h3>
                <p className="text-gray-400">
                  Synkroniser historikk og innstillinger sømløst mellom opptil 10 enheter med samme sikkerhetsnivå.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Download className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Offline-tilgang
                </h3>
                <p className="text-gray-400">
                  Full tilgang til alle tidligere samtaler og filer, selv når du er offline eller har dårlig tilkobling.
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Gift className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Premium tilpasninger
                </h3>
                <p className="text-gray-400">
                  Eksklusivt utvalg av temaer, stiler, emoji-pakker og tilpassede lyder kun for Premium-brukere.
                </p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="flex p-5 rounded-lg bg-cyberdark-900/70">
              <div className="mr-4 mt-1">
                <Tag className="text-cybergold-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                  Premium-merke
                </h3>
                <p className="text-gray-400">
                  Vis frem din Premium-status med et eksklusivt merke på profilen og i gruppesamtaler.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center text-cybergold-300">
            Velg din plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Plan */}
            <div className="p-6 rounded-lg bg-cyberdark-900/70 border border-cybergold-800/30 hover:border-cybergold-500/30 transition-all flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-cybergold-200 text-center">Månedlig</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-cybergold-400">99 kr</span>
                <span className="text-gray-400">/måned</span>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Alle Premium-funksjoner</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Avbryt når som helst</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Prioritert support</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cybergold-800/50 hover:bg-cybergold-700/50 text-cybergold-300 border border-cybergold-600/50"
                onClick={() => navigate("/settings?tab=subscription&plan=monthly")}
              >
                <CreditCard className="mr-2" size={16} />
                Velg plan
              </Button>
            </div>

            {/* Annual Plan */}
            <div className="p-6 rounded-lg bg-cybergold-900/20 border-2 border-cybergold-500/50 hover:border-cybergold-400 transition-all flex flex-col relative">
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-cybergold-500 text-black text-xs font-bold uppercase px-3 py-1 rounded-full">
                Populær
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cybergold-200 text-center">Årlig</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-cybergold-300">799 kr</span>
                <span className="text-gray-400">/år</span>
                <div className="text-cybergold-400 text-sm font-semibold">Spar 33%</div>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Alle Premium-funksjoner</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">2 måneder <strong>gratis</strong></span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Prioritert support</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Eksklusiv Premium-merke</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-cybergold-600 to-cybergold-500 hover:from-cybergold-500 hover:to-cybergold-400 text-black font-semibold"
                onClick={() => navigate("/settings?tab=subscription&plan=annual")}
              >
                <Crown className="mr-2" size={16} />
                Velg plan
              </Button>
            </div>

            {/* Lifetime Plan */}
            <div className="p-6 rounded-lg bg-cyberdark-900/70 border border-cybergold-800/30 hover:border-cybergold-500/30 transition-all flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-cybergold-200 text-center">Livstid</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-cybergold-400">4999 kr</span>
                <span className="text-gray-400">/engangskjøp</span>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Alle Premium-funksjoner for alltid</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Ingen abonnement</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">VIP prioritert support</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-cybergold-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Alle fremtidige oppdateringer</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-cybergold-800/50 hover:bg-cybergold-700/50 text-cybergold-300 border border-cybergold-600/50"
                onClick={() => navigate("/settings?tab=subscription&plan=lifetime")}
              >
                <Star className="mr-2" size={16} />
                Velg plan
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Alle priser inkluderer MVA. Du kan når som helst kansellere abonnementet ditt.
            <br />Ved å abonnere godtar du våre <a href="/terms" className="text-cybergold-400 hover:underline">vilkår og betingelser</a>.
          </div>
        </div>

        {/* Premium FAQ */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-cybergold-300">
            Ofte stilte spørsmål
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-lg bg-cyberdark-900/70">
              <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                Hvordan fungerer SnakkaZ Premium?
              </h3>
              <p className="text-gray-400">
                SnakkaZ Premium er et abonnement som gir deg tilgang til alle avanserte funksjoner, ubegrenset lagring og økt sikkerhet. Når du oppgraderer, får du umiddelbar tilgang til alle Premium-funksjoner på alle dine enheter.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-cyberdark-900/70">
              <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                Kan jeg bytte plan senere?
              </h3>
              <p className="text-gray-400">
                Ja, du kan enkelt oppgradere, nedgradere eller kansellere abonnementet ditt når som helst via innstillingene. Hvis du oppgraderer, vil beløpet bli justert forholdsmessig for den gjenværende perioden.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-cyberdark-900/70">
              <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                Er betalingen sikker?
              </h3>
              <p className="text-gray-400">
                Absolutt. Vi bruker bransjens beste krypterte betalingsløsninger og lagrer aldri dine betalingsdetaljer på våre servere. Alle transaksjoner er fullt krypterte og sikre.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-cyberdark-900/70">
              <h3 className="font-semibold text-lg text-cybergold-200 mb-2">
                Hva hvis jeg ikke er fornøyd?
              </h3>
              <p className="text-gray-400">
                Vi tilbyr 14 dagers pengene-tilbake-garanti på alle abonnement. Hvis du ikke er 100% fornøyd, kan du kontakte vår kundeservice for full refusjon, ingen spørsmål stilt.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">
            Klar til å oppgradere din kommunikasjon?
          </h2>
          <p className="text-slate-400 mb-6">
            Bli med tusenvis av brukere som allerede nyter fordelene med SnakkaZ Premium.
            Med vårt enkle oppsett kan du komme i gang på under ett minutt.
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-12 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate("/settings?tab=subscription")}
          >
            <Crown className="mr-2" size={18} />
            Oppgrader til Premium
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default PremiumPage;

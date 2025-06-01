import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Home, Zap, Crown, Shield, Lock, Gift, Star, Check, 
  MessageSquare, Tag, RefreshCw, Clock, Download, Sparkles, CreditCard,
  Users, Heart, UserPlus
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
              background: 'linear-gradient(90deg, #4ade80 0%, #ffffff 50%, #4ade80 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '-3px 0 10px rgba(74,222,128,0.5), 3px 0 10px rgba(74,222,128,0.5)',
            }}
          >
            SnakkaZ Fellesskap
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
              <MessageSquare className="text-green-400 mr-3" size={32} />
              <h2 
                className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                Fellesskapet
              </h2>
            </div>
            
            <p className="mb-6 text-lg text-slate-300 leading-relaxed text-center max-w-2xl mx-auto">
              Oppdag alle de fantastiske funksjonene som gjør SnakkaZ til et trygt og 
              inkluderende sted for alle. Sammen bygger vi et fellesskap der alle får 
              en stemme og mulighet til å uttrykke seg fritt.
            </p>

            {isPremium ? (
              <div className="mb-8 p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/50 text-center">
                <Check className="inline-block text-emerald-400 mb-2" size={24} />
                <p className="text-emerald-300 font-medium">
                  Takk for at du støtter fellesskapet! Du har tilgang til alle funksjoner.
                </p>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <Button 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 px-10 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => navigate("/info")}
                >
                  <Star className="mr-2" size={18} />
                  Utforsk Fellesskapet
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <Shield className="text-blue-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-blue-300">Sikker kommunikasjon</h3>
                <p className="text-slate-400">
                  Ende-til-ende kryptering som standard for alle samtaler. Din privatliv er vår prioritet.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <MessageSquare className="text-green-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-green-300">Åpen kommunikasjon</h3>
                <p className="text-slate-400">
                  Ingen censur eller algoritmer som bestemmer hva du ser. Ekte samtaler mellom ekte mennesker.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105">
                <Star className="text-cyan-400 mb-3" size={36} />
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">Inkluderende fellesskap</h3>
                <p className="text-slate-400">
                  Alle er velkommen. Vi bygger et fellesskap der respekt og åpenhet står i sentrum.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Values Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-xl p-8 border border-green-500/20">
            <h2 className="text-2xl font-semibold mb-6 text-center text-green-300">
              Hva gjør SnakkaZ spesielt?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                  <Lock className="mr-2" size={20} />
                  Sikkerhet for alle
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>End-to-end kryptering som standard for alle</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Ingen datamining eller reklamer</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Dine data forblir dine</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Ekte fellesskap
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Fokus på menneskelige forbindelser</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Støttende og inkluderende miljø</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>Alle stemmer er verdsatt</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-emerald-500/30">
              <div className="flex items-center justify-center mb-2">
                <Heart className="text-emerald-400 mr-2" size={20} />
                <span className="text-emerald-300 font-semibold">Sammen bygger vi noe bedre!</span>
              </div>
              <p className="text-slate-300 text-center">
                SnakkaZ handler om å skape <strong className="text-emerald-400">ekte forbindelser</strong> mellom mennesker. 
                Bli med i et fellesskap som verdsetter respekt, åpenhet og autentisitet.
              </p>
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-green-300">
            Funksjoner som bygger fellesskapet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Lock className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-green-200 mb-2">
                  Sikker kommunikasjon
                </h3>
                <p className="text-gray-400">
                  Ende-til-ende kryptering beskytter alle samtaler og gir deg trygghet for å dele det som betyr noe.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Users className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-200 mb-2">
                  Gruppechat og kanaler
                </h3>
                <p className="text-gray-400">
                  Opprett og bli med i grupper basert på interesser, hobbyer eller felles verdier. Finn din tribe.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <MessageSquare className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-purple-200 mb-2">
                  Direkte meldinger
                </h3>
                <p className="text-gray-400">
                  Bygg dypere vennskap med private samtaler som respekterer din personvern og autonomi.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Heart className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-cyan-200 mb-2">
                  Støttende miljø
                </h3>
                <p className="text-gray-400">
                  Modererte fellesskap som fremmer respekt og konstruktiv dialog mellom alle medlemmer.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <UserPlus className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-orange-200 mb-2">
                  Inviter venner
                </h3>
                <p className="text-gray-400">
                  Bygg ditt nettverk ved å invitere venner og familie til å bli med i fellesskapet.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Shield className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-emerald-200 mb-2">
                  Personvern først
                </h3>
                <p className="text-gray-400">
                  Ingen sporing, ingen reklamer, ingen datamining. Dine samtaler forblir private.
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Sparkles className="text-pink-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-pink-200 mb-2">
                  Tilpasningsbar opplevelse
                </h3>
                <p className="text-gray-400">
                  Gjør appen din ved å tilpasse temaer og innstillinger til din personlige stil.
                </p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="flex p-5 rounded-lg bg-slate-800/50 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300">
              <div className="mr-4 mt-1">
                <Star className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-indigo-200 mb-2">
                  Fellesskapsmerke
                </h3>
                <p className="text-gray-400">
                  Vis din støtte til plattformen med et diskret merke som viser at du bidrar til fellesskapet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center text-green-300">
            Støtt fellesskapet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Support */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-green-500/20 hover:border-green-400/40 transition-all flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-green-200 text-center">Månedlig støtte</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-green-400">99 kr</span>
                <span className="text-gray-400">/måned</span>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Støtt plattformens utvikling</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Bidra til fellesskapets vekst</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-green-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Prioritert brukerstøtte</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-green-600/20 hover:bg-green-500/30 text-green-300 border border-green-500/50"
                onClick={() => navigate("/info")}
              >
                <Heart className="mr-2" size={16} />
                Støtt månedlig
              </Button>
            </div>

            {/* Annual Support */}
            <div className="p-6 rounded-lg bg-green-900/20 border-2 border-green-500/50 hover:border-green-400 transition-all flex flex-col relative">
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-green-500 text-black text-xs font-bold uppercase px-3 py-1 rounded-full">
                Populær
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-200 text-center">Årlig støtte</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-green-300">799 kr</span>
                <span className="text-gray-400">/år</span>
                <div className="text-green-400 text-sm font-semibold">Spar 33%</div>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-green-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Betydelig bidrag til fellesskapet</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-green-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">2 måneder <strong>ekstra støtte</strong></span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-green-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Raskere brukerstøtte</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-green-300 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Supporter-merke</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-semibold"
                onClick={() => navigate("/info")}
              >
                <Star className="mr-2" size={16} />
                Støtt årlig
              </Button>
            </div>

            {/* One-time Support */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-blue-500/20 hover:border-blue-400/40 transition-all flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-blue-200 text-center">Engangsdonasjon</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-blue-400">Valgfritt</span>
                <span className="text-gray-400"> beløp</span>
              </div>
              <ul className="mb-6 flex-grow">
                <li className="flex items-start mb-3">
                  <Check className="text-blue-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Støtt når du ønsker det</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-blue-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Ingen forpliktelser</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-blue-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Bidra til fellesskapets fremtid</span>
                </li>
                <li className="flex items-start mb-3">
                  <Check className="text-blue-400 mr-2 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-300">Takk fra hele fellesskapet</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50"
                onClick={() => navigate("/info")}
              >
                <Gift className="mr-2" size={16} />
                Gi en donasjon
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            All støtte hjelper oss med å opprettholde en trygg og inkluderende plattform for alle.
            <br />Ved å støtte godtar du våre <a href="/terms" className="text-green-400 hover:underline">vilkår og betingelser</a>.
          </div>
        </div>

        {/* Community FAQ */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-green-300">
            Ofte stilte spørsmål
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-lg bg-slate-800/50 border border-green-500/20">
              <h3 className="font-semibold text-lg text-green-200 mb-2">
                Hvorfor støtte SnakkaZ fellesskapet?
              </h3>
              <p className="text-gray-400">
                Din støtte hjelper oss med å opprettholde en sikker, reklamefri plattform som respekterer ditt personvern. Alle bidrag går til utvikling av nye funksjoner og vedlikehold av tjenesten.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-800/50 border border-blue-500/20">
              <h3 className="font-semibold text-lg text-blue-200 mb-2">
                Er SnakkaZ gratis å bruke?
              </h3>
              <p className="text-gray-400">
                Ja! SnakkaZ er gratis for alle. Støtteordningen er frivillig og hjelper oss med å forbedre plattformen for alle brukere. Du får tilgang til alle kjernefunksjonene uten betaling.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-800/50 border border-purple-500/20">
              <h3 className="font-semibold text-lg text-purple-200 mb-2">
                Er mine betalingsopplysninger sikre?
              </h3>
              <p className="text-gray-400">
                Absolutt. Vi bruker bransjens beste krypterte betalingsløsninger og lagrer aldri dine betalingsdetaljer på våre servere. Alle transaksjoner er fullt krypterte og sikre.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-800/50 border border-cyan-500/20">
              <h3 className="font-semibold text-lg text-cyan-200 mb-2">
                Kan jeg avslutte støtten min?
              </h3>
              <p className="text-gray-400">
                Selvfølgelig! Du kan når som helst avslutte din støtte, og du vil fortsatt ha full tilgang til alle funksjoner. Vi setter stor pris på enhver støtte, uansett hvor lenge den varer.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            Bli med i SnakkaZ fellesskapet i dag!
          </h2>
          <p className="text-slate-400 mb-6">
            Opplev sikker, privat kommunikasjon uten reklamer eller sporing. 
            Bli med tusenvis som har funnet sitt digitale hjem hos oss.
          </p>
          <Button 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 px-12 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate("/info")}
          >
            <Users className="mr-2" size={18} />
            Utforsk fellesskapet
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default PremiumPage;

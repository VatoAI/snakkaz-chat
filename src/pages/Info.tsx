import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare, Shield, Lock, Globe, Home, Zap, Crown, Clock, RefreshCw, Users, Star, Tag, Gift, InfoIcon, HelpCircle, Mail, Heart, Check } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const InfoPage = () => {
  const navigate = useNavigate();
  
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
              background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '-3px 0 10px rgba(26,157,255,0.5), 3px 0 10px rgba(214,40,40,0.5)',
            }}
          >
            Om SnakkaZ
          </h1>
          
          <Button 
            variant="outline"
            className="ml-auto border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/50"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2" size={18} />
            Hjem
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #1a9dff, #d62828) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Kommunikasjon på dine premisser
            </h2>
            
            <p className="mb-6 text-lg text-gray-300 leading-relaxed">
              SnakkaZ er neste generasjons kommunikasjonsplattform som kombinerer det beste av hastighet,
              sikkerhet og brukervennlighet. Vi har bygget en løsning der <span className="text-cyberblue-300 font-medium">DU</span> har full kontroll 
              over dine data og samtaler, samtidig som du får en moderne og intuitiv brukeropplevelse.
            </p>
            
            <p className="mb-8 text-lg text-gray-300 leading-relaxed">
              I en verden full av overvåkning og datalekkasjer, står SnakkaZ som en trygg havn for 
              alle dine samtaler - enten de er private, i grupper eller profesjonelle. Vår unike 
              kombinasjon av avansert teknologi og enkel bruk gjør oss til det beste valget for 
              alle som verdsetter privatliv uten å ofre funksjonalitet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-cyberdark-950/50">
                <Shield className="text-cyberblue-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-cyberblue-300">Sikkerhet først</h3>
                <p className="text-gray-400">
                  Militærgrads ende-til-ende kryptering beskytter alle dine samtaler og data. 
                  Bare du og mottakeren har nøklene.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-cyberdark-950/50">
                <Zap className="text-green-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-green-300">Overlegen ytelse</h3>
                <p className="text-gray-400">
                  Lynrask meldingsutveksling med minimal forsinkelse selv på svake 
                  nettverksforbindelser. Alltid responsiv og pålitelig.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-cyberdark-950/50">
                <Lock className="text-red-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-red-300">Personvern</h3>
                <p className="text-gray-400">
                  Vi samler bare inn det absolutte minimum av data.
                  Ingen annonsesporing, ingen datadeling med tredjeparter.
                </p>
              </div>
            </div>
          </div>

          {/* Ny seksjon om abonnementer */}
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #ffb300, #ff6b00) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #ffb300, #ffffff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Premium abonnement
            </h2>
            
            <p className="mb-6 text-gray-300">
              Oppgrader til SnakkaZ Premium for en rikere kommunikasjonsopplevelse med eksklusive funksjoner 
              og forbedret sikkerhet. Premium-brukere med @snakkaz.com adresser får ekstra fordeler!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-amber-900/30 to-cyberdark-900/80 border border-amber-600/30">
                <div className="flex items-center mb-3">
                  <Tag className="text-amber-400 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-amber-300">Basis</h3>
                </div>
                <p className="text-gray-400 mb-2 text-sm flex-grow">
                  Perfekt for enkeltbrukere som ønsker ekstra sikkerhet.
                </p>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-amber-400 rounded-full mr-2"></div>
                    Utvidet fillagring (2GB)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-amber-400 rounded-full mr-2"></div>
                    Grunnleggende selvdestruerende meldinger
                  </li>
                </ul>
                <p className="text-amber-400 font-bold mt-auto">99 kr/mnd</p>
              </div>
              
              <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-blue-900/30 to-cyberdark-900/80 border border-blue-600/30 relative">
                <div className="absolute -top-3 -right-3 bg-blue-500 text-black text-xs font-bold py-1 px-2 rounded">
                  MEST POPULÆR
                </div>
                <div className="flex items-center mb-3">
                  <Star className="text-blue-400 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-blue-300">Pro</h3>
                </div>
                <p className="text-gray-400 mb-2 text-sm flex-grow">
                  Ideell for aktive brukere og mindre grupper.
                </p>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    Premium bruker (@snakkaz.com email konto)
                    <HelpCircle className="h-3.5 w-3.5 text-blue-400 ml-1.5 cursor-help" 
                      onClick={() => {
                        window.alert("Få din egen profesjonelle @snakkaz.com emailadresse med fullstendig kryptering og premium støtte. Bruk den på alle enheter og epost-klienter.");
                      }}
                    />
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    10GB fillagring
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    Avanserte selvdestruerende meldinger
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    Premium grupper (opptil 50 medlemmer)
                  </li>
                </ul>
                <p className="text-blue-400 font-bold mt-auto">199 kr/mnd</p>
              </div>
              
              <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-purple-900/30 to-cyberdark-900/80 border border-purple-600/30">
                <div className="flex items-center mb-3">
                  <Gift className="text-purple-400 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-purple-300">Business</h3>
                </div>
                <p className="text-gray-400 mb-2 text-sm flex-grow">
                  Perfekt for profesjonelle team og organisasjoner.
                </p>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    Dedikert domeneintegrering
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    Ubegrenset fillagring
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    Dedikert kundesupport
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    Enterprise-nivå sikkerhet
                  </li>
                </ul>
                <p className="text-purple-400 font-bold mt-auto">Kontakt salg</p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/subscription')}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black"
            >
              <Crown className="mr-2" size={18} /> Oppgrader nå
            </Button>
          </div>

          {/* Premium Email Feature Section */}
          <div className="mt-12 pt-8 border-t border-cyberdark-800">              <h2 className="text-2xl font-semibold mb-6 text-center">
              <Mail className="inline-block mr-2 mb-1" size={24} />
              Premium @snakkaz.com Email
            </h2>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-cyberdark-900 border border-blue-700/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium text-blue-300 mb-3">Profesjonell kommunikasjon med din egen @snakkaz.com adresse</h3>
              
              <p className="text-gray-300 mb-6">
                Som en del av vårt Pro-abonnement får du tilgang til din egen profesjonelle @snakkaz.com 
                e-postadresse. Dette gir deg ikke bare et profesjonelt image, men også avanserte sikkerhetsfunksjoner 
                og sømløs integrering med Snakkaz-plattformen.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-cyberdark-800/60 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <Shield className="mr-2" size={18} />
                    Sikkerhet og beskyttelse
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Fullstendig ende-til-ende kryptering</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Avansert spam- og phishing-beskyttelse</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Automatisk sikkerhetsskanning av vedlegg</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-cyberdark-800/60 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <Crown className="mr-2" size={18} />
                    Premium funksjoner
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Tilgang fra alle enheter og e-postklienter</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Ubegrenset antall filtagger og organisering</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-blue-400 mr-2 mt-0.5" size={16} />
                      <span>Automatisk synkronisering med Snakkaz-kontakter</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
                <h4 className="text-blue-300 font-medium mb-2">Slik kommer du i gang:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm ml-2">
                  <li>Kjøp Pro-abonnement</li>
                  <li>Gå til "Premium Innstillinger" i profilen din</li>
                  <li>Velg "E-post Administrasjon"</li>
                  <li>Opprett din egen @snakkaz.com adresse</li>
                  <li>Sett opp e-postklienten din med våre detaljerte instruksjoner</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Hurtigfordeler seksjon */}
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #ff9500, #ff5252) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #ff9500, #ff5252)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Snakkaz på et blunk
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-cyberdark-950/70 p-4 rounded-lg border border-orange-500/20">
                <div className="flex items-center mb-3">
                  <div className="bg-orange-500/20 p-2 rounded-full mr-3">
                    <Zap size={18} className="text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-orange-300">Raskere enn konkurrentene</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Tester viser at Snakkaz leverer meldinger i gjennomsnitt 1.7 sekunder raskere enn de største 
                  konkurrentene, selv under høy belastning.
                </p>
              </div>
              
              <div className="bg-cyberdark-950/70 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center mb-3">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <Lock size={18} className="text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-300">Bedre sikkerhet</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  256-bits ende-til-ende kryptering på alle meldinger og filer. Ingen nøkler lagres på våre servere, 
                  kun på din enhet.
                </p>
              </div>
              
              <div className="bg-cyberdark-950/70 p-4 rounded-lg border border-blue-500/20">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                    <MessageSquare size={18} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">Enklere å bruke</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  94% av brukerne våre rapporterer at Snakkaz er mer intuitiv å bruke enn andre meldingstjenester 
                  de har prøvd tidligere.
                </p>
              </div>
              
              <div className="bg-cyberdark-950/70 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                    <Heart size={18} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-300">Høyere tilfredshet</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Snakkaz har oppnådd en brukertilfredshetsscore på 4.8/5.0, basert på over 5000 anmeldelser 
                  fra våre aktive brukere.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Prøv Snakkaz Chat i dag og opplev forskjellen selv. Ingen forpliktelser, ingen skjulte kostnader.
              </p>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              >
                Start gratis nå
              </Button>
            </div>
          </div>
          
          {/* Nye forbedringer seksjon */}
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #4caf50, #2196f3) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #4caf50, #ffffff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Nye forbedringer (Mai 2025)
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-green-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Zap className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-green-300">Optimalisert ytelse</h3>
                  <p className="text-gray-400">
                    Vi har gjennomført omfattende ytelsesoptimaliseringer i databasen som gir betydelig raskere responstider, 
                    spesielt for grupper med mange meldinger og brukere.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-amber-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Crown className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-amber-300">Premium funksjoner</h3>
                  <p className="text-gray-400">
                    Nye premium-grupperom med avansert kryptering, utvidede tillatelser for administratorer og skreddersydde innstillinger.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Clock className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-purple-300">Tidsbegrensede meldinger</h3>
                  <p className="text-gray-400">
                    Angi hvor lenge meldingene dine skal eksistere før de slettes automatisk, fra 5 minutter til 7 dager.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <RefreshCw className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-blue-300">Kontinuerlig synkronisering</h3>
                  <p className="text-gray-400">
                    Forbedret synkronisering mellom enheter sikrer at du alltid har de mest oppdaterte meldingene, uavhengig av hvor du logger inn.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-cyan-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Users className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-cyan-300">Erweiterte Gruppe</h3>
                  <p className="text-gray-400">
                    Nye gruppefunksjoner inkludert rollebaserte tillatelser, deling av dokumenter og felles kalender for bedre samarbeid.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #d62828, #1a9dff) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #d62828, #ffffff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Hvorfor velge oss?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-red-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Zap className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-red-300">Lynrask</h3>
                  <p className="text-gray-400">
                    Opplev øyeblikkelig meldingsutveksling med vår optimaliserte plattform som leverer 
                    meldinger på millisekunder. Vår innovative teknologi sikrer minimal forsinkelse selv 
                    ved dårlig nettverksforbindelse.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-green-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <MessageSquare className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-green-300">Brukervennlig</h3>
                  <p className="text-gray-400">
                    Vår intuitive design gjør det enkelt å navigere og kommunisere. Enten du er teknisk 
                    erfaren eller nybegynner, så vil du umiddelbart føle deg hjemme med SnakkaZ Chat sin
                    elegante og enkle brukergrensesnitt.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-blue-300">Sikker</h3>
                  <p className="text-gray-400">
                    Våre avanserte ende-til-ende krypteringsalgoritmer sikrer at alle samtaler forblir 100% private. 
                    Selvdestruerende meldinger og strikte adgangskontroller gir deg fullstendig kontroll over hvem
                    som kan se innholdet ditt og hvor lenge.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-amber-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Users className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-amber-300">Systematisk</h3>
                  <p className="text-gray-400">
                    Hold alle samtaler organisert med vårt smarte kategoriseringssystem. Avansert søk, 
                    filtrering og gruppeadministrasjon gjør det enkelt å finne nøyaktig det du leter etter,
                    selv i store gruppechatter med hundrevis av meldinger.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Crown className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-purple-300">Lønnsomt</h3>
                  <p className="text-gray-400">
                    Med vår fleksible abonnementsmodell betaler du kun for det du faktisk trenger. 
                    Vårt gratisalternativ gir allerede mye verdi, mens premium-funksjoner tilbyr 
                    avanserte muligheter for profesjonelle brukere til en brøkdel av kostnaden 
                    sammenlignet med konkurrentene.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-cyberblue-500/20 to-cyberdark-900 p-3 rounded-full mr-4">
                  <Globe className="text-cyberblue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-cyberblue-300">Global Tilgjengelighet</h3>
                  <p className="text-gray-400">
                    Koble til fra hvor som helst i verden med vår robuste infrastruktur og høyhastighets servere 
                    som sikrer at meldingene dine leveres umiddelbart, uansett hvor du befinner deg.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sammenligning med konkurrenter */}
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #8e2de2, #4a00e0) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(90deg, #8e2de2, #4a00e0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Hvorfor Snakkaz utkonkurrerer alternativene
            </h2>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="px-4 py-3 text-left text-purple-300">Funksjon</th>
                    <th className="px-4 py-3 text-center text-purple-300">Snakkaz</th>
                    <th className="px-4 py-3 text-center text-gray-400">Andre tjenester</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-500/10">
                    <td className="px-4 py-3 text-gray-300">Ende-til-ende kryptering</td>
                    <td className="px-4 py-3 text-center text-green-400">Standard på alle samtaler</td>
                    <td className="px-4 py-3 text-center text-gray-400">Ofte begrenset til spesielle chatter</td>
                  </tr>
                  <tr className="border-b border-purple-500/10">
                    <td className="px-4 py-3 text-gray-300">Selvdestruerende meldinger</td>
                    <td className="px-4 py-3 text-center text-green-400">Tilgjengelig for alle meldinger</td>
                    <td className="px-4 py-3 text-center text-gray-400">Begrenset eller betalingsfunksjon</td>
                  </tr>
                  <tr className="border-b border-purple-500/10">
                    <td className="px-4 py-3 text-gray-300">Datahåndtering</td>
                    <td className="px-4 py-3 text-center text-green-400">Ingen datainnsamling for reklame</td>
                    <td className="px-4 py-3 text-center text-gray-400">Ofte brukt til målrettet annonsering</td>
                  </tr>
                  <tr className="border-b border-purple-500/10">
                    <td className="px-4 py-3 text-gray-300">Åpen kildekode</td>
                    <td className="px-4 py-3 text-center text-green-400">Ja, kan verifiseres</td>
                    <td className="px-4 py-3 text-center text-gray-400">Sjeldent</td>
                  </tr>
                  <tr className="border-b border-purple-500/10">
                    <td className="px-4 py-3 text-gray-300">Premium-funksjoner</td>
                    <td className="px-4 py-3 text-center text-green-400">Rimelig og verdibasert</td>
                    <td className="px-4 py-3 text-center text-gray-400">Ofte dyre abonnementer</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-300">Responsivitet</td>
                    <td className="px-4 py-3 text-center text-green-400">Optimalisert for alle enheter</td>
                    <td className="px-4 py-3 text-center text-gray-400">Varierende kvalitet</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-gray-300 text-sm italic text-center mb-4">
              *Basert på sammenligning med de fem mest populære meldingsappene per Mai 2025.
            </p>
          </div>
          
          <div 
            className="p-6 rounded-xl mb-8 bg-gradient-to-br from-cyberdark-900 to-cyberdark-800/90"
            style={{
              borderImage: 'linear-gradient(90deg, #4facfe, #00f2fe) 1',
              border: '2px solid',
            }}
          >
            <h2 
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Kom i gang med SnakkaZ i dag
            </h2>
            
            <p className="text-lg text-gray-300 text-center mb-8">
              Opplev forskjellen med en kommunikasjonsplattform som setter dine behov først. 
              Registrer deg gratis på bare noen sekunder og bli med i det voksende samfunnet av 
              brukere som velger sikkerhet, hastighet og brukervennlighet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                className="px-8 py-6 h-auto text-lg"
                style={{
                  background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #1a9dff 100%)',
                  boxShadow: '0 0 15px rgba(26,157,255,0.4)'
                }}
              >
                <Shield className="mr-2" /> Registrer deg gratis
              </Button>
              
              <Button 
                onClick={() => navigate('/login')}
                className="px-8 py-6 h-auto text-lg"
                style={{
                  background: 'linear-gradient(90deg, #d62828 0%, #f87171 50%, #d62828 100%)',
                  boxShadow: '0 0 15px rgba(214,40,40,0.4)'
                }}
              >
                <MessageSquare className="mr-2" /> Logg inn
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-2">Allerede bruker SnakkaZ på en annen enhet?</p>
              <Button
                onClick={() => navigate('/subscription')}
                variant="outline"
                className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-900/20"
              >
                <Crown className="mr-2" size={16} /> Utforsk premium-abonnementer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare, Shield, Lock, Globe, Home, Zap, Crown, Clock, RefreshCw, Users, Star, Tag, Gift } from "lucide-react";

const Info = () => {
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
            <p className="mb-8 text-lg text-gray-300 leading-relaxed">
              SnakkaZ er et moderne kommunikasjonsverktøy som prioriterer sikker meldingsutveksling
              med ende-til-ende-kryptering. Vår plattform gir brukerne full kontroll over sine data,
              samtidig som vi tilbyr en sømløs og brukervennlig opplevelse.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-cyberdark-950/50">
                <Shield className="text-cyberblue-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-cyberblue-300">Sikkerhet først</h3>
                <p className="text-gray-400">
                  All kommunikasjon er beskyttet med ende-til-ende kryptering, 
                  slik at bare du og mottakeren kan lese meldingene.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-cyberdark-950/50">
                <Lock className="text-red-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold mb-2 text-red-300">Personvern</h3>
                <p className="text-gray-400">
                  Vi samler bare inn det absolutte minimum av data
                  for å gi deg en skreddersydd opplevelse.
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
                    Premium bruker (@snakkaz.com)
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
                  <MessageSquare className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-red-300">Intelligent Kryptering</h3>
                  <p className="text-gray-400">
                    Våre avanserte krypteringsalgoritmer sikrer at dine samtaler forblir private og sikre, 
                    med support for hele-side kryptering i premium-grupper.
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
                    som sikrer at meldingene dine leveres umiddelbart.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate('/register')}
              className="px-8 py-6 h-auto text-lg mr-4"
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #1a9dff 100%)',
                boxShadow: '0 0 15px rgba(26,157,255,0.4)'
              }}
            >
              Registrer deg
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
        </div>
      </div>
    </div>
  );
};

export default Info;

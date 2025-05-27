// filepath: /workspaces/snakkaz-chat/src/pages/Info.tsx 
                med sikkerhet som matcher bankenes standarder og en brukeropplevelse som overgår forventningene.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20 backdrop-blur-sm">
                <Shield className="text-green-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-green-300">100% Sikker</span>
                <span className="text-xs text-cyberdark-300">Vi samler IKKE data</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-cyberblue-500/20 backdrop-blur-sm">
                <Lock className="text-cyberblue-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-cyberblue-300">✅ Verifisert</span>
                <span className="text-xs text-cyberdark-300">E2E Kryptering</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-purple-500/20 backdrop-blur-sm">
                <Users className="text-purple-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-purple-300">🏆 Community</span>
                <span className="text-xs text-cyberdark-300">Trust-system</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-orange-500/20 backdrop-blur-sm">
                <div className="mb-2">
                  <img 
                    src="https://shield.sitelock.com/shield/snakkaz.com" 
                    alt="SiteLock Protected" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                  <Crown className="text-orange-400 hidden" size={32} />
                </div>
                <span className="text-xs md:text-sm font-medium text-orange-300">🔐 Beskyttet</span>
                <span className="text-xs text-cyberdark-300">SiteLock sikkerhet</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/register")}
                className="h-12 px-8 text-lg bg-gradient-to-r from-cybergold-500 to-cybergold-400 hover:from-cybergold-400 hover:to-cybergold-300 text-black font-semibold shadow-lg shadow-cybergold-500/25"
              >
                Start sikker chat
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                variant="outline"
                className="h-12 px-8 text-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/30"
              >
                Logg inn
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose SnakkaZ - Mobile Optimized */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-cyberdark-100">
            Ny her? Les hvorfor SnakkaZ er ditt beste valg
          </h3>
          <p className="text-cyberdark-300 text-lg max-w-3xl mx-auto">
            Oppdag hvorfor tusenvis av brukere stoler på SnakkaZ for sin daglige kommunikasjon
          </p>
        </div>

        {/* Feature Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Security First Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyberblue-500/10 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative p-6 md:p-8 rounded-2xl bg-cyberdark-900/80 border border-cyberdark-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-green-500/20 mr-4">
                  <Shield className="text-green-400" size={28} />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-green-300">Sikkerhet først</h4>
              </div>
              <p className="text-cyberdark-300 mb-6 text-lg leading-relaxed">
                Militærgrads end-to-end kryptering beskyttet av SiteLock sikkerhetssystem beskytter alle dine samtaler. 
                Vi kan ikke lese meldingene dine, og ingen andre kan det heller.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Ingen datainnsamling av personlig informasjon</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">WebRTC P2P-forbindelser for direktekommunikasjon</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">SiteLock kontinuerlig overvåking og malware-beskyttelse</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Automatisk sletting av sensitive data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Design Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/10 to-cybergold-500/10 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative p-6 md:p-8 rounded-2xl bg-cyberdark-900/80 border border-cyberdark-700/50 backdrop-blur-sm hover:border-cyberblue-500/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-cyberblue-500/20 mr-4">
                  <Zap className="text-cyberblue-400" size={28} />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-cyberblue-300">Moderne opplevelse</h4>
              </div>
              <p className="text-cyberdark-300 mb-6 text-lg leading-relaxed">
                Elegant design som fungerer sømløst på alle enheter. Lynrask, intuitiv og bygget for hvordan du kommuniserer i dag.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Responsiv design for mobil, tablet og desktop</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Sanntids-synkronisering mellom alle enheter</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Offline-støtte og intelligente varsler</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-cyberdark-100">
            Perfekt på alle dine enheter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Smartphone className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Mobilvennlig</h4>
              <p className="text-cyberdark-300 text-sm">Touch-optimert grensesnitt designet for moderne smartphones</p>
            </div>
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Tablet className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Tablet-ready</h4>
              <p className="text-cyberdark-300 text-sm">Skalerbart design som utnytter større skjermer optimalt</p>
            </div>
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Monitor className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Desktop-kraftig</h4>
              <p className="text-cyberdark-300 text-sm">Fullverdig opplevelse med avanserte funksjoner for produktivitet</p>
            </div>
          </div>
        </div>
      </div>

      {/* SiteLock Security Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-900/30 via-cyberdark-900/50 to-red-900/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-orange-300">
                🛡️ Beskyttet av SiteLock sikkerhet
              </h3>
              <p className="text-lg text-cyberdark-300 max-w-2xl mx-auto">
                SnakkaZ er beskyttet av profesjonell SiteLock sikkerhet med kontinuerlig overvåking, 
                automatisk malware-fjerning og sanntids trussel-beskyttelse.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm font-medium text-green-300">Kontinuerlig skanning</div>
                <div className="text-xs text-gray-400 mt-1">24/7 overvåking</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-blue-500/20">
                <div className="text-3xl mb-2">🦠</div>
                <div className="text-sm font-medium text-blue-300">Malware-beskyttelse</div>
                <div className="text-xs text-gray-400 mt-1">Automatisk fjerning</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-orange-500/20">
                <div className="text-3xl mb-2">🔐</div>
                <div className="text-sm font-medium text-orange-300">SSL overvåking</div>
                <div className="text-xs text-gray-400 mt-1">Sertifikat-sikkerhet</div>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.sitelock.com/verify.php?site=snakkaz.com','SiteLock','width=600,height=600,left=160,top=170');
                }}
                className="inline-block"
              >
                <img 
                  src="https://shield.sitelock.com/shield/snakkaz.com" 
                  alt="SiteLock Verified" 
                  className="h-12 w-auto mx-auto hover:scale-105 transition-transform duration-200"
                />
              </a>
              <p className="text-xs text-cyberdark-400 mt-2">
                Klikk på logoen for å verifisere vår sikkerhetsstatus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust System */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-purple-900/30 via-cyberdark-900/50 to-blue-900/30 border border-purple-500/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-purple-300">
                🏆 Trust-system: Oppbygg tillit over tid
              </h3>
              <p className="text-lg text-cyberdark-300 max-w-2xl mx-auto">
                Vårt unike trust-system lar deg bygge omdømme og tillit i SnakkaZ-samfunnet gjennom positiv interaksjon.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-gray-600/20">
                <div className="text-2xl md:text-3xl mb-2">🆕</div>
                <div className="text-sm font-medium text-gray-300">Ny bruker</div>
                <div className="text-xs text-gray-400 mt-1">Første 30 dager</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20">
                <div className="text-2xl md:text-3xl mb-2">✅</div>
                <div className="text-sm font-medium text-green-300">Verifisert</div>
                <div className="text-xs text-gray-400 mt-1">Aktiv bruker</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-blue-500/20">
                <div className="text-2xl md:text-3xl mb-2">🔷</div>
                <div className="text-sm font-medium text-blue-300">Etablert</div>
                <div className="text-xs text-gray-400 mt-1">Erfaren medlem</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-cybergold-500/20">
                <div className="text-2xl md:text-3xl mb-2">🏆</div>
                <div className="text-sm font-medium text-cybergold-300">Elite</div>
                <div className="text-xs text-gray-400 mt-1">Samfunnsleder</div>
              </div>
            </div>
          </div>
        </div>
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
                  <h3 className="text-lg font-semibold mb-2 text-green-300">Bedre sikkerhet</h3>
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
                  <h3 className="text-lg font-semibold mb-2 text-blue-300">Enklere å bruke</h3>
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
                  <h3 className="text-lg font-semibold mb-2 text-purple-300">Høyere tilfredshet</h3>
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

        {/* Trust-system Forklaring */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="p-8 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-purple-300">
                  🏆 Trust-system: Oppbygg Tillit Over Tid
                </h2>
                <p className="text-xl text-purple-200 mb-6">
                  Brukere får synlige trust-ikoner basert på positiv oppførsel i fellesskapet
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-cyberdark-900/70 p-5 rounded-lg border border-yellow-500/20 text-center">
                  <div className="text-4xl mb-3">🆕</div>
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Ny bruker</h3>
                  <p className="text-yellow-200 text-sm">
                    Nye brukere starter her. Vis respekt og følg reglene for å bygge tillit.
                  </p>
                </div>
                
                <div className="bg-cyberdark-900/70 p-5 rounded-lg border border-green-500/20 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Pålitelig</h3>
                  <p className="text-green-200 text-sm">
                    100+ positive interaksjoner. Respektert medlem av fellesskapet.
                  </p>
                </div>
                
                <div className="bg-cyberdark-900/70 p-5 rounded-lg border border-blue-500/20 text-center">
                  <div className="text-4xl mb-3">🔷</div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Verifisert</h3>
                  <p className="text-blue-200 text-sm">
                    500+ positive interaksjoner. Høyt ansett og pålitelig bruker.
                  </p>
                </div>
                
                <div className="bg-cyberdark-900/70 p-5 rounded-lg border border-orange-500/20 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Community Champion</h3>
                  <p className="text-orange-200 text-sm">
                    1000+ positive interaksjoner. Fellesskapets mest respekterte medlemmer.
                  </p>
                </div>
              </div>
              
              <div className="bg-cyberdark-800/50 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                  <Users className="mr-2" size={20} />
                  Hvordan bygger jeg tillit?
                </h3>
                <ul className="space-y-2 text-purple-200">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" />Vær respektfull og hyggelig i samtaler</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" />Hjelp andre brukere med spørsmål</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" />Følg fellesskapets regler og retningslinjer</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" />Bidra positivt til gruppesamtaler</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" />Rapporter upassende innhold for å beskytte andre</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Call-to-Action Section */}
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyberblue-900/40 via-cyberdark-900/50 to-cybergold-900/40 border border-cyberblue-500/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/10 via-transparent to-cybergold-500/10"></div>
              <div className="relative p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyberblue-400 via-white to-cybergold-400 bg-clip-text text-transparent">
                  Klar til å ta kontrollen over din kommunikasjon?
                </h2>
                <p className="text-xl text-cyberdark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Bli med i tusenvis av brukere som allerede har oppdaget fremtiden for sikker kommunikasjon.
                  Start din reise med SnakkaZ i dag.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button 
                    onClick={() => navigate("/register")}
                    className="h-14 px-8 text-lg bg-gradient-to-r from-cybergold-500 to-cybergold-400 hover:from-cybergold-400 hover:to-cybergold-300 text-black font-semibold shadow-lg shadow-cybergold-500/25 transform hover:scale-105 transition-all duration-200"
                  >
                    <Crown className="mr-2" size={20} />
                    Opprett konto gratis
                  </Button>
                  <Button 
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="h-14 px-8 text-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/30 transform hover:scale-105 transition-all duration-200"
                  >
                    <MessageSquare className="mr-2" size={20} />
                    Allerede medlem? Logg inn
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-cyberdark-300 text-sm mb-2">
                    🔒 100% sikker • ⚡ Lynrask • 🌍 Tilgjengelig overalt
                  </p>
                  <p className="text-cyberdark-400 text-xs">
                    Ingen skjulte kostnader eller forpliktelser. Start med alle grunnleggende funksjoner inkludert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="bg-cyberdark-950 border-t border-cyberdark-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* SnakkaZ Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                🐍 SnakkaZ
              </h3>
              <p className="text-cyberdark-300 text-sm mb-4">
                Sikker kommunikasjon for den moderne verden. End-to-end kryptering møter elegant design.
              </p>
              <div className="flex space-x-4">
                <Shield className="text-green-400" size={20} />
                <Lock className="text-cyberblue-400" size={20} />
                <Crown className="text-cybergold-400" size={20} />
              </div>
            </div>
            
            {/* Produkt */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li><button onClick={() => navigate("/")} className="hover:text-cyberblue-400 transition-colors">Hjem</button></li>
                <li><button onClick={() => navigate("/register")} className="hover:text-cyberblue-400 transition-colors">Registrer deg</button></li>
                <li><button onClick={() => navigate("/login")} className="hover:text-cyberblue-400 transition-colors">Logg inn</button></li>
                <li><button onClick={() => navigate("/subscription")} className="hover:text-cyberblue-400 transition-colors">Premium abonnement</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Hjelp</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Sikkerhet</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Personvern</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Vilkår</a></li>
              </ul>
            </div>
            
            {/* Kontakt */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Kontakt</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2" size={16} />
                  <span>support@snakkaz.com</span>
                </li>
                <li className="flex items-center">
                  <Shield className="mr-2" size={16} />
                  <span>security@snakkaz.com</span>
                </li>
                <li className="flex items-center">
                  <Globe className="mr-2" size={16} />
                  <span>Tilgjengelig 24/7</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyberdark-800 pt-8 text-center">
            <p className="text-cyberdark-400 text-sm">
              © 2025 SnakkaZ. Alle rettigheter reservert. Bygget med ❤️ for sikker kommunikasjon.
            </p>
            <p className="text-cyberdark-500 text-xs mt-2">
              End-to-end kryptering • Zero-knowledge arkitektur • Open source sikkerhet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoPage;

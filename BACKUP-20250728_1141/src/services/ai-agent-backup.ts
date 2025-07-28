import { DecryptedMessage } from "@/types/message";
import { AIAgentResponse } from "./ai/types";
import { extractWorkflowType, extractHelpTopic, extractCommand } from "./ai/content-extractors";
import { handleWorkflowRequest, handleHelpRequest, handleCommandRequest } from "./ai/request-handlers";
import { handleContextualQuestion, isContextualQuestion } from "./ai/contextual-handler";
import { WORKFLOWS, HELP_TOPICS, COMMANDS } from "@/components/chat/ai/types";

class AIAgent {
  private static instance: AIAgent;
  private readonly agentId = 'ai-agent';
  
  // Vennskap og sosiale forbindelser informasjon
  private readonly appInfo = {
    general: `
      SnakkaZ Chat er en moderne kommunikasjonsplattform som fokuserer på å bygge ekte forbindelser mellom mennesker.
      Vi prioriterer sikre, private samtaler hvor du kan finne, koble deg til og bygge meningsfulle relasjoner med andre brukere.
      Plattformen er designet for å fremme sosiale forbindelser med avansert sikkerhet og personvernsbeskyttelse.
    `,
    friendsystem: `
      Vennesystemet i SnakkaZ inkluderer:
      • Enkelt søk etter nye venner basert på interesser og lokasjon
      • Sikre venneforespørsler med personvernskontroll
      • Vennelister med rask tilgang til samtaler
      • Gruppeadministrasjon med vennene dine
      • Invitasjonssystem for å ta med eksisterende venner
      • Profiltilpasning for å vise hvem du er
      • Blokkering og rapportering for trygghet
      • Aktivitetsstatus og tilgjengelighetsindikator
    `,
    social_features: `
      Sosiale funksjoner for bedre forbindelser:
      • Gruppechatter med opptil 50 venner
      • Deling av bilder, videoer og filer med venner
      • Statusoppdateringer og aktivitetsfeeds
      • Event-organisering og invitasjoner
      • Felles interessegrupper og hobbyklubber
      • Lokale meetup-muligheter (premium)
      • Vennekartet for å se nærliggende venner
      • Samarbeidsverktøy for prosjekter med venner
    `,
    security: `
      Sikkerhetsfunksjoner for trygg kommunikasjon med venner:
      • Ende-til-ende kryptering i alle vennesamtaler
      • Verifiserte profiler for autentiske forbindelser
      • Tidsbegrensede meldinger som slettes automatisk
      • Passordbeskyttede grupperom med venner
      • Støtte for tofaktorautentisering
      • Lokale krypteringsnøkler på din enhet
      • Perfect Forward Secrecy for historie-beskyttelse
      • Sikker filoverføring mellom venner
      • Beskyttelse mot skjermbilder i sensitive samtaler
      • Anti-spam og bot-beskyttelse
    `,
    privacy: `
      Personvernskontroller for vennskap:
      • Du bestemmer hvem som kan finne deg
      • Kontrolller over profilinformasjon synlighet
      • Mulighet til å skjule aktivitetsstatus
      • Anonyme samtaler når ønskelig
      • Automatisk sletting av gammel data
      • Ingen datainnsamling for reklameformål
      • Lokal datalagring på din enhet
      • Rett til å slette all data ved avregistrering
    `,
    premium: `
      Premium-funksjoner for sosiale forbindelser:
      • Utvidet vennekapasitet (500+ venner)
      • Avanserte søkefiltre for venner
      • Prioritert synlighet i vennesøk
      • Eksklusive sosiale grupper
      • Event-organisering med pro-verktøy
      • Lengre meldings-historikk med venner
      • Flere samtidige gruppesamtaler
      • Personlig profil-customization
      • Geo-lokasjon for vennetreff (valgfritt)
      • Premium-støtte for sosiale funksjoner
      • Pris: 99kr per måned
    `
      
      Nyeste sikkerhetsforbedringer (April 2025):
      • Implementert BLAKE3 hashing som et raskere, sikrere alternativ spesielt for mobile enheter
      • Fremtidssikker kryptering med post-kvante-sikker nøkkelutveksling
      • Batterisparende nøkkel-cache med sikker minnehåndtering
      • Lokal biometrisk autentisering på mobilenheter uten tredjepartslagring
    `,
    wickr_technology: `
      Wickr-inspirerte teknologier i SnakkaZ:
      
      SnakkaZ implementerer flere nøkkelteknologier fra Wickr's åpen kildekodebibliotek (wickr-crypto-c):
      
      • Avansert Noise Protocol-basert key agreement
      • Lokalt genererte nøkler som aldri forlater enheten
      • Double Ratchet Algorithm for kontinuerlig nøkkelrotasjon
      • Zero-knowledge autentisering
      • Flerlags kryptering: meldingsinnhold, metadata og tilkoblinger
      • Automatisk nøkkelrotasjon med hyppige intervaller
      • Robust .encrypt()/decrypt() API for filkryptering og mediainnhold
      • Optimalisert mobilimplementasjon med redusert batteripåvirkning
      • Signal-kompatibelt nøkkelhåndteringsprotokoll
      • Sikker distribuert gruppekommunikasjon
      
      Disse teknologiene er optimalisert for mobile enheter med fokus på ytelse, 
      batterilevetid og pålitelighet på tvers av varierende nettverksforhold.
    `,
    performance: `
      Nylige ytelsesoptimaliseringer (April 2025):
      • Betydelig hastighetsforbedring med optimaliserte database-policyer
      • Redusert responstid ved bruk av preprosesserte spørringer
      • Bedre skalering for store grupperom med mange meldinger
      • Forbedret synkronisering mellom enheter
      • 40% lavere batteripåvirkning ved krypteringsoperasjoner på mobile enheter
      • Redusert minnebruk med optimalisert nøkkellagring
      • Raskere appoppstart med on-demand krypteringsinitializing
      • Flytende brukeropplevelse selv på eldre mobilenheter
      • Offline-støtte med kryptert meldingskø
    `,
    premium: `
      Premium-funksjoner i SnakkaZ inkluderer:
      • Avanserte krypterte grupperom
      • Utvidede administratortillatelser
      • Tilpassede sikkerhetsnivåer
      • Lengre meldings-historikk
      • Prioritert støtte
      • Pris: 99kr per måned, med Bitcoin-betalingsmulighet
      • Flere samtidige enheter (opptil 8)
      • Økt filoverføringsstørrelse (opptil 2GB)
      • Avanserte kommunikasjonsverifiseringsverktøy
      • Tilpassbare sikkerhetsregler for team
    `
  };
  
  private constructor() {}

  public static getInstance(): AIAgent {
    if (!AIAgent.instance) {
      AIAgent.instance = new AIAgent();
    }
    return AIAgent.instance;
  }

  public async processMessage(message: DecryptedMessage): Promise<AIAgentResponse> {
    const content = message.content.toLowerCase();
    
    // Nye info-kommandoer for å få informasjon om Snakkaz
    if (content.includes('info om snakkaz') || content.includes('fortell om snakkaz')) {
      return { content: this.appInfo.general };
    }

    if (content.includes('sikkerhet') || content.includes('kryptering') || content.includes('personvern')) {
      return { content: this.appInfo.security };
    }
    
    if (content.includes('wickr') || content.includes('sammenlign') || content.includes('sammenligning')) {
      return { content: this.appInfo.security_comparison };
    }
    
    if (content.includes('wickr teknologi') || content.includes('wickr-crypto-c')) {
      return { content: this.appInfo.wickr_technology };
    }

    if (content.includes('ytelse') || content.includes('hastighet') || content.includes('optimalisering') || content.includes('mobil')) {
      return { content: this.appInfo.performance };
    }

    if (content.includes('premium') || content.includes('betalte funksjoner') || content.includes('premium-funksjoner')) {
      return { content: this.appInfo.premium };
    }
    
    // Workflow commands
    if (content.includes('workflow')) {
      const workflowType = extractWorkflowType(content);
      return handleWorkflowRequest(workflowType);
    }
    
    // Help commands
    if (content.includes('hjelp')) {
      const topic = extractHelpTopic(content);
      return handleHelpRequest(topic);
    }

    // General commands
    if (content.includes('kommando')) {
      const commandId = extractCommand(content);
      return handleCommandRequest(commandId);
    }

    // Contextual questions
    if (isContextualQuestion(content)) {
      return handleContextualQuestion(content);
    }

    // Standard response med oppdatert informasjon
    return {
      content: `Hei! Jeg er SnakkaZ Assistant. Jeg kan hjelpe deg med følgende:

1. Workflows - Tilgjengelige workflows: ${Object.keys(WORKFLOWS).join(', ')}
2. Hjelp - Tilgjengelige emner: ${Object.keys(HELP_TOPICS).join(', ')}
3. Kommandoer - Tilgjengelige kommandoer: ${Object.keys(COMMANDS).join(', ')}
4. Informasjon - Prøv "info om Snakkaz", "sikkerhet", "ytelse", "premium", "sammenligning" eller "wickr teknologi"

Spør meg om noe spesifikt eller skriv 'hjelp <emne>' for mer informasjon!`
    };
  }
}

export const aiAgent = AIAgent.getInstance();

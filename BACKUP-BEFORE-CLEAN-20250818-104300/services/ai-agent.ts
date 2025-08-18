import { DecryptedMessage } from "@/types/message";
import { AIAgentResponse } from "./ai/types";
import { extractWorkflowType, extractHelpTopic, extractCommand } from "./ai/content-extractors";
import { handleWorkflowRequest, handleHelpRequest, handleCommandRequest } from "./ai/request-handlers";
import { handleContextualQuestion, isContextualQuestion } from "./ai/contextual-handler";
import { WORKFLOWS, HELP_TOPICS, COMMANDS } from "@/components/chat/ai/types";

class AIAgent {
  private static instance: AIAgent;
  private readonly agentId = 'friend-assistant';
  
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
      • Kontroller over profilinformasjon synlighet
      • Mulighet til å skjule aktivitetsstatus
      • Anonyme samtaler når ønskelig
      • Automatisk sletting av gammel data
      • Ingen datainnsamling for reklameformål
      • Lokal datalagring på din enhet
      • Rett til å slette all data ved avregistrering
    `,
    performance: `
      Ytelsesoptimaliseringer for sosial kommunikasjon:
      • Rask lasting av vennelister og grupper
      • Optimalisert synkronisering mellom enheter
      • Effektiv håndtering av store gruppesamtaler
      • Redusert batteripåvirkning ved aktiv bruk
      • Sømløs overgang mellom samtaler
      • Rask søk i venner og meldingshistorikk
      • Offline-støtte for viktige kontakter
      • Intelligent caching av frequently brukte data
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
      • Pris: 99kr per måned, med Bitcoin-betalingsmulighet
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
    
    // Friend-focused info commands
    if (content.includes('info om snakkaz') || content.includes('fortell om snakkaz')) {
      return { content: this.appInfo.general };
    }

    if (content.includes('vennesystem') || content.includes('finne venner') || content.includes('venner')) {
      return { content: this.appInfo.friendsystem };
    }
    
    if (content.includes('sosiale funksjoner') || content.includes('sosial') || content.includes('grupper')) {
      return { content: this.appInfo.social_features };
    }
    
    if (content.includes('sikkerhet') || content.includes('kryptering') || content.includes('personvern')) {
      return { content: this.appInfo.security };
    }

    if (content.includes('personvern') || content.includes('privatliv') || content.includes('anonymitet')) {
      return { content: this.appInfo.privacy };
    }

    if (content.includes('ytelse') || content.includes('hastighet') || content.includes('optimalisering')) {
      return { content: this.appInfo.performance };
    }

    if (content.includes('premium') || content.includes('betalte funksjoner') || content.includes('premium-funksjoner')) {
      return { content: this.appInfo.premium };
    }
    
    // Workflow commands - friend focused
    if (content.includes('workflow')) {
      const workflowType = extractWorkflowType(content);
      return handleWorkflowRequest(workflowType);
    }
    
    // Help commands - friend focused
    if (content.includes('hjelp')) {
      const topic = extractHelpTopic(content);
      return handleHelpRequest(topic);
    }

    // General commands - friend focused
    if (content.includes('kommando')) {
      const commandId = extractCommand(content);
      return handleCommandRequest(commandId);
    }

    // Contextual questions - friend focused
    if (isContextualQuestion(content)) {
      return handleContextualQuestion(content);
    }

    // Standard response med friend-focused informasjon
    return {
      content: `Hei! Jeg er din Venn Assistent på Snakkaz. Jeg kan hjelpe deg med å bygge forbindelser og finne venner:

1. Workflows - Tilgjengelige vennskap-workflows: ${Object.keys(WORKFLOWS).join(', ')}
2. Hjelp - Sosiale hjelpetemaer: ${Object.keys(HELP_TOPICS).join(', ')}
3. Kommandoer - Vennskaps-kommandoer: ${Object.keys(COMMANDS).join(', ')}
4. Informasjon - Prøv "vennesystem", "sosiale funksjoner", "sikkerhet", "personvern", "ytelse" eller "premium"

Spør meg om hvordan du kan finne nye venner, invitere eksisterende venner, eller bygge meningsfulle forbindelser på Snakkaz!`
    };
  }
}

export const aiAgent = AIAgent.getInstance();

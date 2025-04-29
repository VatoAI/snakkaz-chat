import { DecryptedMessage } from "@/types/message";
import { AIAgentResponse } from "./ai/types";
import { extractWorkflowType, extractHelpTopic, extractCommand } from "./ai/content-extractors";
import { handleWorkflowRequest, handleHelpRequest, handleCommandRequest } from "./ai/request-handlers";
import { handleContextualQuestion, isContextualQuestion } from "./ai/contextual-handler";
import { WORKFLOWS, HELP_TOPICS, COMMANDS } from "@/components/chat/ai/types";

class AIAgent {
  private static instance: AIAgent;
  private readonly agentId = 'ai-agent';
  
  // Nye informasjonstemaer om Snakkaz Chat
  private readonly appInfo = {
    general: `
      SnakkaZ Chat er et moderne kommunikasjonsverktøy som prioriterer sikkerhet og personvern med avansert ende-til-ende kryptering.
      Plattformen er designet for å gi brukere full kontroll over sine data samtidig som vi tilbyr en sømløs og brukervennlig opplevelse.
    `,
    security: `
      Sikkerhetsfunksjoner i SnakkaZ inkluderer:
      • Ende-til-ende kryptering i alle samtaler
      • Helside-kryptering i premium-grupper
      • Tidsbegrensede meldinger som slettes automatisk
      • Passordbeskyttede grupperom
      • Støtte for tofaktorautentisering
      • Lokal nøkkelgenerering – krypteringsnøkler genereres kun på brukerens enhet
      • Perfect Forward Secrecy – kompromitterte nøkler kan ikke dekryptere tidligere meldinger
      • Nøkkelrotasjon – krypteringsnøkler roteres regelmessig for økt sikkerhet
      • Sikker nøkkeldistribusjon med Curve25519/ECDH – inspirert av Wickr og Signal
      • Beskyttelse mot skjermbilder i sensitive samtaler
      • Ratchet-basert meldingskryptering i SnakkaZ Signal Protocol
      • "Burn-on-read" modus for høysensitive meldinger
    `,
    security_comparison: `
      Sammenligning med Wickr (basert på wickr-crypto-c):
      
      Likheter med Wickr:
      • Begge bruker moderne ende-til-ende kryptering basert på Elliptic Curve kryptografi
      • Begge tilbyr ephemeral messaging (selvdestruerende meldinger)
      • Begge implementerer Perfect Forward Secrecy
      • Begge støtter gruppekommunikasjon med ende-til-ende kryptering
      • Begge har hovedfokus på mobilbrukervennlighet
      
      Forbedringer i SnakkaZ vs. Wickr:
      • Mer strømlinjeformet brukergrensesnitt for mobile enheter
      • Lavere batterforbruk med optimaliserte krypteringsoperasjoner
      • Bedre ytelse på eldre mobile enheter med selektiv cache
      • Mer intuitive sikkerhetskontroller for ikke-tekniske brukere
      • Integrert AI-assistent med respekt for ende-til-ende kryptering
      • Enklere oppsett av sikker kommunikasjon med QR-kode
      • Optimalisert for nordiske språk og personvernpreferanser
      
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

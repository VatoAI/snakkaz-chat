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
    `,
    performance: `
      Nylige ytelsesoptimaliseringer (April 2025):
      • Betydelig hastighetsforbedring med optimaliserte database-policyer
      • Redusert responstid ved bruk av preprosesserte spørringer
      • Bedre skalering for store grupperom med mange meldinger
      • Forbedret synkronisering mellom enheter
    `,
    premium: `
      Premium-funksjoner i SnakkaZ inkluderer:
      • Avanserte krypterte grupperom
      • Utvidede administratortillatelser
      • Tilpassede sikkerhetsnivåer
      • Lengre meldings-historikk
      • Prioritert støtte
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
    
    // Nye info-kommandoer for å få informasjon om Snakkaz
    if (content.includes('info om snakkaz') || content.includes('fortell om snakkaz')) {
      return { content: this.appInfo.general };
    }

    if (content.includes('sikkerhet') || content.includes('kryptering') || content.includes('personvern')) {
      return { content: this.appInfo.security };
    }

    if (content.includes('ytelse') || content.includes('hastighet') || content.includes('optimalisering')) {
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
4. Informasjon - Prøv "info om Snakkaz", "sikkerhet", "ytelse" eller "premium"

Spør meg om noe spesifikt eller skriv 'hjelp <emne>' for mer informasjon!`
    };
  }
}

export const aiAgent = AIAgent.getInstance();

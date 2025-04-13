import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";

export interface AIAgentResponse {
  content: string;
  action?: {
    type: 'workflow' | 'help' | 'command';
    payload: any;
  };
}

class AIAgent {
  private static instance: AIAgent;
  private readonly agentId = 'ai-agent';
  
  private constructor() {}

  public static getInstance(): AIAgent {
    if (!AIAgent.instance) {
      AIAgent.instance = new AIAgent();
    }
    return AIAgent.instance;
  }

  public async processMessage(message: DecryptedMessage): Promise<AIAgentResponse> {
    const content = message.content.toLowerCase();
    
    // Hovedkommandoer
    if (content.includes('hjelp')) {
      return this.handleHelpRequest(content);
    }
    
    if (content.includes('workflow')) {
      return this.handleWorkflowRequest(content);
    }

    if (content.includes('kommando')) {
      return this.handleCommandRequest(content);
    }

    // Kontekstbaserte svar
    if (this.isProfileQuery(content)) {
      return this.handleProfileRequest(content);
    }

    if (this.isChatQuery(content)) {
      return this.handleChatRequest(content);
    }

    if (this.isSecurityQuery(content)) {
      return this.handleSecurityRequest(content);
    }

    // Standard svar
    return {
      content: "Hei! Jeg er SnakkaZ AI Assistant. Jeg kan hjelpe deg med følgende:\n\n" +
        "1. 'workflow' - Guide deg gjennom ulike prosesser\n" +
        "2. 'hjelp' - Få hjelp med spesifikke temaer\n" +
        "3. 'kommando' - Utføre ulike handlinger\n\n" +
        "Du kan også spørre meg om profil, chat, sikkerhet eller andre SnakkaZ-relaterte temaer!"
    };
  }

  private isProfileQuery(content: string): boolean {
    const profileKeywords = ['profil', 'avatar', 'brukernavn', 'innstilling'];
    return profileKeywords.some(keyword => content.includes(keyword));
  }

  private isChatQuery(content: string): boolean {
    const chatKeywords = ['chat', 'melding', 'samtale', 'venn', 'gruppe'];
    return chatKeywords.some(keyword => content.includes(keyword));
  }

  private isSecurityQuery(content: string): boolean {
    const securityKeywords = ['sikkerhet', 'kryptert', 'privat', 'ende-til-ende'];
    return securityKeywords.some(keyword => content.includes(keyword));
  }

  private async handleHelpRequest(content: string): Promise<AIAgentResponse> {
    const helpTopics = {
      profil: 'Profilhjelp: Endre avatar, brukernavn eller andre innstillinger',
      chat: 'Chathjelp: Start chat, send meldinger, gruppechat',
      sikkerhet: 'Sikkerhetshjelp: Ende-til-ende kryptering, privat modus',
      venner: 'Vennehjelp: Finn venner, send forespørsler',
      innstillinger: 'Innstillingshjelp: Endre varslinger, status, synlighet'
    };

    const topic = Object.keys(helpTopics).find(key => content.includes(key));
    
    if (topic) {
      return {
        content: helpTopics[topic as keyof typeof helpTopics],
        action: {
          type: 'help',
          payload: {
            topic,
            details: this.getHelpDetails(topic)
          }
        }
      };
    }

    return {
      content: `Her er hva jeg kan hjelpe deg med:\n\n${Object.values(helpTopics).join('\n')}`,
      action: {
        type: 'help',
        payload: {
          requestType: 'general',
          topics: Object.keys(helpTopics)
        }
      }
    };
  }

  private getHelpDetails(topic: string): string[] {
    const helpDetails: Record<string, string[]> = {
      profil: [
        'Gå til profilsiden ved å klikke på profilbildet',
        'Last opp nytt profilbilde',
        'Endre brukernavn og andre detaljer',
        'Lagre endringer'
      ],
      chat: [
        'Velg en venn fra vennelisten',
        'Start en ny chat',
        'Send tekst, bilder eller filer',
        'Bruk ende-til-ende kryptering for sikker chat'
      ],
      sikkerhet: [
        'Alle meldinger er ende-til-ende kryptert',
        'Bruk privat modus for å være usynlig',
        'Sett selvdestruerende meldinger',
        'Aktiver to-faktor autentisering'
      ],
      venner: [
        'Søk etter brukere',
        'Send venneforespørsel',
        'Godta eller avslå forespørsler',
        'Organiser vennelisten'
      ],
      innstillinger: [
        'Endre varslings-innstillinger',
        'Juster personvern',
        'Sett status (online, borte, etc.)',
        'Administrer blokkerte brukere'
      ]
    };

    return helpDetails[topic] || ['Ingen detaljer tilgjengelig for dette temaet'];
  }

  private async handleWorkflowRequest(content: string): Promise<AIAgentResponse> {
    const workflowType = content.replace('workflow', '').trim();
    
    return {
      content: `Jeg hjelper deg med workflow for: ${workflowType}. La meg guide deg gjennom prosessen.`,
      action: {
        type: 'workflow',
        payload: {
          workflowType,
          steps: this.getWorkflowSteps(workflowType)
        }
      }
    };
  }

  private getWorkflowSteps(workflowType: string): string[] {
    const workflows: Record<string, string[]> = {
      'chat': [
        'Start en ny chat',
        'Velg mottaker',
        'Skriv melding',
        'Vent på svar'
      ],
      'venner': [
        'Søk etter bruker',
        'Send venneforespørsel',
        'Vent på godkjenning',
        'Start chat når godkjent'
      ],
      'profil': [
        'Gå til profilsiden',
        'Velg rediger profil',
        'Oppdater informasjon',
        'Last opp nytt bilde hvis ønsket',
        'Lagre endringer'
      ],
      'sikkerhet': [
        'Gå til sikkerhetsinnstillinger',
        'Aktiver to-faktor autentisering',
        'Generer sikkerhetsnøkler',
        'Bekreft innstillinger'
      ],
      'gruppe': [
        'Opprett ny gruppe',
        'Legg til medlemmer',
        'Sett gruppebeskrivelse',
        'Start gruppechat'
      ]
    };

    return workflows[workflowType] || ['Beklager, fant ikke workflow for: ' + workflowType];
  }

  private async handleCommandRequest(content: string): Promise<AIAgentResponse> {
    const command = content.replace('kommando', '').trim();
    
    const commands: Record<string, () => AIAgentResponse> = {
      'status': () => ({
        content: 'Endrer din online status. Velg mellom: online, borte, opptatt, usynlig',
        action: { type: 'command', payload: { action: 'changeStatus' } }
      }),
      'varsling': () => ({
        content: 'Administrerer varslingsinnstillinger',
        action: { type: 'command', payload: { action: 'notifications' } }
      }),
      'tema': () => ({
        content: 'Endre app-tema (lyst/mørkt)',
        action: { type: 'command', payload: { action: 'theme' } }
      }),
      'loggut': () => ({
        content: 'Logger deg ut av appen',
        action: { type: 'command', payload: { action: 'logout' } }
      })
    };

    return commands[command]?.() || {
      content: 'Tilgjengelige kommandoer: ' + Object.keys(commands).join(', '),
      action: { type: 'command', payload: { action: 'help' } }
    };
  }

  private async handleProfileRequest(content: string): Promise<AIAgentResponse> {
    return {
      content: 'Her er hjelp med profilrelaterte spørsmål. Du kan endre profil ved å:',
      action: {
        type: 'workflow',
        payload: {
          workflowType: 'profil',
          steps: this.getWorkflowSteps('profil')
        }
      }
    };
  }

  private async handleChatRequest(content: string): Promise<AIAgentResponse> {
    return {
      content: 'Her er hjelp med chat-relaterte spørsmål. Du kan:',
      action: {
        type: 'workflow',
        payload: {
          workflowType: 'chat',
          steps: this.getWorkflowSteps('chat')
        }
      }
    };
  }

  private async handleSecurityRequest(content: string): Promise<AIAgentResponse> {
    return {
      content: 'Her er informasjon om sikkerhet i SnakkaZ:',
      action: {
        type: 'workflow',
        payload: {
          workflowType: 'sikkerhet',
          steps: this.getWorkflowSteps('sikkerhet')
        }
      }
    };
  }
}

export const aiAgent = AIAgent.getInstance();
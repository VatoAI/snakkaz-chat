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
    
    // Grunnleggende workflow kommandoer
    if (content.includes('hjelp')) {
      return this.handleHelpRequest(content);
    }
    
    if (content.includes('workflow')) {
      return this.handleWorkflowRequest(content);
    }

    // Standard svar hvis ingen spesifikke kommandoer matches
    return {
      content: "Hei! Jeg er SnakkaZ AI Assistant. Jeg kan hjelpe deg med workflow og andre henvendelser. Skriv 'hjelp' for å se hva jeg kan gjøre."
    };
  }

  private async handleHelpRequest(content: string): Promise<AIAgentResponse> {
    return {
      content: `Her er hva jeg kan hjelpe deg med:
1. Workflow håndtering - skriv 'workflow <oppgave>'
2. Brukerhenvendelser - skriv 'hjelp <tema>'
3. Kommandoer - skriv 'kommando <handling>'`,
      action: {
        type: 'help',
        payload: {
          requestType: 'general'
        }
      }
    };
  }

  private async handleWorkflowRequest(content: string): Promise<AIAgentResponse> {
    // Ekstraherer spesifikk workflow forespørsel
    const workflowType = content.replace('workflow', '').trim();
    
    return {
      content: `Jeg hjelper deg med workflow for: ${workflowType}. 
La meg guide deg gjennom prosessen.`,
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
    // Her kan vi definere ulike workflow steg basert på type
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
      // Legg til flere workflows etter behov
    };

    return workflows[workflowType] || ['Beklager, fant ikke workflow for: ' + workflowType];
  }
}

export const aiAgent = AIAgent.getInstance();
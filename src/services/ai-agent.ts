import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { 
  AIAction,
  WORKFLOWS,
  HELP_TOPICS,
  COMMANDS,
  Workflow,
  HelpTopic,
  Command
} from "@/components/chat/ai/types";

export interface AIAgentResponse {
  content: string;
  action?: AIAction;
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
    
    // Workflow kommandoer
    if (content.includes('workflow')) {
      const workflowType = this.extractWorkflowType(content);
      return this.handleWorkflowRequest(workflowType);
    }
    
    // Hjelpekommandoer
    if (content.includes('hjelp')) {
      const topic = this.extractHelpTopic(content);
      return this.handleHelpRequest(topic);
    }

    // Generelle kommandoer
    if (content.includes('kommando')) {
      const commandId = this.extractCommand(content);
      return this.handleCommandRequest(commandId);
    }

    // Kontekstbaserte spørsmål
    if (this.isContextualQuestion(content)) {
      return this.handleContextualQuestion(content);
    }

    // Standard svar
    return {
      content: `Hei! Jeg er SnakkaZ Assistant. Jeg kan hjelpe deg med følgende:

1. Workflows - Tilgjengelige workflows: ${Object.keys(WORKFLOWS).join(', ')}
2. Hjelp - Tilgjengelige emner: ${Object.keys(HELP_TOPICS).join(', ')}
3. Kommandoer - Tilgjengelige kommandoer: ${Object.keys(COMMANDS).join(', ')}

Spør meg om noe spesifikt eller skriv 'hjelp <emne>' for mer informasjon!`
    };
  }

  private extractWorkflowType(content: string): string {
    const words = content.split(' ');
    const index = words.indexOf('workflow');
    return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
  }

  private extractHelpTopic(content: string): string {
    const words = content.split(' ');
    const index = words.indexOf('hjelp');
    return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
  }

  private extractCommand(content: string): string {
    const words = content.split(' ');
    const index = words.indexOf('kommando');
    return index >= 0 && index < words.length - 1 ? words[index + 1] : '';
  }

  private async handleWorkflowRequest(workflowType: string): Promise<AIAgentResponse> {
    const workflow = WORKFLOWS[workflowType];
    
    if (!workflow) {
      return {
        content: `Beklager, jeg fant ikke workflow for "${workflowType}". Tilgjengelige workflows: ${Object.keys(WORKFLOWS).join(', ')}`
      };
    }

    return {
      content: `La meg hjelpe deg med: ${workflow.title}\n${workflow.description}`,
      action: {
        type: 'workflow',
        payload: {
          workflowType: workflow.id,
          steps: workflow.steps.map(step => step.description)
        }
      }
    };
  }

  private async handleHelpRequest(topic: string): Promise<AIAgentResponse> {
    const helpTopic = HELP_TOPICS[topic];
    
    if (!topic) {
      return {
        content: `Her er alle tilgjengelige hjelpeemner:\n\n${
          Object.values(HELP_TOPICS)
            .map(t => `${t.title}: ${t.description}`)
            .join('\n')
        }`
      };
    }

    if (!helpTopic) {
      return {
        content: `Beklager, jeg fant ikke hjelp for "${topic}". Tilgjengelige emner: ${Object.keys(HELP_TOPICS).join(', ')}`
      };
    }

    return {
      content: `${helpTopic.title}\n${helpTopic.description}`,
      action: {
        type: 'help',
        payload: {
          topic: helpTopic.id,
          details: helpTopic.details
        }
      }
    };
  }

  private async handleCommandRequest(commandId: string): Promise<AIAgentResponse> {
    const command = COMMANDS[commandId];
    
    if (!commandId) {
      return {
        content: `Her er alle tilgjengelige kommandoer:\n\n${
          Object.values(COMMANDS)
            .map(c => `${c.title}: ${c.description}`)
            .join('\n')
        }`
      };
    }

    if (!command) {
      return {
        content: `Beklager, jeg fant ikke kommandoen "${commandId}". Tilgjengelige kommandoer: ${Object.keys(COMMANDS).join(', ')}`
      };
    }

    return {
      content: `Utfører kommando: ${command.title}\n${command.description}`,
      action: {
        type: 'command',
        payload: {
          action: command.action,
          requiresConfirmation: command.requiresConfirmation
        }
      }
    };
  }

  private isContextualQuestion(content: string): boolean {
    // Sjekk om spørsmålet matcher noen predefinerte mønstre
    const patterns = [
      ...Object.keys(WORKFLOWS).map(w => WORKFLOWS[w].title.toLowerCase()),
      ...Object.keys(HELP_TOPICS).map(h => HELP_TOPICS[h].title.toLowerCase()),
      ...Object.keys(COMMANDS).map(c => COMMANDS[c].title.toLowerCase())
    ];

    return patterns.some(pattern => content.includes(pattern.toLowerCase()));
  }

  private handleContextualQuestion(content: string): AIAgentResponse {
    // Finn beste match basert på innhold
    for (const [id, workflow] of Object.entries(WORKFLOWS)) {
      if (content.includes(workflow.title.toLowerCase())) {
        return this.handleWorkflowRequest(id);
      }
    }

    for (const [id, topic] of Object.entries(HELP_TOPICS)) {
      if (content.includes(topic.title.toLowerCase())) {
        return this.handleHelpRequest(id);
      }
    }

    for (const [id, command] of Object.entries(COMMANDS)) {
      if (content.includes(command.title.toLowerCase())) {
        return this.handleCommandRequest(id);
      }
    }

    // Fallback hvis ingen direkte match
    return {
      content: "Jeg forstår at du har et spørsmål, men jeg er ikke helt sikker på hva du spør om. " +
        "Prøv å bruke nøkkelordene 'workflow', 'hjelp' eller 'kommando' for mer spesifikk assistanse."
    };
  }
}

export const aiAgent = AIAgent.getInstance();
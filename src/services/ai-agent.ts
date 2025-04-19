
import { DecryptedMessage } from "@/types/message";
import { AIAgentResponse } from "./ai/types";
import { extractWorkflowType, extractHelpTopic, extractCommand } from "./ai/content-extractors";
import { handleWorkflowRequest, handleHelpRequest, handleCommandRequest } from "./ai/request-handlers";
import { handleContextualQuestion, isContextualQuestion } from "./ai/contextual-handler";

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

    // Standard response
    return {
      content: `Hei! Jeg er SnakkaZ Assistant. Jeg kan hjelpe deg med følgende:

1. Workflows - Tilgjengelige workflows: ${Object.keys(WORKFLOWS).join(', ')}
2. Hjelp - Tilgjengelige emner: ${Object.keys(HELP_TOPICS).join(', ')}
3. Kommandoer - Tilgjengelige kommandoer: ${Object.keys(COMMANDS).join(', ')}

Spør meg om noe spesifikt eller skriv 'hjelp <emne>' for mer informasjon!`
    };
  }
}

export const aiAgent = AIAgent.getInstance();

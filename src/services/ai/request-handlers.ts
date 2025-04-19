
import { WORKFLOWS, HELP_TOPICS, COMMANDS } from "@/components/chat/ai/types";
import { AIAgentResponse } from "./types";

export const handleWorkflowRequest = (workflowType: string): AIAgentResponse => {
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
};

export const handleHelpRequest = (topic: string): AIAgentResponse => {
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
};

export const handleCommandRequest = (commandId: string): AIAgentResponse => {
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
};

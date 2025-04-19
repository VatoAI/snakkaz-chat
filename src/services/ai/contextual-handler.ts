
import { WORKFLOWS, HELP_TOPICS, COMMANDS } from "@/components/chat/ai/types";
import { AIAgentResponse } from "./types";
import { handleWorkflowRequest, handleHelpRequest, handleCommandRequest } from "./request-handlers";

const isContextualQuestion = (content: string): boolean => {
  const patterns = [
    ...Object.keys(WORKFLOWS).map(w => WORKFLOWS[w].title.toLowerCase()),
    ...Object.keys(HELP_TOPICS).map(h => HELP_TOPICS[h].title.toLowerCase()),
    ...Object.keys(COMMANDS).map(c => COMMANDS[c].title.toLowerCase())
  ];

  return patterns.some(pattern => content.includes(pattern.toLowerCase()));
};

export const handleContextualQuestion = (content: string): AIAgentResponse => {
  // Find best match based on content
  for (const [id, workflow] of Object.entries(WORKFLOWS)) {
    if (content.includes(workflow.title.toLowerCase())) {
      return handleWorkflowRequest(id);
    }
  }

  for (const [id, topic] of Object.entries(HELP_TOPICS)) {
    if (content.includes(topic.title.toLowerCase())) {
      return handleHelpRequest(id);
    }
  }

  for (const [id, command] of Object.entries(COMMANDS)) {
    if (content.includes(command.title.toLowerCase())) {
      return handleCommandRequest(id);
    }
  }

  return {
    content: "Jeg forstår at du har et spørsmål, men jeg er ikke helt sikker på hva du spør om. " +
      "Prøv å bruke nøkkelordene 'workflow', 'hjelp' eller 'kommando' for mer spesifikk assistanse."
  };
};

export { isContextualQuestion };

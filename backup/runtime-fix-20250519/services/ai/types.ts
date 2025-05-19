
import { AIAction } from "@/components/chat/ai/types";
import { DecryptedMessage } from "@/types/message";

export interface AIAgentResponse {
  content: string;
  action?: AIAction;
}

export type ContentExtractor = (content: string) => string;

import { AIAction } from "@/components/chat/ai/types";
import { DecryptedMessage } from "@/types/message";

export interface AIAgentResponse {
  content: string;
  action?: AIAction;
}

export type ContentExtractor = (content: string) => string;

// SnakkaZ AI Service Types
export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    parent_model?: string;
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaModelResponse {
  models: OllamaModel[];
  timestamp?: string;
}

export interface OllamaChatResponse {
  response: string;
  model: string;
  timestamp: string;
  done?: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaCodeResponse {
  code: string;
  language: string;
  model: string;
  timestamp: string;
}

export interface OllamaServiceConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  models: {
    chat: string;
    code: string;
    embedding: string;
  };
}

export interface AIConnectionStatus {
  online: boolean;
  serverUrl: string;
  latency?: number;
  error?: string;
}

export interface AIDiagnostics {
  connection: boolean;
  models: string[];
  latency: number;
  error?: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  context?: string;
  stream?: boolean;
  system?: string;
}

export interface CodeGenerationOptions {
  language?: string;
  model?: string;
  temperature?: number;
  includeComments?: boolean;
}

export type AIContextType = "greeting" | "help" | "technical" | "casual";

export interface NorvegianHelpers {
  greetings: string[];
  confirmations: string[];
  helpOffers: string[];
  technical: string[];
}

export interface RemoteAIError {
  message: string;
  code?: string;
  timestamp: string;
  retryable: boolean;
}

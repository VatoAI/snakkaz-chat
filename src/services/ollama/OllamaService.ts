/**
 * Ollama Integration Service
 *
 * Håndterer kommunikasjon med lokale Ollama LLM modeller
 * Inkluderer support for norske modeller og SnakkaZ-spesifikke evner
 */

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  context?: number[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_ctx?: number;
    stop?: string[];
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaEmbeddingRequest {
  model: string;
  prompt: string;
}

export interface OllamaEmbeddingResponse {
  embedding: number[];
}

class OllamaService {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  /**
   * Test if Ollama server is running
   */
  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      console.warn("Ollama server not running:", error);
      return false;
    }
  }

  /**
   * List all available models
   */
  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Error listing Ollama models:", error);
      throw error;
    }
  }

  /**
   * Check if a specific model is available
   */
  async hasModel(modelName: string): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.some((model) => model.name === modelName);
    } catch (error) {
      console.error("Error checking model availability:", error);
      return false;
    }
  }

  /**
   * Pull/download a model from Ollama registry
   */
  async pullModel(
    modelName: string,
    onProgress?: (progress: string) => void
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: modelName, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.status && onProgress) {
              onProgress(data.status);
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Error pulling model:", error);
      throw error;
    }
  }

  /**
   * Generate text with a model
   */
  async generate(
    request: OllamaGenerateRequest,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          stream: !!onChunk,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (onChunk && response.body) {
        // Stream response
        const reader = response.body.getReader();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const data: OllamaGenerateResponse = JSON.parse(line);
              if (data.response) {
                fullResponse += data.response;
                onChunk(data.response);
              }
              if (data.done) {
                return fullResponse;
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }

        return fullResponse;
      } else {
        // Non-stream response
        const data: OllamaGenerateResponse = await response.json();
        return data.response;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Generation was cancelled");
      }
      console.error("Error generating text:", error);
      throw error;
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(request: OllamaEmbeddingRequest): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OllamaEmbeddingResponse = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  }

  /**
   * Cancel ongoing generation
   */
  cancelGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Get model info
   */
  async getModelInfo(modelName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/show`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: modelName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting model info:", error);
      throw error;
    }
  }

  /**
   * Norwegian-specific helper: Generate text with Norwegian context
   */
  async generateNorwegian(
    prompt: string,
    model: string = "llama3.2:3b",
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `Du er SnakkaZ AI, en norsk chat-assistent. 
Du skal alltid svare på norsk, være hjelpsom og vennlig. 
Du forstår norsk kultur og kan ha naturlige samtaler på norsk.
Bruk moderne norsk språk og vær personlig i kommunikasjonen.`;

    return this.generate(
      {
        model,
        prompt,
        system: systemPrompt,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_ctx: 4096,
        },
      },
      onChunk
    );
  }

  /**
   * Code-specific helper: Generate code with context
   */
  async generateCode(
    prompt: string,
    language: string = "typescript",
    model: string = "codellama:7b",
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a skilled ${language} developer. 
Generate clean, well-documented code following best practices.
Include comments in Norwegian when appropriate.
Focus on TypeScript/React patterns for SnakkaZ chat application.`;

    return this.generate(
      {
        model,
        prompt,
        system: systemPrompt,
        options: {
          temperature: 0.3,
          top_p: 0.8,
          num_ctx: 8192,
        },
      },
      onChunk
    );
  }
}

// Singleton instance
export const ollamaService = new OllamaService();

// React hook for using Ollama
import { useState, useEffect, useCallback } from "react";

export interface UseOllamaOptions {
  autoConnect?: boolean;
  defaultModel?: string;
}

export const useOllama = (options: UseOllamaOptions = {}) => {
  const { autoConnect = true, defaultModel = "llama3.2:3b" } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check connection
  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const running = await ollamaService.isServerRunning();
      setIsConnected(running);

      if (running) {
        const modelList = await ollamaService.listModels();
        setModels(modelList);
        setError(null);
      } else {
        setError("Ollama server is not running");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate text
  const generate = useCallback(
    async (
      prompt: string,
      model: string = defaultModel,
      onChunk?: (chunk: string) => void
    ): Promise<string> => {
      if (!isConnected) {
        throw new Error("Not connected to Ollama server");
      }

      return ollamaService.generate(
        {
          model,
          prompt,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        },
        onChunk
      );
    },
    [isConnected, defaultModel]
  );

  // Generate Norwegian text
  const generateNorwegian = useCallback(
    async (
      prompt: string,
      onChunk?: (chunk: string) => void
    ): Promise<string> => {
      return ollamaService.generateNorwegian(prompt, defaultModel, onChunk);
    },
    [defaultModel]
  );

  // Pull model
  const pullModel = useCallback(
    async (
      modelName: string,
      onProgress?: (progress: string) => void
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        const result = await ollamaService.pullModel(modelName, onProgress);

        // Refresh model list
        await checkConnection();

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [checkConnection]
  );

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      checkConnection();
    }
  }, [autoConnect, checkConnection]);

  return {
    isConnected,
    models,
    isLoading,
    error,
    checkConnection,
    generate,
    generateNorwegian,
    pullModel,
    service: ollamaService,
  };
};

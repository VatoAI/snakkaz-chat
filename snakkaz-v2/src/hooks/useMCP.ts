import { useState, useEffect, useCallback } from 'react';
import { mcpClient } from '../lib/mcp-client';

interface MCPState {
  connected: boolean;
  tools: any[];
  resources: any[];
  loading: boolean;
  error: string | null;
}

export const useMCP = () => {
  const [state, setState] = useState<MCPState>({
    connected: false,
    tools: [],
    resources: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const checkConnection = () => {
      setState(prev => ({
        ...prev,
        connected: mcpClient.isConnected,
        loading: false
      }));
    };

    // Initial check
    checkConnection();

    // Set up interval to check connection status
    const interval = setInterval(checkConnection, 5000);

    // Load tools and resources when connected
    if (mcpClient.isConnected) {
      loadInitialData();
    }

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      const [tools, resources] = await Promise.all([
        mcpClient.listTools(),
        mcpClient.listResources()
      ]);

      setState(prev => ({
        ...prev,
        tools,
        resources,
        error: null
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const sendChatMessage = useCallback(async (message: string, context?: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await mcpClient.sendChatMessage(message, context);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, []);

  const getChatSuggestions = useCallback(async (context: string) => {
    try {
      return await mcpClient.getChatSuggestions(context);
    } catch (error: any) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }, []);

  const callTool = useCallback(async (name: string, arguments_: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await mcpClient.callTool(name, arguments_);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, []);

  const getSnakkazKnowledge = useCallback(async (query: string) => {
    try {
      return await mcpClient.getSnakkazKnowledge(query);
    } catch (error: any) {
      console.error('Failed to get SnakkaZ knowledge:', error);
      return {};
    }
  }, []);

  const analyzeNorwegianText = useCallback(async (text: string) => {
    try {
      return await mcpClient.analyzeNorwegianText(text);
    } catch (error: any) {
      console.error('Failed to analyze Norwegian text:', error);
      return {};
    }
  }, []);

  const translateToNorwegian = useCallback(async (text: string, fromLanguage = 'en') => {
    try {
      return await mcpClient.translateToNorwegian(text, fromLanguage);
    } catch (error: any) {
      console.error('Failed to translate to Norwegian:', error);
      return text;
    }
  }, []);

  return {
    ...state,
    sendChatMessage,
    getChatSuggestions,
    callTool,
    getSnakkazKnowledge,
    analyzeNorwegianText,
    translateToNorwegian,
    reconnect: () => mcpClient.connect(),
    disconnect: () => mcpClient.disconnect()
  };
};

export default useMCP;
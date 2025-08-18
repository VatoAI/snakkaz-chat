/**
 * SNAKKAZ CHAT - AI CHAT MED CLAUDE 3.5 SONNET
 * Juni 24, 2025 - Avansert AI chat-grensesnitt
 */

import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, RotateCcw, Download, Trash2, Settings, Zap } from 'lucide-react';
import { useClaude } from '../hooks/useClaude';
import { ClaudeConfig } from '../services/ai/optimizedClaudeService';

interface AIChatPageProps {
  className?: string;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ className = '' }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [claudeConfig, setClaudeConfig] = useState<Partial<ClaudeConfig>>({
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
    useMemory: true,
    norwegianOptimized: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isLoading,
    error,
    lastResponse,
    conversationHistory,
    totalCost,
    chat,
    quickChat,
    analyzeText,
    clearHistory,
    clearError,
    retryLastMessage,
    exportConversation
  } = useClaude(claudeConfig);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');

    try {
      await chat(message, claudeConfig);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSendMessage(formEvent);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInputMessage(prompt);
    await new Promise(resolve => setTimeout(resolve, 100)); // Let state update
    inputRef.current?.focus();
  };

  const quickPrompts = [
    "Hjelp meg med å forstå React hooks",
    "Forklar TypeScript interfaces på norsk",
    "Gi meg tips for god kodestruktur",
    "Hvordan optimaliserer jeg Supabase queries?",
    "Forklar end-to-end kryptering enkelt"
  ];

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Claude 3.5 Sonnet</h1>
              <p className="text-sm text-purple-300">AI-assistent for SnakkaZ Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Cost Display */}
            <div className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
              ${totalCost.usd.toFixed(4)} ({totalCost.nok} NOK)
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-all"
            >
              <Settings className="h-4 w-4 text-purple-300" />
            </button>

            {/* Clear History */}
            <button
              onClick={clearHistory}
              disabled={conversationHistory.length === 0}
              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-all disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 text-red-300" />
            </button>

            {/* Export */}
            <button
              onClick={() => {
                const conversation = exportConversation();
                const blob = new Blob([conversation], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `snakkaz-claude-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={conversationHistory.length === 0}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4 text-blue-300" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-3">Claude Konfiguration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-purple-300 mb-1">Model</label>
                <select
                  value={claudeConfig.model}
                  onChange={(e) => setClaudeConfig(prev => ({ 
                    ...prev, 
                    model: e.target.value as ClaudeConfig['model'] 
                  }))}
                  className="w-full bg-slate-600 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Best)</option>
                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Fast)</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus (Premium)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={claudeConfig.temperature}
                  onChange={(e) => setClaudeConfig(prev => ({ 
                    ...prev, 
                    temperature: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
                <span className="text-xs text-purple-300">{claudeConfig.temperature}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={claudeConfig.useMemory}
                  onChange={(e) => setClaudeConfig(prev => ({ 
                    ...prev, 
                    useMemory: e.target.checked 
                  }))}
                  className="rounded"
                />
                Bruk Memory System
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={claudeConfig.norwegianOptimized}
                  onChange={(e) => setClaudeConfig(prev => ({ 
                    ...prev, 
                    norwegianOptimized: e.target.checked 
                  }))}
                  className="rounded"
                />
                Norsk Optimalisering
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Hei! Jeg er Claude 3.5 Sonnet</h2>
            <p className="text-purple-300 mb-6 max-w-md mx-auto">
              Jeg er en avansert AI-assistent integrert i SnakkaZ Chat. 
              Jeg kan hjelpe deg med programmering, oversettelse, kreativ skriving og mye mer!
            </p>
            
            {/* Quick Prompts */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">Prøv disse spørsmålene:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left p-3 bg-purple-600/10 hover:bg-purple-600/20 rounded-lg text-sm text-purple-200 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700/70 text-white border border-purple-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    {message.timestamp && (
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString('no-NO')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/70 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-300">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={retryLastMessage}
                  className="text-red-300 hover:text-red-200 p-1"
                  title="Prøv igjen"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={clearError}
                  className="text-red-300 hover:text-red-200 p-1"
                  title="Lukk feilmelding"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-800/90 backdrop-blur-sm border-t border-purple-500/20">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv din melding til Claude her... (Enter = send, Shift+Enter = ny linje)"
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-400">
              {inputMessage.length}/4000
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:opacity-50 text-white p-3 rounded-lg transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <Zap className="h-3 w-3" />
              </>
            )}
          </button>
        </form>

        {/* Token/Cost Info */}
        {lastResponse && (
          <div className="mt-2 text-xs text-purple-300 flex justify-between">
            <span>
              Siste respons: {lastResponse.tokens.total} tokens 
              ({lastResponse.tokens.input} inn, {lastResponse.tokens.output} ut)
            </span>
            <span>
              Kostnad: ${lastResponse.cost.usd.toFixed(4)} ({lastResponse.cost.nok} NOK)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatPage;

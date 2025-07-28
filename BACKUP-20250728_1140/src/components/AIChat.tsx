import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import { captureError } from '../config/sentry';
import './AIChat.css';

interface AIChatProps {
  className?: string;
  placeholder?: string;
  showModelSelector?: boolean;
  enableStreaming?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({
  className = '',
  placeholder = 'Spør AI-assistenten...',
  showModelSelector = true,
  enableStreaming = true,
}) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearMessages, 
    regenerateLastMessage,
    isConfigured 
  } = useAIChat({
    model: selectedModel,
    systemPrompt: `Du er en avansert AI-assistent for Snakkaz Chat, en norsk teknologi-community platform. 
    Du hjelper brukere med tekniske spørsmål, programmering, og tech-relaterte diskusjoner. 
    Svar alltid på norsk med mindre brukeren spesifikt ber om en annet språk.
    Vær hjelpsom, presis og engasjerende i dine svar.`,
  });

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Rask)' },
    { id: 'gpt-4', name: 'GPT-4 (Avansert)' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (Balansert)' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isConfigured) return;

    const messageText = input.trim();
    setInput('');

    try {
      await sendMessage(messageText, enableStreaming);
    } catch (err) {
      captureError(err as Error, { 
        context: 'AI Chat Message Send',
        model: selectedModel,
        message: messageText 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('no-NO', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isConfigured) {
    return (
      <div className={`ai-chat-container ${className}`}>
        <div className="ai-chat-error">
          <h3>🤖 AI Chat ikke konfigurert</h3>
          <p>AI chat krever en gyldig OpenAI API-nøkkel.</p>
          <p>Legg til <code>VITE_OPENAI_API_KEY</code> i environment variablene.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-chat-container ${className}`}>
      <div className="ai-chat-header">
        <h3>🤖 AI Assistent</h3>
        {showModelSelector && (
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-selector"
            disabled={isLoading}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        )}
        <button 
          onClick={clearMessages} 
          className="clear-button"
          disabled={isLoading}
          title="Tøm chat"
        >
          🗑️
        </button>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && (
          <div className="ai-chat-welcome">
            <h4>Velkommen til AI Chat! 🎉</h4>
            <p>Jeg er din AI-assistent for Snakkaz Chat. Spør meg om:</p>
            <ul>
              <li>🔧 Tekniske problemløsninger</li>
              <li>💻 Programmering og kode</li>
              <li>🚀 Beste praksis for utvikling</li>
              <li>📚 Læringsressurser</li>
              <li>💡 Tech-relaterte spørsmål</li>
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-header">
              <span className="message-role">
                {message.role === 'user' ? '👤 Du' : '🤖 AI'}
              </span>
              <span className="message-time">
                {formatTimestamp(message.timestamp)}
              </span>
              {message.metadata && (
                <span className="message-metadata">
                  {message.metadata.model && (
                    <span className="model-badge">{message.metadata.model}</span>
                  )}
                  {message.metadata.responseTime && (
                    <span className="response-time">
                      {message.metadata.responseTime}ms
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-header">
              <span className="message-role">🤖 AI</span>
              <span className="message-time">Tenker...</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="message error">
            <div className="message-content">
              ❌ Feil: {error}
              <button 
                onClick={regenerateLastMessage}
                className="retry-button"
                disabled={isLoading}
              >
                🔄 Prøv igjen
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="ai-chat-input">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="message-input"
            disabled={isLoading}
            rows={1}
            style={{
              resize: 'none',
              minHeight: '40px',
              maxHeight: '120px',
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="send-button"
            title="Send melding (Enter)"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        <div className="input-footer">
          <span className="character-count">
            {input.length}/2000
          </span>
          {enableStreaming && (
            <span className="streaming-indicator">
              ⚡ Streaming aktivert
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

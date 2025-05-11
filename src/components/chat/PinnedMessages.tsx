/**
 * PinnedMessages Component
 * 
 * Displays pinned messages in chat interfaces (private, group, global)
 * with appropriate security handling and E2EE support.
 */

import React, { useState, useEffect } from 'react';
import { Pin, X, Lock, EyeOff, Copy, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { decryptMessage } from '@/utils/encryption/message-encryption';

// Types
interface PinnedMessage {
  id: string;
  sender_id: string;
  content: string;
  encrypted: boolean;
  sender_name?: string;
  timestamp: string;
  pinned_by: string;
  pinned_at: string;
  type: 'text' | 'image' | 'file' | 'link';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    previewUrl?: string;
    thumbnailUrl?: string;
  };
}

interface PinnedMessagesProps {
  chatId: string;
  chatType: 'private' | 'group' | 'global';
  encryptionKey?: string;
  className?: string;
  onUnpin?: (messageId: string) => void;
  canUnpin?: boolean;
}

export const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  chatId,
  chatType,
  encryptionKey,
  className = '',
  onUnpin,
  canUnpin = false
}) => {
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  // Fetch pinned messages when component mounts or chatId changes
  useEffect(() => {
    const fetchPinnedMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        let query;
        
        // Build query based on chat type
        switch (chatType) {
          case 'private':
            query = supabase
              .from('private_chat_messages')
              .select('id, sender_id, content, encrypted, timestamp, profiles(username), pinned_by, pinned_at, message_type, metadata')
              .eq('chat_id', chatId)
              .eq('pinned', true)
              .order('pinned_at', { ascending: false });
            break;
          case 'group':
            query = supabase
              .from('group_chat_messages')
              .select('id, sender_id, content, encrypted, timestamp, profiles(username), pinned_by, pinned_at, message_type, metadata')
              .eq('group_id', chatId)
              .eq('pinned', true)
              .order('pinned_at', { ascending: false });
            break;
          case 'global':
            query = supabase
              .from('global_chat_messages')
              .select('id, sender_id, content, encrypted, timestamp, profiles(username), pinned_by, pinned_at, message_type, metadata')
              .eq('pinned', true)
              .order('pinned_at', { ascending: false });
            break;
          default:
            throw new Error('Invalid chat type');
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          // Process the messages (decrypt if needed)
          const processedMessages = await Promise.all(
            data.map(async (msg) => {
              let content = msg.content;
              
              // Decrypt message if encrypted and we have the key
              if (msg.encrypted && encryptionKey) {
                try {
                  content = await decryptMessage(msg.content, encryptionKey);
                } catch (err) {
                  console.error('Failed to decrypt pinned message:', err);
                  content = '[Encrypted message]';
                }
              }

              return {
                id: msg.id,
                sender_id: msg.sender_id,
                content: content,
                encrypted: msg.encrypted,
                sender_name: msg.profiles?.username || 'Unknown user',
                timestamp: msg.timestamp,
                pinned_by: msg.pinned_by,
                pinned_at: msg.pinned_at,
                type: msg.message_type || 'text',
                metadata: msg.metadata
              };
            })
          );

          setPinnedMessages(processedMessages);
        }
      } catch (err) {
        console.error('Error fetching pinned messages:', err);
        setError('Failed to load pinned messages');
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchPinnedMessages();
    }
  }, [chatId, chatType, encryptionKey]);

  // Handle message unpinning
  const handleUnpin = async (messageId: string) => {
    if (!onUnpin) return;
    
    try {
      onUnpin(messageId);
      // Optimistically update UI
      setPinnedMessages(pinnedMessages.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Failed to unpin message:', err);
      setError('Failed to unpin message');
    }
  };

  // Toggle expanded message view
  const toggleExpand = (messageId: string) => {
    if (expandedMessageId === messageId) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(messageId);
    }
  };

  // Copy message content
  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Show feedback (could use a toast notification here)
        console.log('Message copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  // Render methods for different message types
  const renderMessageContent = (message: PinnedMessage) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative">
            <img 
              src={message.metadata?.previewUrl || message.content} 
              alt="Pinned image" 
              className="max-h-24 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.svg';
              }}
            />
            {message.encrypted && (
              <div className="absolute top-1 right-1">
                <Lock size={12} className="text-cybergold-400" />
              </div>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-cyberdark-700 p-2 rounded">
              📄
            </div>
            <span className="truncate max-w-[150px]">
              {message.metadata?.fileName || 'File attachment'}
            </span>
            {message.encrypted && <Lock size={12} className="text-cybergold-400" />}
          </div>
        );
      case 'link':
        return (
          <a 
            href={message.content} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyberblue-400 hover:text-cyberblue-300 truncate block max-w-[200px]"
          >
            {message.content}
          </a>
        );
      case 'text':
      default:
        return (
          <div className="truncate max-w-[200px]">
            {message.content}
            {message.encrypted && <Lock size={10} className="inline ml-1 text-cybergold-400" />}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-3 ${className}`}>
        <div className="animate-pulse flex space-x-2">
          <Pin size={16} className="text-cybergold-500/50" />
          <span className="text-sm text-cybergold-500/50">Loading pinned messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-3 text-red-400 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (pinnedMessages.length === 0) {
    return null; // Don't show anything if there are no pinned messages
  }

  return (
    <div className={`bg-cyberdark-850 border-b border-cyberdark-700 ${className}`}>
      <div className="flex items-center justify-between p-2 border-b border-cyberdark-700">
        <div className="flex items-center gap-2">
          <Pin size={14} className="text-cybergold-500" />
          <span className="text-xs font-medium text-cybergold-500">
            Pinned Messages ({pinnedMessages.length})
          </span>
        </div>
      </div>
      
      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-cyberdark-600">
        {pinnedMessages.map((message) => (
          <div 
            key={message.id}
            className={`
              p-2 border-b border-cyberdark-800 hover:bg-cyberdark-800 transition-colors
              ${expandedMessageId === message.id ? 'bg-cyberdark-800' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div 
                    className="flex items-center gap-1 cursor-pointer" 
                    onClick={() => toggleExpand(message.id)}
                  >
                    <span className="text-xs font-medium text-cybergold-400">
                      {message.sender_name}
                    </span>
                    <span className="text-[10px] text-cybergold-600">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-white mt-1">
                    {renderMessageContent(message)}
                  </div>
                </div>
              </div>
              
              {canUnpin && (
                <button
                  onClick={() => handleUnpin(message.id)}
                  className="text-cybergold-600 hover:text-cybergold-400 transition-colors"
                  title="Unpin message"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {expandedMessageId === message.id && (
              <div className="mt-2 pt-2 border-t border-cyberdark-700 animate-[fadeSlideIn_0.2s_ease-in-out]">
                <div className="text-xs text-white mb-1 break-words">
                  {message.content}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[10px] text-cybergold-600">
                    Pinned by {message.pinned_by || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyContent(message.content)}
                      className="text-cybergold-600 hover:text-cybergold-400 transition-colors"
                      title="Copy message"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      className="text-cybergold-600 hover:text-cybergold-400 transition-colors"
                      title="Share message"
                    >
                      <Share2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedMessages;

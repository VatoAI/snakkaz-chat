import React from 'react';
import { Shield, Zap } from 'lucide-react';

interface SnakkaZMessageBubbleProps {
    message: string;
    isOwn?: boolean;
    isEncrypted?: boolean;
    isMcpActive?: boolean;
    timestamp?: string;
    senderName?: string;
}

const SnakkaZMessageBubble: React.FC<SnakkaZMessageBubbleProps> = ({
    message,
    isOwn = false,
    isEncrypted = true,
    isMcpActive = false,
    timestamp,
    senderName
}) => {
    return (
        <div className={`snakkaz-message-container ${isOwn ? 'own' : 'received'}`}>
            {!isOwn && senderName && (
                <div className="snakkaz-sender-name">
                    {senderName}
                </div>
            )}

            <div className={`snakkaz-message ${isOwn ? 'own' : ''}`}>
                <div className="snakkaz-message-content">
                    {message}
                </div>

                <div className="snakkaz-message-meta">
                    <div className="snakkaz-security-indicators">
                        {isEncrypted && (
                            <Shield
                                size={14}
                                className="snakkaz-encryption-icon"
                                style={{ color: '#34C759' }}
                            />
                        )}
                        {isMcpActive && (
                            <Zap
                                size={14}
                                className="snakkaz-mcp-icon animate-pulse"
                                style={{ color: '#007AFF' }}
                            />
                        )}
                    </div>

                    {timestamp && (
                        <span className="snakkaz-timestamp">
                            {timestamp}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnakkaZMessageBubble;

import React from 'react';

interface UnifiedLoadingScreenProps {
    message?: string;
    subMessage?: string;
}

export const UnifiedLoadingScreen: React.FC<UnifiedLoadingScreenProps> = ({
    message = "Laster SnakkaZ...",
    subMessage = "Klargjør din chat-opplevelse"
}) => {
    return (
        <div className="snakkaz-loading">
            <div className="snakkaz-loading-content">
                <div className="snakkaz-spinner" />
                <h2>SnakkaZ</h2>
                <p>{message}</p>
                {subMessage && (
                    <p style={{
                        fontSize: '0.875rem',
                        opacity: 0.6,
                        marginTop: '0.5rem'
                    }}>
                        {subMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UnifiedLoadingScreen;

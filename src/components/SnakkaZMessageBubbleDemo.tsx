import React from 'react';
import SnakkaZMessageBubble from './SnakkaZMessageBubble';
import './SnakkaZMessageBubble.css';

const SnakkaZMessageBubbleDemo: React.FC = () => {
    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.98) 0%, rgba(25, 25, 35, 0.98) 100%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            <h2 style={{
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '20px'
            }}>
                SnakkaZ Meldingsbobler Demo 🎨
            </h2>

            {/* Received Message */}
            <SnakkaZMessageBubble
                message="Hei! Velkommen til SnakkaZ sikker chat 🇳🇴"
                senderName="Erik"
                isEncrypted={true}
                timestamp="14:32"
            />

            {/* Own Message */}
            <SnakkaZMessageBubble
                message="Takk! Dette er en fantastisk sikker plattform med liquid glass design ✨"
                isOwn={true}
                isEncrypted={true}
                isMcpActive={true}
                timestamp="14:33"
            />

            {/* MCP Active Message */}
            <SnakkaZMessageBubble
                message="AI-assistenten er nå tilkoblet via MCP-integrasjon 🤖"
                senderName="SnakkaZ System"
                isEncrypted={true}
                isMcpActive={true}
                timestamp="14:34"
            />

            {/* Long Message */}
            <SnakkaZMessageBubble
                message="Her er en lengre melding som viser hvordan meldingsboblene håndterer tekst som går over flere linjer. Liquid glass effekten og kryptering fungerer perfekt sammen med norsk eleganse og premium design. 🔒✨"
                isOwn={true}
                isEncrypted={true}
                timestamp="14:35"
            />

            <div style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                marginTop: '20px',
                textAlign: 'center'
            }}>
                🔒 End-to-end kryptert • ⚡ MCP AI-drevet • 🇳🇴 Norsk premium kvalitet
            </div>
        </div>
    );
};

export default SnakkaZMessageBubbleDemo;

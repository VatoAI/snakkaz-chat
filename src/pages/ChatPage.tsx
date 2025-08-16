import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import SpectacularChat from '../features/chat/components/SpectacularChat';
import ModernSpectacularChat from '../features/chat/components/ModernSpectacularChat';
import DefinitiveModernChat from '../features/chat/components/DefinitiveModernChat';
import FullScreenSnakkaZChat from '../features/chat/components/FullScreenSnakkaZChat';
import SuperAppleLiquidGlassChat from '../features/chat/components/SuperAppleLiquidGlassChat';
import '../styles/snakkaz-unified-design-system.css';

type ViewMode = 'legacy' | 'modern' | 'definitive' | 'fullscreen' | 'super-apple';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<ViewMode>('super-apple');
    
    // Allow demo mode without authentication
    const isDemoMode = location.pathname === '/demo';

    if (!user && !isDemoMode) {
        return (
            <div className="snakkaz-page snakkaz-flex snakkaz-flex-center">
                <div className="snakkaz-aurora-bg">
                    <div className="snakkaz-aurora-layer-1"></div>
                    <div className="snakkaz-aurora-layer-2"></div>
                </div>
                
                <div className="snakkaz-container snakkaz-text-center">
                    <h2 className="snakkaz-header-title">Ikke innlogget</h2>
                    <p className="snakkaz-header-subtitle">Du må logge inn for å bruke chatten.</p>
                    <a href="/login" className="snakkaz-button snakkaz-button-primary" style={{ marginTop: 'var(--snakkaz-space-lg)' }}>
                        🔑 Logg inn
                    </a>
                </div>
            </div>
        );
    }

    // For Apple mode, render with minimal overlay
    if (viewMode === 'super-apple') {
        return (
            <div className="snakkaz-page">
                {/* Floating Mode Selector for Apple Mode */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000
                }}>
                    <div className="snakkaz-nav" style={{ gap: 'var(--snakkaz-space-xs)' }}>
                        {[
                            { key: 'super-apple', label: '✨', title: 'Super Apple - Ultimate 2025 Apple-inspirert design' },
                            { key: 'fullscreen', label: '🚀', title: 'Fullscreen - Komplett immersive chat' },
                            { key: 'definitive', label: '🎨', title: 'Definitive - Moderne glassmorfisme' },
                            { key: 'modern', label: '💎', title: 'Modern - Avanserte chat bubbles' },
                            { key: 'legacy', label: '📱', title: 'Legacy - Original design' }
                        ].map(({ key, label, title }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key as ViewMode)}
                                className={`snakkaz-nav-item ${viewMode === key ? 'active' : ''}`}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: '8px'
                                }}
                                title={title}
                            >
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <SuperAppleLiquidGlassChat />
            </div>
        );
    }

    return (
        <div className="snakkaz-page">
            <div className="snakkaz-aurora-bg">
                <div className="snakkaz-aurora-layer-1"></div>
                <div className="snakkaz-aurora-layer-2"></div>
            </div>
            
            {/* View Mode Toggle */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000
            }}>
                <div className="snakkaz-nav">
                    <button
                        onClick={() => setViewMode('super-apple')}
                        className={`snakkaz-nav-item ${viewMode === 'super-apple' ? 'active' : ''}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        ✨ Super Apple
                    </button>
                    <button
                        onClick={() => setViewMode('fullscreen')}
                        className={`snakkaz-nav-item ${viewMode === 'fullscreen' ? 'active' : ''}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        🚀 Fullscreen
                    </button>
                    <button
                        onClick={() => setViewMode('definitive')}
                        className={`snakkaz-nav-item ${viewMode === 'definitive' ? 'active' : ''}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        🎨 Definitive
                    </button>
                    <button
                        onClick={() => setViewMode('modern')}
                        className={`snakkaz-nav-item ${viewMode === 'modern' ? 'active' : ''}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        💎 Modern
                    </button>
                    <button
                        onClick={() => setViewMode('legacy')}
                        className={`snakkaz-nav-item ${viewMode === 'legacy' ? 'active' : ''}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        📱 Legacy
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <div className="snakkaz-badge snakkaz-badge-success">
                    <span>👤</span>
                    {user?.email?.split('@')[0] || 'Bruker'}
                </div>
            </div>

            {/* Render selected chat component */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                {viewMode === 'fullscreen' && <FullScreenSnakkaZChat />}
                {viewMode === 'definitive' && <DefinitiveModernChat />}
                {viewMode === 'modern' && <ModernSpectacularChat />}
                {viewMode === 'legacy' && <SpectacularChat />}
            </div>
        </div>
    );
};

export default ChatPage;
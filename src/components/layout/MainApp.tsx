import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MainApp.css';

interface MainAppProps {
    children?: React.ReactNode;
}

const MainApp: React.FC<MainAppProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'dashboard';
        if (path.includes('/chat')) return 'chat';
        if (path.includes('/profile')) return 'profile';
        if (path.includes('/settings')) return 'settings';
        return 'dashboard';
    });

    const tabs = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: '🏠',
            path: '/dashboard'
        },
        {
            id: 'chat',
            name: 'Chat',
            icon: '💬',
            path: '/chat'
        },
        {
            id: 'profile',
            name: 'Profil',
            icon: '👤',
            path: '/profile'
        },
        {
            id: 'settings',
            name: 'Innstillinger',
            icon: '⚙️',
            path: '/settings'
        }
    ];

    const handleTabChange = (tabId: string, path: string) => {
        setActiveTab(tabId);
        navigate(path);
    };

    return (
        <div className="main-app">
            {/* Header */}
            <header className="main-app-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src="/logos/snakkaz-logo.png" alt="SnakkaZ" className="app-logo" />
                        <h1>SnakkaZ</h1>
                    </div>
                    <div className="header-actions">
                        <div className="status-indicator online">
                            <span className="status-dot"></span>
                            Online
                        </div>
                        <button className="notification-btn">
                            🔔
                            <span className="notification-badge">3</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id, tab.path)}
                    >
                        <span className="nav-icon">{tab.icon}</span>
                        <span className="nav-label">{tab.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default MainApp;

import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { UnifiedHeader } from './UnifiedHeader';
import { MobileMenu } from '@/components/mobile/MobileMenu';
import { useIsMobile } from '@/core/hooks/use-mobile';
import './MainApp.css';

interface MainAppProps {
    children?: React.ReactNode;
}

const MainApp: React.FC<MainAppProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="main-app min-h-screen bg-cyberdark-950">
            {/* Unified Header */}
            <UnifiedHeader 
                title="SnakkaZ"
                showSearch={true}
                showNotifications={true}
                onMobileMenuToggle={() => setShowMobileMenu(true)}
            />

            {/* Main Content */}
            <main className="main-content">
                {children || <Outlet />}
            </main>

            {/* Mobile Menu */}
            {isMobile && (
                <MobileMenu 
                    isOpen={showMobileMenu} 
                    setIsOpen={setShowMobileMenu} 
                />
            )}
        </div>
    );
};

export default MainApp;

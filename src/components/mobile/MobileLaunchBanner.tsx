import React, { useState, useEffect } from 'react';
import { pwaManager } from '../../utils/pwaManager';

// Simple icons as text/unicode
const icons = {
  Download: () => <span className="text-2xl">📱</span>,
  Bell: () => <span className="text-2xl">🔔</span>,
  Share2: () => <span className="text-2xl">📤</span>,
  Shield: () => <span className="text-sm">🛡️</span>,
  Zap: () => <span className="text-sm">⚡</span>,
  Users: () => <span className="text-sm">👥</span>
};

export const MobileLaunchBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Simple toast function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const steps = [
    {
      icon: icons.Download,
      title: "Last ned SnakkaZ",
      description: "Installer som app på hjemskjermen",
      action: "installer",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: icons.Bell,
      title: "Aktiver varsler",
      description: "Få push-notifikasjoner for nye meldinger",
      action: "notifications",
      color: "from-green-500 to-green-600"
    },
    {
      icon: icons.Share2,
      title: "Inviter venner",
      description: "Del din invitasjonskode og få bonuser",
      action: "share",
      color: "from-purple-500 to-purple-600"
    }
  ];

  useEffect(() => {
    // Show banner after 3 seconds if user hasn't interacted
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsVisible(true);
      }
    }, 3000);

    // Cycle through steps every 4 seconds
    const stepTimer = setInterval(() => {
      if (isVisible) {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(stepTimer);
    };
  }, [hasInteracted, isVisible]);

  const handleAction = async (action: string) => {
    setHasInteracted(true);
    
    switch (action) {
      case 'installer':
        const installed = await pwaManager.installPWA();
        if (installed) {
          setIsVisible(false);
        }
        break;
        
      case 'notifications':
        const granted = await pwaManager.requestNotificationPermission();
        if (granted) {
          showToast('🔔 Notifikasjoner aktivert!', 'success');
        }
        break;
        
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'SnakkaZ Beta - Sikker Chat',
            text: 'Sjekk ut SnakkaZ Beta - fremtidens chat-plattform!',
            url: window.location.origin + '?ref=' + Date.now()
          });
        } else {
          navigator.clipboard.writeText(window.location.origin + '?ref=' + Date.now());
          showToast('📋 Link kopiert!', 'success');
        }
        break;
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className={`bg-gradient-to-r ${currentStepData.color} rounded-2xl p-4 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-300`}>
        <div className="flex items-center justify-between text-white">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-white/70 hover:text-white p-1"
          >
            ✕
          </button>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-white/20 p-3 rounded-full transition-transform duration-500">
              <IconComponent />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg">{currentStepData.title}</h3>
              <p className="text-sm opacity-90">{currentStepData.description}</p>
            </div>
          </div>
          
          <button
            onClick={() => handleAction(currentStepData.action)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors ml-3"
          >
            {currentStepData.action === 'installer' && 'Installer'}
            {currentStepData.action === 'notifications' && 'Aktiver'}
            {currentStepData.action === 'share' && 'Del'}
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 bg-white rounded-full cursor-pointer transition-all duration-300 ${
                index === currentStep ? 'scale-125 opacity-100' : 'opacity-50'
              }`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
        
        {/* Feature highlights */}
        <div className="mt-3 bg-black/80 backdrop-blur-sm rounded-xl p-3 transition-all duration-500">
          <div className="flex justify-between text-white text-xs">
            <div className="flex items-center space-x-1">
              <icons.Shield />
              <span>End-to-end kryptert</span>
            </div>
            <div className="flex items-center space-x-1">
              <icons.Zap />
              <span>AI-assistert</span>
            </div>
            <div className="flex items-center space-x-1">
              <icons.Users />
              <span>Sosial deling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLaunchBanner;

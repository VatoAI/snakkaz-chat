import React from 'react';
import '../styles/professional-glass.css';

interface ProfessionalGlassCardProps {
  children: React.ReactNode;
  className?: string;
  type?: 'default' | 'premium' | 'message';
}

export const ProfessionalGlassCard: React.FC<ProfessionalGlassCardProps> = ({ 
  children, 
  className = '', 
  type = 'default' 
}) => {
  const getGlassClass = () => {
    switch (type) {
      case 'premium': return 'glass-premium';
      case 'message': return 'glass-message';
      default: return 'professional-glass';
    }
  };

  return (
    <div className={`${getGlassClass()} ${className}`}>
      {children}
    </div>
  );
};

interface GlassCTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const GlassCTAButton: React.FC<GlassCTAButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}) => {
  return (
    <button 
      className={`glass-cta ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const LiquidBackground: React.FC = () => {
  return <div className="liquid-background" />;
};

// 🎯 PSYCHOLOGY-BASED COMPONENT EXAMPLES
export const ConversionHero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <LiquidBackground />
      
      <ProfessionalGlassCard className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          SnakkaZ Chat
          <span className="block text-2xl md:text-3xl text-blue-400 mt-2">
            Den nye standarden for norsk tech
          </span>
        </h1>
        
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Opplev fremtidens chat-plattform med liquid glass design, 
          real-time messaging og privacy-first approach som norske 
          developers fortjener.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GlassCTAButton className="text-lg px-8 py-4">
            🚀 Start Gratis Beta
          </GlassCTAButton>
          
          <button className="glass-cta bg-gradient-to-r from-purple-600 to-blue-600 text-lg px-8 py-4">
            💎 Se Demo
          </button>
        </div>
        
        <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-400">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            100% Norsk
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Privacy First
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Real-time
          </span>
        </div>
      </ProfessionalGlassCard>
    </div>
  );
};

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: '💬',
      title: 'Real-time Chat',
      description: 'Øyeblikkelig messaging med liquid glass effekter'
    },
    {
      icon: '🔐',
      title: 'Privacy First',
      description: 'End-to-end kryptering som standard'
    },
    {
      icon: '🇳🇴',
      title: 'Norsk Tech Community',
      description: 'Bygget av og for norske developers'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {features.map((feature, index) => (
        <ProfessionalGlassCard 
          key={index} 
          type="premium" 
          className="text-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
          <p className="text-gray-300 leading-relaxed">{feature.description}</p>
        </ProfessionalGlassCard>
      ))}
    </div>
  );
};

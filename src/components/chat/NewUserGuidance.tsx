import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap,
  HelpCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewUserGuidanceProps {
  onStartFirstChat: () => void;
  onViewUserDirectory: () => void;
  onDismiss: () => void;
  userName?: string;
}

/**
 * Enhanced guidance component for new users to help them get started with Snakkaz Chat
 * Provides contextual tips, quick actions, and encouragement to engage with the platform
 */
export const NewUserGuidance: React.FC<NewUserGuidanceProps> = ({
  onStartFirstChat,
  onViewUserDirectory,
  onDismiss,
  userName = 'friend'
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tips = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Start din første samtale",
      description: "Finn noen å snakke med og send din første melding",
      action: onStartFirstChat,
      actionText: "Start chat",
      highlight: true
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Utforsk brukerfellesskapet",
      description: "Se hvem andre som er aktive og tilgjengelige for chat",
      action: onViewUserDirectory,
      actionText: "Se brukere",
      highlight: false
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Sikkerhet først",
      description: "Alle samtaler er kryptert for din beskyttelse",
      action: () => console.log('Security info'),
      actionText: "Lær mer",
      highlight: false
    }
  ];

  const quickActions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Ny samtale",
      onClick: onStartFirstChat,
      variant: "primary" as const
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Finn brukere",
      onClick: onViewUserDirectory,
      variant: "secondary" as const
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [tips.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4 p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-6"
      >
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-cybergold-400" />
          <h2 className="text-2xl font-bold text-cybergold-300">
            Velkommen til Snakkaz, {userName}!
          </h2>
          <Sparkles className="h-6 w-6 text-cybergold-400" />
        </div>
        <p className="text-cybergold-400">
          La oss hjelpe deg å komme i gang med sikker meldingsbehandling
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 justify-center mb-6"
      >
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant === "primary" ? "default" : "outline"}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
              ${action.variant === "primary" 
                ? "bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-900 shadow-lg hover:shadow-cybergold-500/25" 
                : "border-cybergold-500/30 text-cybergold-300 hover:border-cybergold-500/50 hover:bg-cybergold-500/10"
              }
            `}
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}
      </motion.div>

      {/* Interactive Tips Carousel */}
      <Card className="bg-cyberdark-800/50 border-cybergold-500/20 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-cybergold-300 flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Tips for å komme i gang</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cybergold-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${tips[currentTip].highlight 
                    ? "bg-cybergold-500/20 text-cybergold-400" 
                    : "bg-cyberdark-700 text-cybergold-500"
                  }
                `}>
                  {tips[currentTip].icon}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-cybergold-300">
                    {tips[currentTip].title}
                  </h4>
                  <p className="text-cybergold-400 text-sm leading-relaxed">
                    {tips[currentTip].description}
                  </p>
                  <Button
                    onClick={tips[currentTip].action}
                    variant="ghost"
                    size="sm"
                    className={`
                      mt-2 px-3 py-1 rounded-md transition-all duration-200
                      ${tips[currentTip].highlight
                        ? "bg-cybergold-500/10 text-cybergold-300 hover:bg-cybergold-500/20 border border-cybergold-500/30"
                        : "text-cybergold-400 hover:text-cybergold-300 hover:bg-cybergold-500/10"
                      }
                    `}
                  >
                    {tips[currentTip].actionText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Tip Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === currentTip 
                    ? "bg-cybergold-400 w-6" 
                    : "bg-cybergold-600/30 hover:bg-cybergold-500/50"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Security & Features Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: <Shield className="h-5 w-5" />,
            title: "Ende-til-ende kryptering",
            description: "Dine meldinger er alltid sikre"
          },
          {
            icon: <Zap className="h-5 w-5" />,
            title: "Sanntid meldinger",
            description: "Øyeblikkelig levering og respons"
          },
          {
            icon: <Users className="h-5 w-5" />,
            title: "Gruppe samtaler",
            description: "Chat med venner og kolleger"
          }
        ].map((feature, index) => (
          <Card key={index} className="bg-cyberdark-800/30 border-cybergold-500/20 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cybergold-500/10 flex items-center justify-center text-cybergold-400">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-cybergold-300 text-sm">
                  {feature.title}
                </h4>
                <p className="text-cybergold-500 text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Encouraging Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-4"
      >
        <p className="text-cybergold-400 text-sm mb-3">
          Klar til å begynne? Start din første samtale!
        </p>
        <Button
          onClick={onStartFirstChat}
          className="bg-gradient-to-r from-cybergold-500 to-cybergold-600 hover:from-cybergold-600 hover:to-cybergold-700 text-cyberdark-900 font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-cybergold-500/25 transition-all duration-200"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Start min første chat
        </Button>
      </motion.div>
    </div>
  );
};

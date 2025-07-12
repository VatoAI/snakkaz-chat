import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Plus, 
  ArrowRight, 
  Star,
  Shield,
  Zap,
  Coffee,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnhancedChatEmptyStateProps {
  onStartNewChat: () => void;
  onViewDirectory: () => void;
  isNewUser?: boolean;
  userName?: string;
}

/**
 * Enhanced empty state component that provides helpful guidance and encourages user engagement
 * Adapts content based on whether the user is new or returning
 */
export const EnhancedChatEmptyState: React.FC<EnhancedChatEmptyStateProps> = ({
  onStartNewChat,
  onViewDirectory,
  isNewUser = false,
  userName = 'friend'
}) => {
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  const suggestions = isNewUser ? [
    {
      icon: <Plus className="h-5 w-5" />,
      title: "Start din første samtale",
      description: "Finn noen interessant og send din første melding",
      action: onStartNewChat,
      actionText: "Opprett samtale",
      color: "from-cybergold-500 to-cybergold-600",
      badge: "Anbefalt"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Oppdag fellesskapet",
      description: "Se hvem som er online og tilgjengelig for chat",
      action: onViewDirectory,
      actionText: "Utforsk brukere",
      color: "from-blue-500 to-blue-600",
      badge: "Populært"
    }
  ] : [
    {
      icon: <Plus className="h-5 w-5" />,
      title: "Start en ny samtale",
      description: "Få kontakt med noen eller opprett en gruppesamtale",
      action: onStartNewChat,
      actionText: "Ny samtale",
      color: "from-cybergold-500 to-cybergold-600",
      badge: null
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Finn aktive brukere",
      description: "Se hvem som er tilgjengelig for chat akkurat nå",
      action: onViewDirectory,
      actionText: "Se brukere",
      color: "from-purple-500 to-purple-600",
      badge: null
    }
  ];

  const features = [
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Ende-til-ende kryptering",
      description: "Sikre meldinger"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Sanntid levering",
      description: "Øyeblikkelig respons"
    },
    {
      icon: <Coffee className="h-4 w-4" />,
      title: "Alltid tilgjengelig",
      description: "Chat når som helst"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px]">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cybergold-500/20 to-cybergold-600/20 flex items-center justify-center mb-4 relative"
            >
              <MessageSquare className="h-10 w-10 text-cybergold-400" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cybergold-500/30"
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.1), transparent)`
                }}
              />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-cybergold-300">
            {isNewUser ? `Hei ${userName}! 👋` : 'Ingen aktive samtaler'}
          </h2>
          
          <p className="text-cybergold-400 text-lg leading-relaxed">
            {isNewUser 
              ? "Velkommen til Snakkaz! La oss få deg koblet til fellesskapet vårt."
              : "Du har ingen pågående samtaler. Tid for å starte noen nye forbindelser!"
            }
          </p>
          
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 text-cybergold-500"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Din reise med sikker meldingsbehandling begynner her</span>
              <Sparkles className="h-4 w-4" />
            </motion.div>
          )}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              onHoverStart={() => setHoveredAction(index)}
              onHoverEnd={() => setHoveredAction(null)}
            >
              <Card className="relative overflow-hidden bg-cyberdark-800/50 border-cybergold-500/20 backdrop-blur-sm h-full">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${suggestion.color} 
                      flex items-center justify-center text-white shadow-lg
                      ${hoveredAction === index ? 'shadow-xl' : ''}
                    `}>
                      {suggestion.icon}
                    </div>
                    {suggestion.badge && (
                      <Badge 
                        variant="secondary" 
                        className="bg-cybergold-500/10 text-cybergold-400 border-cybergold-500/30"
                      >
                        {suggestion.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-cybergold-300">
                      {suggestion.title}
                    </h3>
                    <p className="text-cybergold-400 text-sm leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={suggestion.action}
                    className={`
                      w-full bg-gradient-to-r ${suggestion.color} 
                      hover:shadow-lg text-white font-medium
                      transition-all duration-200
                      ${hoveredAction === index ? 'shadow-lg translate-y-[-1px]' : ''}
                    `}
                  >
                    {suggestion.actionText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                {/* Animated background effect */}
                {hoveredAction === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-cybergold-500/5 to-transparent pointer-events-none"
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-cyberdark-800/30 border border-cybergold-500/20 rounded-xl p-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-cybergold-300 mb-2">
              Hvorfor velge Snakkaz?
            </h3>
            <p className="text-cybergold-500 text-sm">
              Sikker, rask og brukervennlig meldingsbehandling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-cyberdark-900/50"
              >
                <div className="w-8 h-8 rounded-lg bg-cybergold-500/10 flex items-center justify-center text-cybergold-400">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-cybergold-300 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-cybergold-500 text-xs">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Encouraging Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center space-x-2 text-cybergold-400">
            <Star className="h-4 w-4" />
            <span className="text-sm">
              {isNewUser 
                ? "Tusenvis av sikre samtaler skjer hver dag på Snakkaz"
                : "Hva venter du på? Start en samtale nå!"
              }
            </span>
            <Star className="h-4 w-4" />
          </div>
          
          {!isNewUser && (
            <Button
              onClick={onStartNewChat}
              variant="outline"
              className="border-cybergold-500/30 text-cybergold-300 hover:border-cybergold-500/50 hover:bg-cybergold-500/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett ny samtale
            </Button>
          )}
        </motion.div>
        
      </div>
    </div>
  );
};

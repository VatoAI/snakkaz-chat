import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  MessageSquare, 
  Shield, 
  Users, 
  Settings,
  ArrowRight,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContextualHelpProps {
  currentPage: 'chat' | 'profile' | 'settings' | 'premium';
  isVisible: boolean;
  onClose: () => void;
  onComplete?: () => void;
  userProgress?: {
    hasCreatedFirstChat: boolean;
    hasViewedDirectory: boolean;
    hasConfiguredProfile: boolean;
    totalChats: number;
  };
}

/**
 * Contextual help system that provides relevant tips and guidance based on the current page
 * and user progress through the application
 */
export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  currentPage,
  isVisible,
  onClose,
  onComplete,
  userProgress = {
    hasCreatedFirstChat: false,
    hasViewedDirectory: false,
    hasConfiguredProfile: false,
    totalChats: 0
  }
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());

  const getPageTips = () => {
    switch (currentPage) {
      case 'chat':
        return [
          {
            id: 'chat-start',
            icon: <MessageSquare className="h-5 w-5" />,
            title: "Start din første samtale",
            description: "Klikk på 'Ny samtale' knappen for å finne noen å snakke med. Du kan søke etter brukernavn eller bla gjennom aktive brukere.",
            action: "Opprett samtale",
            isCompleted: userProgress.hasCreatedFirstChat,
            priority: 'high'
          },
          {
            id: 'chat-security',
            icon: <Shield className="h-5 w-5" />,
            title: "Forstå sikkerhetsnivåer",
            description: "Snakkaz tilbyr forskjellige sikkerhetsnivåer. Grønn indikerer ende-til-ende kryptering med direkte tilkobling.",
            action: "Lær mer",
            isCompleted: userProgress.totalChats > 0,
            priority: 'medium'
          },
          {
            id: 'chat-directory',
            icon: <Users className="h-5 w-5" />,
            title: "Utforsk brukerfellesskapet",
            description: "Se hvem som er online og tilgjengelig. Du kan filtrere etter interesser og tilgjengelighet.",
            action: "Se brukere",
            isCompleted: userProgress.hasViewedDirectory,
            priority: 'medium'
          }
        ];
      
      case 'profile':
        return [
          {
            id: 'profile-setup',
            icon: <Settings className="h-5 w-5" />,
            title: "Fullfør profilen din",
            description: "En komplett profil hjelper andre å finne deg og starter bedre samtaler. Legg til et profilbilde og beskrivelse.",
            action: "Rediger profil",
            isCompleted: userProgress.hasConfiguredProfile,
            priority: 'high'
          },
          {
            id: 'profile-privacy',
            icon: <Shield className="h-5 w-5" />,
            title: "Personverninnstillinger",
            description: "Kontroller hvem som kan se profilen din og kontakte deg. Du kan justere synlighet og tilgjengelighet.",
            action: "Åpne innstillinger",
            isCompleted: false,
            priority: 'medium'
          }
        ];
      
      case 'settings':
        return [
          {
            id: 'settings-notifications',
            icon: <MessageSquare className="h-5 w-5" />,
            title: "Konfigurer varsler",
            description: "Tilpass når og hvordan du får varsler om nye meldinger. Du kan sette forskjellige innstillinger for hver samtale.",
            action: "Åpne varsler",
            isCompleted: false,
            priority: 'medium'
          },
          {
            id: 'settings-security',
            icon: <Shield className="h-5 w-5" />,
            title: "Sikkerhetspreferanser",
            description: "Velg standard sikkerhetsnivå for nye samtaler og aktiver ekstra sikkerhetsfunksjoner.",
            action: "Sikkerhet",
            isCompleted: false,
            priority: 'high'
          }
        ];
      
      case 'premium':
        return [
          {
            id: 'premium-features',
            icon: <Lightbulb className="h-5 w-5" />,
            title: "Premium funksjoner",
            description: "Oppgrader for avanserte funksjoner som større fillagring, tilpassede temaer og prioritert support.",
            action: "Se planer",
            isCompleted: false,
            priority: 'low'
          }
        ];
      
      default:
        return [];
    }
  };

  const tips = getPageTips();
  const currentTip = tips[currentTipIndex];

  useEffect(() => {
    if (isVisible && tips.length > 0) {
      setCurrentTipIndex(0);
      setCompletedTips(new Set(tips.filter(tip => tip.isCompleted).map((_, index) => index)));
    }
  }, [isVisible, currentPage, tips.length]);

  const handleNext = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(prev => prev - 1);
    }
  };

  const handleMarkCompleted = () => {
    setCompletedTips(prev => new Set([...prev, currentTipIndex]));
    setTimeout(handleNext, 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-cybergold-500 to-cybergold-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { text: 'Viktig', className: 'bg-red-500/10 text-red-400 border-red-500/30' };
      case 'medium': return { text: 'Anbefalt', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
      case 'low': return { text: 'Valgfritt', className: 'bg-green-500/10 text-green-400 border-green-500/30' };
      default: return { text: 'Info', className: 'bg-cybergold-500/10 text-cybergold-400 border-cybergold-500/30' };
    }
  };

  if (!isVisible || tips.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <Card className="bg-cyberdark-800 border-cybergold-500/30 shadow-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cybergold-500/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-cybergold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cybergold-300">
                      Kontekstuel hjelp
                    </h3>
                    <p className="text-sm text-cybergold-500">
                      {currentTipIndex + 1} av {tips.length} tips
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-cybergold-400 hover:text-cybergold-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex space-x-2 mb-2">
                  {tips.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        h-2 flex-1 rounded-full transition-all duration-300
                        ${index <= currentTipIndex 
                          ? 'bg-cybergold-400' 
                          : 'bg-cybergold-800/30'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Current Tip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTipIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${getPriorityColor(currentTip.priority)}
                      flex items-center justify-center text-white shadow-lg
                    `}>
                      {currentTip.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xl font-semibold text-cybergold-300">
                          {currentTip.title}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={getPriorityBadge(currentTip.priority).className}
                        >
                          {getPriorityBadge(currentTip.priority).text}
                        </Badge>
                        {currentTip.isCompleted && (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Fullført
                          </Badge>
                        )}
                      </div>
                      <p className="text-cybergold-400 leading-relaxed">
                        {currentTip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-cybergold-500/20">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentTipIndex === 0}
                  className="text-cybergold-400 hover:text-cybergold-300 disabled:opacity-50"
                >
                  Forrige
                </Button>

                <div className="flex space-x-2">
                  {!currentTip.isCompleted && (
                    <Button
                      variant="outline"
                      onClick={handleMarkCompleted}
                      className="border-cybergold-500/30 text-cybergold-300 hover:border-cybergold-500/50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marker som fullført
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    className="bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-900"
                  >
                    {currentTipIndex === tips.length - 1 ? 'Ferdig' : 'Neste'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Code, 
  Lightbulb, 
  FileText, 
  BookOpen, 
  Zap,
  ChevronDown,
  Bot,
  Briefcase,
  Search
} from 'lucide-react';

export interface ChatMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  systemPrompt: string;
  color: string;
  isPremium?: boolean;
}

interface ChatModeSelectorProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  disabled?: boolean;
}

const defaultModes: ChatMode[] = [
  {
    id: 'general',
    name: 'Generell chat',
    description: 'Alminnelig samtale og spørsmål',
    icon: <MessageSquare className="h-4 w-4" />,
    systemPrompt: 'Du er en hjelpsom AI-assistent som svarer på norsk. Vær vennlig og informativ.',
    color: 'bg-blue-500',
  },
  {
    id: 'coding',
    name: 'Kodehjelp',
    description: 'Programmering og teknisk hjelp',
    icon: <Code className="h-4 w-4" />,
    systemPrompt: 'Du er en ekspert programmeringshjelper. Fokuser på kode, beste praksis og tekniske løsninger. Svar på norsk, men bruk engelske tekniske termer.',
    color: 'bg-green-500',
  },
  {
    id: 'creative',
    name: 'Kreativ skriving',
    description: 'Ideoppfyllning og kreativt innhold',
    icon: <Lightbulb className="h-4 w-4" />,
    systemPrompt: 'Du er en kreativ skrivehjelper. Hjelp med ideer, fortellinger og kreativt innhold. Vær inspirerende og fantasifull, men svar på norsk.',
    color: 'bg-purple-500',
  },
  {
    id: 'business',
    name: 'Forretningsrådgivning',
    description: 'Forretningsanalyse og strategi',
    icon: <Briefcase className="h-4 w-4" />,
    systemPrompt: 'Du er en forretningsrådgiver med fokus på norsk marked. Gi strategiske råd, markedsanalyse og forretningsinnsikt.',
    color: 'bg-orange-500',
    isPremium: true,
  },
  {
    id: 'research',
    name: 'Forskning og analyse',
    description: 'Dybdeanalyse og informasjonsinnhenting',
    icon: <Search className="h-4 w-4" />,
    systemPrompt: 'Du er en forskningsassistent. Fokuser på faktisk informasjon, kilder og dybdeanalyse. Vær grundig og objektiv.',
    color: 'bg-teal-500',
    isPremium: true,
  },
  {
    id: 'learning',
    name: 'Læring og utdanning',
    description: 'Pedagogisk hjelp og forklaringer',
    icon: <BookOpen className="h-4 w-4" />,
    systemPrompt: 'Du er en lærer og mentor. Forklar konsepter på en pedagogisk måte, bruk eksempler og tilpass nivået til brukeren.',
    color: 'bg-indigo-500',
  },
  {
    id: 'documentation',
    name: 'Dokumentasjon',
    description: 'Teknisk skriving og dokumentasjon',
    icon: <FileText className="h-4 w-4" />,
    systemPrompt: 'Du er en teknisk skribent. Hjelp med dokumentasjon, API-beskrivelser, brukerguider og tekniske spesifikasjoner.',
    color: 'bg-gray-500',
  },
  {
    id: 'quick',
    name: 'Hurtigsvar',
    description: 'Korte, presise svar',
    icon: <Zap className="h-4 w-4" />,
    systemPrompt: 'Gi korte, presise svar uten unødvendige forklaringer. Vær direkte og effektiv.',
    color: 'bg-yellow-500',
  }
];

export const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  disabled = false
}) => {
  const { toast } = useToast();
  const [customModes, setCustomModes] = useState<ChatMode[]>([]);

  // Load custom modes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('custom_chat_modes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomModes(parsed);
      } catch (error) {
        console.error('Error parsing custom modes:', error);
      }
    }
  }, []);

  const allModes = [...defaultModes, ...customModes];

  const handleModeSelect = (mode: ChatMode) => {
    if (mode.isPremium) {
      // Check if user has premium access
      const userPremium = localStorage.getItem('user_premium') === 'true';
      if (!userPremium) {
        toast({
          title: "Premium-funksjon",
          description: "Denne chatmodus krever Premium-tilgang",
          variant: "destructive",
        });
        return;
      }
    }

    onModeChange(mode);
    toast({
      title: "Chatmodus endret",
      description: `Byttet til: ${mode.name}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="bg-cyberdark-800 border-cybergold-500/40 text-cybergold-300 hover:bg-cyberdark-700 flex items-center gap-2"
        >
          <div className={`w-3 h-3 rounded-full ${selectedMode.color}`} />
          {selectedMode.icon}
          <span className="hidden sm:inline">{selectedMode.name}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
          {selectedMode.isPremium && (
            <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
              Premium
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-cyberdark-900 border-cybergold-500/40"
        align="start"
      >
        <DropdownMenuLabel className="text-cybergold-400 flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Velg chatmodus
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-cybergold-500/20" />
        
        {allModes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => handleModeSelect(mode)}
            className="text-cybergold-300 hover:bg-cyberdark-800 cursor-pointer p-3"
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`w-3 h-3 rounded-full ${mode.color} mt-1 flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-medium">{mode.name}</span>
                  {mode.isPremium && (
                    <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                      Premium
                    </Badge>
                  )}
                  {selectedMode.id === mode.id && (
                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                      Valgt
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-cybergold-600 mt-1">{mode.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        {customModes.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-cybergold-500/20" />
            <DropdownMenuLabel className="text-cybergold-400 text-xs">
              Egendefinerte moduser
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Hook for managing chat mode state
export const useChatMode = () => {
  const [currentMode, setCurrentMode] = useState<ChatMode>(defaultModes[0]);

  useEffect(() => {
    const saved = localStorage.getItem('selected_chat_mode');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentMode(parsed);
      } catch (error) {
        console.error('Error parsing saved chat mode:', error);
      }
    }
  }, []);

  const changeMode = (mode: ChatMode) => {
    setCurrentMode(mode);
    localStorage.setItem('selected_chat_mode', JSON.stringify(mode));
  };

  return {
    currentMode,
    changeMode,
    defaultModes
  };
};
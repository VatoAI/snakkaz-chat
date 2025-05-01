import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Key } from 'lucide-react';

interface FirstTimeUserWelcomeProps {
  username?: string;
  onClose: () => void;
}

const FirstTimeUserWelcome: React.FC<FirstTimeUserWelcomeProps> = ({ username = 'bruker', onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Velkommen til Snakkaz Chat!',
      description: `Hei, ${username}! Vi er glade for å ha deg med oss. Snakkaz Chat er en sikker kommunikasjonsplattform designet med personvern og sikkerhet i fokus.`,
      icon: <Shield className="h-12 w-12 text-cybergold-400" />
    },
    {
      title: 'Sikkerhet i fokus',
      description: 'Alle meldinger i Snakkaz er beskyttet med ende-til-ende kryptering. Dette betyr at bare du og den du kommuniserer med kan lese meldingene - ingen andre, ikke engang vi.',
      icon: <Lock className="h-12 w-12 text-cybergold-400" />
    },
    {
      title: 'Kom i gang',
      description: 'Du kan nå starte med å utforske appen, legge til venner, og opprette gruppechatter. Velg mellom direktemeldinger, gruppechat eller den AI-drevne assistenten.',
      icon: <Key className="h-12 w-12 text-cybergold-400" />
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-2xl text-center text-cybergold-300">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-cybergold-500 text-center pt-4">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 w-2 rounded-full ${currentStep === index ? 'bg-cybergold-500' : 'bg-cybergold-500/30'}`}
              />
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-cybergold-600 text-black hover:bg-cybergold-500" 
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? 'Neste' : 'Kom i gang'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserWelcome;
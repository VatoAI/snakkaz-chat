import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Shield, MessageSquare, Users, FileText, ShoppingBag, ChevronRight, CheckCircle } from 'lucide-react';

interface FirstTimeUserWelcomeProps {
  username: string;
  onClose: () => void;
}

const FirstTimeUserWelcome: React.FC<FirstTimeUserWelcomeProps> = ({ username, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };
  
  const steps = [
    {
      title: "Velkommen til Snakkaz",
      icon: <MessageSquare className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-cybergold-300 leading-relaxed">
            Hei <span className="text-cybergold-400 font-semibold">{username}</span>! Vi er glade for å ha deg med oss. 
            Snakkaz er en sikker meldingsplattform med fokus på personvern og brukervennlighet.
          </p>
          <div className="p-4 bg-gradient-to-br from-cyberdark-800 to-cyberdark-900 rounded-lg border border-cyberdark-700">
            <h4 className="text-cybergold-500 font-medium mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Sikkerhet i fokus
            </h4>
            <p className="text-sm text-cybergold-400/80">
              Alle dine meldinger er sikret med ende-til-ende-kryptering, 
              og du har full kontroll over dine data.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Kom i gang",
      icon: <Users className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-cybergold-300 leading-relaxed">
            Det er enkelt å komme i gang med Snakkaz. Her er noen nyttige tips:
          </p>
          <div className="grid gap-3">
            {[
              { icon: <MessageSquare className="h-5 w-5" />, title: "Start samtaler", desc: "Finn venner og start private samtaler" },
              { icon: <Users className="h-5 w-5" />, title: "Opprett grupper", desc: "Lag grupper for team eller interesser" },
              { icon: <FileText className="h-5 w-5" />, title: "Del filer", desc: "Del filer og medier på en sikker måte" }
            ].map((item, i) => (
              <div key={i} className="flex items-start p-3 bg-cyberdark-800/50 rounded-lg border border-cyberdark-700">
                <div className="mr-3 p-2 bg-cybergold-500/20 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-cybergold-400 font-medium">{item.title}</h4>
                  <p className="text-xs text-cybergold-500/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Premium-funksjoner",
      icon: <ShoppingBag className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-cybergold-300 leading-relaxed">
            Oppgrader til Premium for å låse opp eksklusive funksjoner:
          </p>
          <div className="grid gap-2">
            {[
              "Ubegrenset fillagring",
              "Selvdestruerende meldinger",
              "Utvidede gruppefunksjoner",
              "Avanserte sikkerhetsinnstillinger",
              "Prioritert kundestøtte"
            ].map((feature, i) => (
              <div key={i} className="flex items-center p-2.5 bg-cyberdark-800/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-cybergold-500 mr-2.5" />
                <span className="text-sm text-cybergold-300">{feature}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gradient-to-r from-cybergold-900/20 to-cybergold-800/10 rounded-lg border border-cybergold-800/30">
            <p className="text-sm text-center text-cybergold-400">
              Prøv Premium gratis i 30 dager!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Klar til å starte?",
      icon: <CheckCircle className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-4 text-center px-4">
          <div className="py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-cybergold-500 to-cybergold-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(218,188,69,0.3)]">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
          </div>
          <h3 className="text-xl text-cybergold-400 font-medium">Alt er klart!</h3>
          <p className="text-cybergold-300 leading-relaxed">
            Du er nå klar til å bruke Snakkaz. Utforsk plattformen og opplev 
            sikker, effektiv kommunikasjon.
          </p>
          <p className="text-sm text-cybergold-500">
            Vi håper du får en fantastisk opplevelse med Snakkaz!
          </p>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep - 1];

  return (
    <Dialog open={true} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-md rounded-lg border-cyberdark-700 bg-gradient-to-b from-cyberdark-900 to-cyberdark-950 p-0 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Header med steps indikator */}
        <div className="bg-cyberdark-950 p-4 border-b border-cyberdark-800">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg text-cybergold-400">
              {currentStepData.title}
            </DialogTitle>
            <div className="flex gap-1 items-center">
              {Array.from({length: totalSteps}).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentStep ? "w-6 bg-cybergold-500" : "w-2 bg-cyberdark-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-5 py-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-cyberdark-800 to-cyberdark-900 rounded-full border border-cyberdark-700 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              {currentStepData.icon}
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            {currentStepData.content}
          </div>
        </div>
        
        <DialogFooter className="bg-cyberdark-950/80 border-t border-cyberdark-800 p-4 gap-2 flex-row justify-between">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="border-cyberdark-700 hover:bg-cyberdark-800 text-cybergold-600"
          >
            {currentStep < totalSteps ? "Hopp over" : "Lukk"}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-cybergold-600 to-cybergold-700 hover:from-cybergold-500 hover:to-cybergold-600 text-black shadow-[0_0_10px_rgba(218,188,69,0.2)]"
          >
            {currentStep < totalSteps ? (
              <span className="flex items-center">
                Neste <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            ) : "Kom i gang!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserWelcome;
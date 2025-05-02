import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Shield, MessageSquare, Users, FileText, ShoppingBag, ChevronRight, CheckCircle, Star, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="space-y-6">
          <p className="text-cybergold-200 leading-relaxed text-lg">
            Hei <span className="text-cybergold-400 font-bold">{username}</span>! Vi er glade for å ha deg med oss. 
            Snakkaz er en sikker meldingsplattform med fokus på personvern og brukervennlighet.
          </p>
          
          <motion.div 
            className="p-5 bg-gradient-to-br from-cyberdark-850 to-cyberdark-950 rounded-lg border border-cybergold-900/30 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 className="text-cybergold-400 font-semibold mb-3 flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-cybergold-500" /> 
              <span className="bg-gradient-to-r from-cybergold-400 to-cybergold-600 bg-clip-text text-transparent">
                Sikkerhet i fokus
              </span>
            </h4>
            <p className="text-cybergold-300/90 leading-relaxed">
              Alle dine meldinger er sikret med ende-til-ende-kryptering, 
              og du har full kontroll over dine data.
            </p>
            
            <div className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden opacity-50">
              <div className="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-10 -translate-y-6 bg-gradient-to-br from-cybergold-400 to-cybergold-700"></div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Kom i gang",
      icon: <Users className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-6">
          <p className="text-cybergold-200 leading-relaxed text-lg">
            Det er enkelt å komme i gang med Snakkaz. Her er noen nyttige tips:
          </p>
          <div className="grid gap-4">
            {[
              { icon: <MessageSquare className="h-6 w-6" />, title: "Start samtaler", desc: "Finn venner og start private samtaler" },
              { icon: <Users className="h-6 w-6" />, title: "Opprett grupper", desc: "Lag grupper for team eller interesser" },
              { icon: <FileText className="h-6 w-6" />, title: "Del filer", desc: "Del filer og medier på en sikker måte" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={cn(
                  "flex items-start p-4 rounded-lg relative overflow-hidden",
                  "bg-gradient-to-br from-cyberdark-850 to-cyberdark-950",
                  "border border-cybergold-900/30",
                  "shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                  "hover:shadow-[0_8px_25px_rgba(218,188,69,0.15)]",
                  "transition-all duration-300"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(218,188,69,0.4)" }}
              >
                <div className="mr-4 p-3 rounded-full bg-gradient-to-br from-cybergold-700/30 to-cybergold-900/30 border border-cybergold-700/30">
                  <div className="text-cybergold-400">{item.icon}</div>
                </div>
                <div>
                  <h4 className="text-cybergold-400 font-medium mb-1 text-lg">{item.title}</h4>
                  <p className="text-sm text-cybergold-300/80 leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="absolute -bottom-6 left-0 right-0 h-12 bg-cybergold-600/5 blur-xl rounded-full mx-auto w-3/5"></div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Premium-funksjoner",
      icon: <Sparkles className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-6">
          <p className="text-cybergold-200 leading-relaxed text-lg">
            Oppgrader til Premium for å låse opp eksklusive funksjoner:
          </p>
          <div className="grid gap-3">
            {[
              "Ubegrenset fillagring",
              "Selvdestruerende meldinger",
              "Utvidede gruppefunksjoner",
              "Avanserte sikkerhetsinnstillinger",
              "Prioritert kundestøtte"
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                className="flex items-center p-3.5 rounded-lg bg-gradient-to-r from-cyberdark-850 to-cyberdark-900 border border-cybergold-900/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                whileHover={{ backgroundColor: "rgba(218,188,69,0.05)", borderColor: "rgba(218,188,69,0.3)" }}
              >
                <CheckCircle className="h-5 w-5 text-cybergold-500 mr-3.5" />
                <span className="text-cybergold-300">{feature}</span>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className={cn(
              "p-5 rounded-lg relative overflow-hidden",
              "bg-gradient-to-r from-cybergold-900/20 via-cybergold-800/15 to-cybergold-900/20",
              "border border-cybergold-700/30",
              "shadow-[0_4px_20px_rgba(218,188,69,0.1)]"
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <Star className="h-6 w-6 text-cybergold-500 animate-pulse" />
              <p className="text-lg font-medium text-center text-cybergold-400">
                Prøv Premium gratis i 30 dager!
              </p>
              <Star className="h-6 w-6 text-cybergold-500 animate-pulse" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cybergold-500/5 to-transparent -translate-x-full animate-shimmer-slow"></div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Du er klar!",
      icon: <Shield className="h-12 w-12 text-cybergold-400" />,
      content: (
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-cybergold-600/20 to-cybergold-800/20 flex items-center justify-center border border-cybergold-700/30"
          >
            <CheckCircle className="h-12 w-12 text-cybergold-500" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cybergold-400 to-cybergold-600 bg-clip-text text-transparent mb-2">
              Gratulerer, {username}!
            </h3>
            <p className="text-cybergold-200 leading-relaxed text-lg">
              Du er nå klar til å utforske Snakkaz og alle funksjonene det har å tilby.
              Start med å sende en melding eller opprette en ny gruppe.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex p-1 rounded-lg bg-gradient-to-r from-cybergold-900/30 to-cybergold-800/30 border border-cybergold-800/40"
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              className={cn(
                "bg-gradient-to-r from-cybergold-600 to-cybergold-700 text-cyberdark-950 font-medium",
                "hover:from-cybergold-500 hover:to-cybergold-600",
                "shadow-[0_4px_15px_rgba(218,188,69,0.25)]",
                "transition-all duration-300",
                "border border-cybergold-500/50"
              )}
            >
              Start å chatte
            </Button>
          </motion.div>
        </div>
      )
    }
  ];
  
  return (
    <Dialog open={true}>
      <DialogContent className={cn(
        "max-w-2xl p-0 gap-0 overflow-hidden",
        "bg-gradient-to-br from-cyberdark-850 to-cyberdark-950 border-cybergold-900/30",
        "shadow-[0_10px_40px_rgba(0,0,0,0.3)]",
      )}>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cybergold-600/70 to-transparent"></div>
        
        <DialogHeader className="p-6 pb-0 relative">
          <div className="absolute top-6 right-6 flex items-center space-x-1 py-1 px-2 rounded-full bg-cyberdark-800 border border-cybergold-900/50">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  i + 1 === currentStep 
                    ? "bg-cybergold-500 scale-110" 
                    : i + 1 < currentStep 
                      ? "bg-cybergold-700" 
                      : "bg-cyberdark-700"
                )}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-cybergold-700/30 to-cybergold-900/30 border border-cybergold-800/40">
              {steps[currentStep - 1].icon}
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cybergold-400 to-cybergold-600 bg-clip-text text-transparent">
              {steps[currentStep - 1].title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep - 1].content}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <DialogFooter className="p-6 pt-0 flex justify-between border-t border-cyberdark-800 mt-6">
          {currentStep < totalSteps ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleSkip} 
                className="text-cybergold-600 hover:text-cybergold-500 hover:bg-cyberdark-800"
              >
                Hopp over
              </Button>
              <Button 
                onClick={handleNext} 
                className={cn(
                  "relative overflow-hidden group",
                  "bg-gradient-to-r from-cybergold-600 to-cybergold-700 text-cyberdark-950 font-medium",
                  "hover:from-cybergold-500 hover:to-cybergold-600 shadow-lg",
                  "transition-all duration-300",
                  "border border-cybergold-500/50"
                )}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                
                <span>Neste</span>
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleNext} 
              className={cn(
                "w-full relative overflow-hidden group",
                "bg-gradient-to-r from-cybergold-600 to-cybergold-700 text-cyberdark-950 font-medium",
                "hover:from-cybergold-500 hover:to-cybergold-600",
                "shadow-[0_4px_15px_rgba(218,188,69,0.25)]",
                "transition-all duration-300",
                "border border-cybergold-500/50"
              )}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              
              <span>Start å bruke Snakkaz</span>
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserWelcome;
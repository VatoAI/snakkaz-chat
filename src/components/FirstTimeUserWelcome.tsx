import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface FirstTimeUserWelcomeProps {
  username: string;
  onClose: () => void;
}

const FirstTimeUserWelcome: React.FC<FirstTimeUserWelcomeProps> = ({ username, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Velkommen til Snakkaz, {username}!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            Vi er glade for å ha deg med oss. Snakkaz er en sikker meldingsplattform
            som lar deg kommunisere enkelt og trygt med venner og kolleger.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Kom i gang:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Legg til venner og start en samtale</li>
              <li>Opprett grupper for team-diskusjoner</li>
              <li>Del filer og medier sikkert</li>
              <li>Utforsk markedsplassen for integrasjoner</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Kom i gang!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeUserWelcome;
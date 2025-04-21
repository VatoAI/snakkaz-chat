
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { PinSetupModal } from "./PinSetupModal";
import { PinChangeModal } from "./PinChangeModal";
import { PinRemoveModal } from "./PinRemoveModal";

export const PinManagement = () => {
  const { chatCode, resetChatCode } = useChatCode();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cybergold-400" />
        <h2 className="text-lg font-semibold text-cybergold-300">PIN-kode sikkerhet</h2>
      </div>

      <div className="bg-cyberdark-800/60 rounded-md p-4 border border-cybergold-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-cybergold-200">PIN-kode status</h3>
            <p className="text-sm text-cyberdark-300 mt-1">
              {chatCode 
                ? "PIN-kode er aktivert og gir ekstra sikkerhet for appen din."
                : "PIN-kode er ikke aktivert. Aktiver for økt sikkerhet."}
            </p>
          </div>
          <div className={`p-2 rounded-full ${chatCode ? 'bg-cyberblue-900/30' : 'bg-cyberred-900/30'}`}>
            {chatCode 
              ? <Check className="h-5 w-5 text-cyberblue-400" /> 
              : <AlertTriangle className="h-5 w-5 text-cyberred-400" />
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {!chatCode ? (
          <Button
            onClick={() => setShowSetupModal(true)}
            className="bg-gradient-to-r from-cybergold-600 to-cybergold-500 text-cyberdark-950 hover:from-cybergold-500 hover:to-cybergold-400"
          >
            <Shield className="mr-2 h-4 w-4" />
            Aktiver PIN-kode
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setShowChangeModal(true)}
              className="bg-cyberdark-800 border border-cybergold-500/30 hover:bg-cyberdark-700"
            >
              Endre PIN-kode
            </Button>
            <Button
              onClick={() => setShowRemoveModal(true)}
              variant="destructive"
              className="bg-cyberred-900/70 hover:bg-cyberred-800/70 text-white border-none"
            >
              Fjern PIN-kode
            </Button>
          </>
        )}
      </div>

      <PinSetupModal 
        isOpen={showSetupModal} 
        onClose={() => setShowSetupModal(false)} 
      />

      <PinChangeModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
      />

      <PinRemoveModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
      />
    </div>
  );
};

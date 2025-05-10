
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Power } from "lucide-react";
import { RegisterFormInputs } from "./RegisterFormInputs";
import { useRegister } from "@/hooks/useRegister";
import { PinSetupModal } from "@/components/pin/PinSetupModal";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);
  
  const { handleRegister, isLoading, registrationComplete } = useRegister({
    username,
    fullName: "", // Vi sender en tom string siden vi har fjernet dette feltet
    email,
    password,
    confirmPassword,
  });

  const handleSubmitWithPinSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start registration process but don't navigate away yet
    const success = await handleRegister(e, false);
    
    if (success) {
      // Show PIN setup modal after successful registration
      setShowPinSetup(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitWithPinSetup} className="space-y-6">
        <RegisterFormInputs
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />

        <Button
          type="submit"
          className="w-full relative group overflow-hidden bg-gradient-to-r from-cybergold-500 via-cybergold-400 to-cybergold-500 hover:from-cybergold-400 hover:to-cybergold-400 text-white font-semibold text-lg shadow-[0_0_15px_rgba(230,179,0,0.3)] transition-all duration-300 border border-cybergold-300/50 hover:shadow-[0_0_25px_rgba(230,179,0,0.5)]"
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative text-lg">
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center text-cyberdark-950">
                <Power className="w-4 h-4 animate-spin" />
                Oppretter konto...
              </div>
            ) : (
              <span className="text-cyberdark-950">Opprett konto</span>
            )}
          </span>
        </Button>
      </form>

      <PinSetupModal 
        isOpen={showPinSetup} 
        onClose={() => setShowPinSetup(false)}
        isRegistration={true}
      />
    </>
  );
};

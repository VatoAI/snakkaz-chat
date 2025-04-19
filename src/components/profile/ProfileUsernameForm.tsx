
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ProfileUsernameFormProps {
  username: string;
  usernameError: string | null;
  loading: boolean;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const ProfileUsernameForm = ({
  username,
  usernameError,
  loading,
  onUsernameChange,
  onSubmit
}: ProfileUsernameFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-base font-medium text-cybergold-400 mb-2">
          Brukernavn
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={onUsernameChange}
          className="bg-cyberdark-700 border-2 border-cybergold-400/50 text-cybergold-100 placeholder-cybergold-400/50 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/30 h-12 text-lg px-4"
          placeholder="Velg ditt brukernavn"
          autoComplete="username"
        />
        {usernameError && (
          <p className="mt-2 text-sm text-red-400 bg-red-950/20 p-2 rounded-md border border-red-500/20">
            {usernameError}
          </p>
        )}
        <p className="mt-2 text-sm text-cybergold-400/70 bg-cyberdark-900/50 p-2 rounded-md">
          Brukernavn kan inneholde bokstaver, tall og underscore (_)
        </p>
      </div>

      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-cybergold-400 hover:bg-cybergold-500 text-black h-12 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Lagrer...
          </>
        ) : (
          'Lagre endringer'
        )}
      </Button>
    </div>
  );
};


import { Input } from "@/components/ui/input";

interface RegisterFormInputsProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

export const RegisterFormInputs = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: RegisterFormInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-cybergold-300">
          Brukernavn
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-cyberdark-900/90 border-cybergold-400/50 text-cybergold-200 placeholder:text-cybergold-400/30 hover:border-cybergold-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50 transition-colors"
          placeholder="Velg et brukernavn"
          required
          autoComplete="username"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-cybergold-300">
          E-post
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyberdark-900/90 border-cybergold-400/50 text-cybergold-200 placeholder:text-cybergold-400/30 hover:border-cybergold-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50 transition-colors"
          placeholder="din@epost.no"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-cybergold-300">
          Passord
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-cyberdark-900/90 border-cybergold-400/50 text-cybergold-200 placeholder:text-cybergold-400/30 hover:border-cybergold-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50 transition-colors"
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-cybergold-300">
          Bekreft passord
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-cyberdark-900/90 border-cybergold-400/50 text-cybergold-200 placeholder:text-cybergold-400/30 hover:border-cybergold-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50 transition-colors"
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
      </div>
    </>
  );
};

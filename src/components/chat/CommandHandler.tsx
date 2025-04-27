
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CommandHandlerProps {
  action: string;
  payload: any;
  onComplete?: () => void;
}

export const CommandHandler = ({ action, payload, onComplete }: CommandHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const executeCommand = async () => {
    try {
      switch (action) {
        case 'changeStatus':
          // Implementere status endring
          toast({
            title: "Status endret",
            description: `Din status er nå satt til: ${payload.status}`,
          });
          break;

        case 'notifications':
          // Navigere til varslingsinnstillinger
          navigate('/profil?tab=notifications');
          break;

        case 'theme':
          // Endre app-tema
          document.documentElement.classList.toggle('dark');
          toast({
            title: "Tema endret",
            description: "App-temaet er oppdatert",
          });
          break;

        case 'logout':
          // Utføre utlogging
          navigate('/logout');
          break;

        default:
          console.warn('Unknown command:', action);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke utføre kommandoen",
        variant: "destructive",
      });
    } finally {
      onComplete?.();
    }
  };

  // Kjør kommandoen når komponenten monteres
  executeCommand();

  // Denne komponenten trenger ikke å rendre noe
  return null;
};

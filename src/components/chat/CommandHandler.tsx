
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { useEffect } from "react";
import { useMediaHandler } from "@/hooks/message/useMessageSender/useMediaHandler";

interface CommandHandlerProps {
  action: string;
  payload: any;
  onComplete?: () => void;
}

export const CommandHandler = ({ action, payload, onComplete }: CommandHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const { handleMediaUpload } = useMediaHandler();

  useEffect(() => {
    const executeCommand = async () => {
      try {
        console.log(`Executing command: ${action}`, payload);
        switch (action) {
          case 'changeStatus':
            // Implement status change
            toast({
              title: "Status endret",
              description: `Din status er nå satt til: ${payload.status}`,
            });
            break;

          case 'notifications':
            // Navigate to notification settings
            navigate('/profil?tab=notifications');
            break;

          case 'theme':
            // Change app theme
            document.documentElement.classList.toggle('dark');
            toast({
              title: "Tema endret",
              description: "App-temaet er oppdatert",
            });
            break;
          
          case 'uploadMedia':
            // Handle media upload command
            if (payload.file) {
              try {
                const result = await handleMediaUpload(payload.file, toast);
                if (result && payload.onSuccess) {
                  payload.onSuccess(result);
                }
              } catch (error) {
                console.error('Media upload failed:', error);
                toast({
                  title: "Opplastingsfeil",
                  description: "Kunne ikke laste opp mediefilen",
                  variant: "destructive",
                });
              }
            }
            break;

          case 'logout':
            // Perform logout
            navigate('/logout');
            break;

          default:
            console.warn('Unknown command:', action);
        }
        
        // Notify via system notification if appropriate
        if (action === 'changeStatus' || action === 'theme') {
          notify("Command executed", {
            body: `Command "${action}" was successfully executed`
          });
        }
        
      } catch (error) {
        console.error('Error executing command:', error);
        toast({
          title: "Feil",
          description: "Kunne ikke utføre kommandoen",
          variant: "destructive",
        });
      } finally {
        if (onComplete) {
          onComplete();
        }
      }
    };

    executeCommand();
  }, [action, payload, toast, navigate, notify, onComplete, handleMediaUpload]);

  // This component doesn't need to render anything
  return null;
};

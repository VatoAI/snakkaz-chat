
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(-1)}
        className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/')}
        className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
      >
        <Home className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/chat')}
        className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
};

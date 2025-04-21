
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Info, User } from "lucide-react";

export const HeaderNavLinks = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex gap-2 items-center">
      <Button
        variant="ghost"
        size="icon"
        className="text-cyberblue-300 hover:bg-cyberblue-900/20 transition-all"
        onClick={() => navigate("/")}
        title="Hjem"
      >
        <Home />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-cybergold-400 hover:bg-cyberdark-800/50 transition-all"
        onClick={() => navigate("/info")}
        title="Info"
      >
        <Info />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-cyberred-400 hover:bg-cyberred-900/30 transition-all"
        onClick={() => navigate("/admin")}
        title="Admin"
      >
        <User />
      </Button>
    </nav>
  );
};

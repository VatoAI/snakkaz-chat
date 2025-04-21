
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminButton() {
  const { user } = useAuth();
  const { isAdmin, loading } = useIsAdmin(user?.id);
  const navigate = useNavigate();

  if (loading || !user || !isAdmin) return null;

  return (
    <Button
      onClick={() => navigate("/admin")}
      variant="outline"
      className="ml-2 border-cyberblue-500 text-cyberblue-300 hover:bg-cyberblue-900"
    >
      <Shield className="mr-2 w-4 h-4" />
      Admin Panel
    </Button>
  );
}

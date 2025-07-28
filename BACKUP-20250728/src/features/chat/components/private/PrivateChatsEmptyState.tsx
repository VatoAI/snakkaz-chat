
import { MessageSquare } from "lucide-react";

export function PrivateChatsEmptyState() {
  return (
    <div className="text-center text-cybergold-500 py-8">
      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-cybergold-400/50" />
      <p className="text-lg font-medium">Ingen samtaler ennå</p>
      <p className="text-sm mt-1">Gå til Venner-fanen for å starte en ny chat</p>
    </div>
  );
}

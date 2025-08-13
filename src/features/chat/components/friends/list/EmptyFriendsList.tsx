
import { User } from "lucide-react";

export const EmptyFriendsList = () => {
  return (
    <div className="text-center text-cybergold-500 py-4 bg-cyberdark-800/40 rounded-md p-4">
      <div className="mb-2 flex justify-center">
        <User className="h-10 w-10 text-cybergold-400/50" />
      </div>
      <p>Du har ingen venner ennå.</p>
      <p className="text-sm mt-1">Søk etter brukere og send venneforespørsler for å begynne å chatte.</p>
    </div>
  );
};

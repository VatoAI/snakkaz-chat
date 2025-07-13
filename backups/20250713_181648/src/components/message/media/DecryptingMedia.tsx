
import { Loader2 } from "lucide-react";

export const DecryptingMedia = () => {
  return (
    <div className="p-4 bg-cyberdark-800/60 rounded-md flex flex-col items-center gap-2 mt-2">
      <Loader2 className="h-6 w-6 text-cyberblue-500 animate-spin" />
      <span className="text-cyberdark-200 text-sm">Decrypting media...</span>
    </div>
  );
};

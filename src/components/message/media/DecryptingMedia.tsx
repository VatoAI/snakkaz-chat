
import { Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DecryptingMedia = () => {
  return (
    <div className="mt-2 flex items-center space-x-2">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Lock className="h-8 w-8 text-cybergold-400 animate-pulse" />
          <p className="text-xs mt-2 text-cybergold-300">Decrypting media...</p>
        </div>
      </div>
    </div>
  );
};

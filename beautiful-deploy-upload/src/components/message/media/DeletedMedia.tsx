
import { Trash2 } from "lucide-react";

export const DeletedMedia = () => {
  return (
    <div className="p-3 bg-cyberdark-800/60 rounded-md flex items-center gap-2 mt-2">
      <Trash2 className="h-5 w-5 text-cyberdark-400" />
      <span className="text-cyberdark-400 text-sm">Media has been deleted</span>
    </div>
  );
};

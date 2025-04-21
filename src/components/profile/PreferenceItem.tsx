
import { Label } from "@/components/ui/label";
import { EnhancedSwitch } from "./EnhancedSwitch";

interface PreferenceItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  loading?: boolean;
}

export const PreferenceItem = ({
  title,
  description,
  checked,
  onCheckedChange,
  loading
}: PreferenceItemProps) => {
  return (
    <div className="flex items-center justify-between group p-3 rounded-lg transition-colors hover:bg-cyberdark-700/50">
      <div className="space-y-1">
        <Label className="text-sm text-white">{title}</Label>
        <p className="text-xs text-cyberdark-400">{description}</p>
      </div>
      <EnhancedSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        loading={loading}
      />
    </div>
  );
};

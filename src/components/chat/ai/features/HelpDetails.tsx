
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface HelpDetailsProps {
  details: string[];
}

export const HelpDetails = ({ details }: HelpDetailsProps) => {
  return (
    <Card className="absolute bottom-4 right-4 w-80 p-4 bg-cyberdark-800 border-cybergold-500/30">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="h-5 w-5 text-cybergold-400" />
        <h3 className="text-sm font-medium text-cybergold-300">
          Hjelpedetaljer
        </h3>
      </div>
      <ul className="space-y-2 text-sm text-white">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-cybergold-400 mt-1">•</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

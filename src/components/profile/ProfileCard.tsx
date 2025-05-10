import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface ProfileCardProps {
  children: React.ReactNode;
}

export const ProfileCard = ({ children }: ProfileCardProps) => {
  return (
    <Card className={cn(
      "w-full animate-fadeIn overflow-hidden",
      "bg-gradient-to-br from-cyberdark-850 to-cyberdark-950",
      "border border-cybergold-900/40",
      "shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
      "relative"
    )}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-9 -translate-y-6 bg-gradient-to-br from-cybergold-600 to-cybergold-800 opacity-20"></div>
      </div>
      
      {/* Subtle gradient border at the top */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-cybergold-600/50 to-transparent"></div>
      
      <CardHeader className="border-b border-cyberdark-800">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-cybergold-400" />
          <CardTitle className="text-cybergold-400 font-semibold tracking-wide">
            Min Profil
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "space-y-8 p-6",
        "relative z-10"
      )}>
        {children}
      </CardContent>
      
      {/* Subtle bottom glow effect */}
      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-cybergold-600/5 blur-xl rounded-full mx-auto w-4/5"></div>
    </Card>
  );
};

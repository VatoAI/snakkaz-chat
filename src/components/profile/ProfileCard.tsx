
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface ProfileCardProps {
  children: React.ReactNode;
}

export const ProfileCard = ({ children }: ProfileCardProps) => {
  return (
    <Card className="w-full bg-cyberdark-800/90 border-2 border-cybergold-400/50 animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-cybergold-400">Min Profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {children}
      </CardContent>
    </Card>
  );
};

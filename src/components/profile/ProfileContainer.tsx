
import React from "react";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export const ProfileContainer = ({ children }: ProfileContainerProps) => (
  <div className="max-w-4xl mx-auto">
    {children}
  </div>
);

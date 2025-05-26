
import { Shield } from "lucide-react";

interface MessageSecurityBannerProps {
  isSecureConnection: boolean;
  messagesExist: boolean;
}

export const MessageSecurityBanner = ({ isSecureConnection, messagesExist }: MessageSecurityBannerProps) => {
  if (isSecureConnection || messagesExist) {
    return null;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <Shield className="h-16 w-16 text-cybergold-500 opacity-20 mb-4" />
      <h3 className="text-cybergold-300 text-lg font-medium mb-2">Etablerer sikker tilkobling</h3>
      <p className="text-cyberdark-400 max-w-md">
        Venter på å etablere en sikker ende-til-ende-kryptert forbindelse.
        Du vil ikke kunne sende eller motta meldinger før tilkoblingen er sikker.
      </p>
    </div>
  );
};

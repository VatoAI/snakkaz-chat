import { useGroupCreation } from "@/components/chat/hooks/useGroupCreation";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { SecurityLevel } from "@/types/security";

interface GroupChatEmptyStateProps {
  securityLevel: SecurityLevel;
}

export const GroupChatEmptyState = ({ securityLevel }: GroupChatEmptyStateProps) => {
  const { createGroup, isLoading } = useGroupCreation();

  // Get security features based on security level
  const securityFeatures = useMemo(() => {
    switch (securityLevel) {
      case SecurityLevel.PREMIUM:
        return [
          "End-to-end kryptering",
          "Fingeravtrykkverifisering av kontakter",
          "Automatisk sletting av meldinger",
          "Sikker filoverføring med kryptering",
          "Peer-to-peer kommunikasjon"
        ];
      case SecurityLevel.HIGH:
        return [
          "End-to-end kryptering",
          "Automatisk sletting av meldinger",
          "Sikker filoverføring med kryptering"
        ];
      case SecurityLevel.MAXIMUM:
        return [
          "End-to-end kryptering",
          "Fingeravtrykkverifisering av kontakter",
          "Automatisk sletting av meldinger",
          "Sikker filoverføring med kryptering",
          "Peer-to-peer kommunikasjon",
          "Steganografi for skjult kommunikasjon"
        ];
      default:
        return [
          "Meldinger kryptert på serveren",
          "Sletting av meldinger",
          "Filoverføring"
        ];
    }
  }, [securityLevel]);

  // Get security recommendations based on security level
  const securityRecommendations = useMemo(() => {
    switch (securityLevel) {
      case SecurityLevel.PREMIUM:
        return [
          "Bruk komplekse fraser i meldinger for ekstra sikkerhet",
          "Slå på automatisk sletting av meldinger",
          "Verifiser kontakter før sensitive samtaler"
        ];
      case SecurityLevel.HIGH:
        return [
          "Bruk komplekse fraser i meldinger for ekstra sikkerhet",
          "Slå på automatisk sletting av meldinger"
        ];
      case SecurityLevel.MAXIMUM:
        return [
          "Bruk komplekse fraser i meldinger for ekstra sikkerhet",
          "Slå på automatisk sletting av meldinger",
          "Verifiser kontakter før sensitive samtaler",
          "Bruk steganografi for ekstra sensitive meldinger"
        ];
      default:
        return [
          "Ikke del sensitiv informasjon",
          "Slett meldinger manuelt etter behov"
        ];
    }
  }, [securityLevel]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-lg font-semibold mb-4">
        Denne gruppen er tom
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Start samtalen ved å sende en melding
      </p>
      <Button disabled={isLoading} onClick={createGroup}>
        Opprett gruppe
      </Button>
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">
          Sikkerhetsfunksjoner:
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-500">
          {securityFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">
          Sikkerhetsanbefalinger:
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-500">
          {securityRecommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};


import React, { useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Users, Lock, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CreateGroupComponentProps {
  onSuccess?: (groupId: string) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const CreateGroupComponent: React.FC<CreateGroupComponentProps> = ({ 
  onSuccess, 
  onCancel,
  isModal = false
}) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "hidden">("private");
  const [securityLevel, setSecurityLevel] = useState<"low" | "standard" | "high" | "maximum">("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleCreateGroup } = useGroups({ currentUserId: user?.id || '' });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      const newGroup = await handleCreateGroup(
        name.trim(),
        description.trim(),
        visibility,
        securityLevel
      );

      if (newGroup && onSuccess) {
        onSuccess(newGroup.id);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: "Det oppstod en feil ved opprettelse av gruppen. Vennligst prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSecurityLevelDescription = (level: string) => {
    switch (level) {
      case "low":
        return "Enkel kryptering. Best for uformelle grupper der ytelse er viktigere enn sikkerhet.";
      case "standard":
        return "Balansert kryptering for de fleste grupper. Anbefalt for vanlig bruk.";
      case "high":
        return "Avansert ende-til-ende kryptering. Ideell for sensitive samtaler og forretningsbruk.";
      case "maximum":
        return "Maksimal sikkerhet med militærgradert kryptering. Kan påvirke ytelsen.";
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Gruppenavn</Label>
        <Input
          id="name"
          placeholder="Skriv inn et gruppenavn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          className="dark:bg-cyberdark-800 dark:border-cybergold-500/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beskrivelse (valgfri)</Label>
        <Textarea
          id="description"
          placeholder="Legg til en beskrivelse av gruppen"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          className="dark:bg-cyberdark-800 dark:border-cybergold-500/30 h-20"
        />
      </div>

      <div className="space-y-3">
        <Label>Personvern</Label>
        <RadioGroup
          value={visibility}
          onValueChange={(val: "private" | "public" | "hidden") => setVisibility(val)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer">
              <Lock className="h-4 w-4 dark:text-cyberred-400" />
              <div>
                <span className="block">Privat</span>
                <span className="block text-xs dark:text-gray-400 light:text-gray-600">
                  Kun inviterte personer kan bli med
                </span>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer">
              <Globe className="h-4 w-4 dark:text-cyberblue-400" />
              <div>
                <span className="block">Offentlig</span>
                <span className="block text-xs dark:text-gray-400 light:text-gray-600">
                  Alle kan finne og delta i gruppen
                </span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityLevel" className="flex items-center gap-2">
          <Shield className="h-4 w-4 dark:text-cybergold-400" />
          Sikkerhetsnivå
        </Label>
        <Select
          value={securityLevel}
          onValueChange={(value: "low" | "standard" | "high" | "maximum") => setSecurityLevel(value)}
        >
          <SelectTrigger className="w-full dark:bg-cyberdark-800 dark:border-cybergold-500/30">
            <SelectValue placeholder="Velg sikkerhetsnivå" />
          </SelectTrigger>
          <SelectContent className="dark:bg-cyberdark-800">
            <SelectItem value="low">Lav</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="high">Høy</SelectItem>
            <SelectItem value="maximum">Maksimal</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs dark:text-gray-400 light:text-gray-500 mt-1">
          {getSecurityLevelDescription(securityLevel)}
        </p>
      </div>

      <div className={`flex ${isModal ? 'justify-between' : 'justify-end'} gap-2 pt-3`}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="dark:border-cybergold-500/30">
            Avbryt
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="dark:bg-gradient-to-r dark:from-cyberblue-600 dark:to-cyberblue-800 dark:text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Oppretter...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Opprett gruppe
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

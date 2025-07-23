import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader2, Users, Lock, Globe, Shield } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { GroupVisibility, SecurityLevel } from "@/types/groups";

interface CreateGroupProps {
  onSuccess?: (groupId: string) => void;
}

export const CreateGroup = ({ onSuccess }: CreateGroupProps) => {
  // Group form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<GroupVisibility>("private");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get createGroup function from the hook
  const { createGroup } = useGroups();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      // Call the createGroup function from the hook
      const newGroup = await createGroup({
        name: name.trim(),
        description: description.trim(),
        visibility,
        securityLevel,
      });

      // Reset form
      setName("");
      setDescription("");
      setVisibility("private");
      setSecurityLevel("standard");

      // Call onSuccess if provided and group was created
      if (onSuccess && newGroup?.id) {
        onSuccess(newGroup.id);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get description for security levels
  const getSecurityLevelDescription = (level: SecurityLevel) => {
    switch (level) {
      case "low":
        return "Enkel kryptering. Best for uformelle grupper der ytelse er viktigere enn sikkerhet.";
      case "standard":
        return "Balansert kryptering for de fleste grupper. Anbefalt for vanlig bruk.";
      case "high":
        return "Ende-til-ende kryptering. Gir best sikkerhet for sensitive samtaler.";
      case "maximum":
        return "Maksimal sikkerhet med ende-til-ende kryptering og ekstra beskyttelse.";
      default:
        return "Standardnivå for gruppekommunikasjon.";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto dark:bg-cyberdark-900 dark:border-cybergold-500/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-cybergold-300">Opprett en ny gruppe</CardTitle>
        <CardDescription className="dark:text-cybergold-500">
          Lag en gruppe der du kan invitere venner og familie til samtaler
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-cybergold-300">Gruppenavn</Label>
            <Input
              id="name"
              placeholder="Skriv inn et gruppenavn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className="dark:bg-cyberdark-800 dark:border-cybergold-500/30 dark:text-cybergold-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-cybergold-300">Beskrivelse (valgfri)</Label>
            <Textarea
              id="description"
              placeholder="Legg til en beskrivelse av gruppen"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="dark:bg-cyberdark-800 dark:border-cybergold-500/30 dark:text-cybergold-200 h-20"
            />
          </div>

          <div className="space-y-3">
            <Label className="dark:text-cybergold-300">Personvern</Label>

            <RadioGroup value={visibility} onValueChange={(val: GroupVisibility) => setVisibility(val)} className="space-y-2">
              <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer dark:text-cybergold-300">
                  <Lock className="h-4 w-4 dark:text-cyberred-400" />
                  <div>
                    <span className="block">Privat</span>
                    <span className="block text-xs text-muted-foreground dark:text-cybergold-500">
                      Bare inviterte medlemmer kan se og delta i gruppen
                    </span>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer dark:text-cybergold-300">
                  <Globe className="h-4 w-4 dark:text-cyberblue-400" />
                  <div>
                    <span className="block">Offentlig</span>
                    <span className="block text-xs text-muted-foreground dark:text-cybergold-500">
                      Alle kan finne og bli med i gruppen
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="dark:text-cybergold-300">Sikkerhetsnivå</Label>

            <RadioGroup value={securityLevel} onValueChange={(val: SecurityLevel) => setSecurityLevel(val)} className="space-y-2">
              <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex items-center gap-2 font-normal cursor-pointer dark:text-cybergold-300">
                  <Shield className="h-4 w-4 dark:text-cyberblue-400" />
                  <div>
                    <span className="block">Standard</span>
                    <span className="block text-xs text-muted-foreground dark:text-cybergold-500">
                      {getSecurityLevelDescription("standard")}
                    </span>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="flex items-center gap-2 font-normal cursor-pointer dark:text-cybergold-300">
                  <Shield className="h-4 w-4 dark:text-cybergreen-400" />
                  <div>
                    <span className="block">Høy sikkerhet</span>
                    <span className="block text-xs text-muted-foreground dark:text-cybergold-500">
                      {getSecurityLevelDescription("high")}
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            className="dark:bg-gradient-to-r dark:from-cyberblue-600 dark:to-cyberblue-800 dark:text-white"
            disabled={isSubmitting || !name.trim()}
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
        </CardFooter>
      </form>
    </Card>
  );
};
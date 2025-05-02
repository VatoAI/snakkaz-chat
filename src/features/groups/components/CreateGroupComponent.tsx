import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Search, Check, X, Upload, Lock, Globe, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { GroupVisibility, SecurityLevel } from "@/types/groups";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Unified props that work for both modal and standalone versions
interface CreateGroupProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (groupId: string) => void;
}

export const CreateGroupComponent = ({ 
  isModal = false, 
  isOpen = true, 
  onClose = () => {}, 
  onSuccess 
}: CreateGroupProps) => {
  // Group form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<GroupVisibility>("private");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get createGroup function from the hook
  const { createGroup } = useGroups();
  const { toast } = useToast();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setVisibility("private");
    setSecurityLevel("standard");
    setAvatarPreview(null);
    setAvatarFile(null);
    if (isModal) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Gruppenavn mangler",
        description: "Du må angi et navn for gruppen",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the createGroup function from the hook
      const newGroup = await createGroup({
        name: name.trim(),
        description: description.trim(),
        visibility,
        securityLevel,
        avatarFile // Use the property name that matches CreateGroupData type
      });

      toast({
        title: "Gruppe opprettet!",
        description: `${name} er nå opprettet og klar til bruk.`,
      });

      // Reset form
      resetForm();

      // Call onSuccess if provided and group was created
      if (onSuccess && newGroup?.id) {
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

  const getSecurityLevelIcon = (level: SecurityLevel) => {
    switch (level) {
      case "low":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "standard":
        return <Shield className="h-4 w-4 text-cyberblue-400" />;
      case "high":
        return <Lock className="h-4 w-4 text-cybergreen-400" />;
      case "maximum":
        return <Shield className="h-4 w-4 text-cyberred-400" />;
      default:
        return <Shield className="h-4 w-4 text-cyberblue-400" />;
    }
  };

  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        {/* Avatar upload section */}
        <div className="flex-shrink-0">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cybergold-500/30 bg-cyberdark-800 flex items-center justify-center cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarPreview} alt="Group avatar preview" className="object-cover" />
              </Avatar>
            ) : (
              <div className="flex flex-col items-center justify-center text-cybergold-400">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs">Last opp</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 space-y-4">
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
        </div>
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

        <Select value={securityLevel} onValueChange={(val: SecurityLevel) => setSecurityLevel(val)}>
          <SelectTrigger className="w-full dark:bg-cyberdark-800 dark:border-cybergold-500/30">
            <SelectValue placeholder="Velg sikkerhetsnivå" />
          </SelectTrigger>
          <SelectContent className="dark:bg-cyberdark-800">
            <SelectItem value="standard">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyberblue-400" />
                <span>Standard</span>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cybergreen-400" />
                <span>Høy</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs dark:text-gray-400 light:text-gray-500 mt-1 flex items-start gap-2">
          {getSecurityLevelIcon(securityLevel)}
          <span>{getSecurityLevelDescription(securityLevel)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-3">
        {isModal && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="dark:border-cybergold-500/30"
          >
            Avbryt
          </Button>
        )}
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
      </div>
    </form>
  );

  // If it's a modal, wrap in Dialog components
  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md dark:bg-cyberdark-900 light:bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Opprett en ny gruppe</DialogTitle>
            <DialogDescription>
              Lag en gruppe der du kan invitere venner og familie til samtaler
            </DialogDescription>
          </DialogHeader>
          {renderFormContent()}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise, render as a standalone card
  return (
    <Card className="w-full max-w-md mx-auto dark:bg-cyberdark-900 dark:border-cybergold-500/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-cybergold-300">Opprett en ny gruppe</CardTitle>
        <CardDescription className="dark:text-cybergold-500">
          Lag en gruppe der du kan invitere venner og familie til samtaler
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderFormContent()}
      </CardContent>
    </Card>
  );
};
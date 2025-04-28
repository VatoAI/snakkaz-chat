import { useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { GroupVisibility, SecurityLevel, Group } from "@/types/groups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Lock, Globe, Shield, AlertTriangle, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (groupId: string) => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onSuccess }: CreateGroupModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<GroupVisibility>("private");
    const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("standard");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createGroup } = useGroups();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            const newGroup = await createGroup({
                name: name.trim(),
                description: description.trim(),
                visibility,
                securityLevel,
            }) as Group | null;

            // Vis suksessmelding
            toast({
                title: "Gruppe opprettet!",
                description: `${name} er nå opprettet og klar til bruk.`,
                variant: "default",
            });

            // Reset form
            setName("");
            setDescription("");
            setVisibility("private");
            setSecurityLevel("standard");

            // Informer foreldre-komponenten om vellykket opprettelse
            if (onSuccess && newGroup?.id) {
                onSuccess(newGroup.id);
            }

            // Lukk modal
            onClose();
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

    const getSecurityLevelDescription = (level: SecurityLevel) => {
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

    const getSecurityLevelIcon = (level: SecurityLevel) => {
        switch (level) {
            case "low":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "standard":
                return <Shield className="h-4 w-4 text-cyberblue-400" />;
            case "high":
                return <Lock className="h-4 w-4 text-cyberblue-600" />;
            case "maximum":
                return <BadgeCheck className="h-4 w-4 text-cyberred-400" />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md dark:bg-cyberdark-900 light:bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Opprett en ny gruppe</DialogTitle>
                    <DialogDescription>
                        Lag en gruppe der du kan invitere venner og familie til samtaler
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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

                        <RadioGroup value={visibility} onValueChange={(val: GroupVisibility) => setVisibility(val)} className="space-y-2">
                            <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer">
                                    <Lock className="h-4 w-4 dark:text-cyberred-400" />
                                    <div>
                                        <span className="block">Privat</span>
                                        <span className="block text-xs dark:text-gray-400 light:text-gray-600">Kun inviterte personer kan bli med</span>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border dark:border-cybergold-500/30 p-3">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer">
                                    <Globe className="h-4 w-4 dark:text-cyberblue-400" />
                                    <div>
                                        <span className="block">Offentlig</span>
                                        <span className="block text-xs dark:text-gray-400 light:text-gray-600">Alle kan finne og delta i gruppen</span>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Sikkerhets-nivå velger */}
                    <div className="space-y-2">
                        <Label htmlFor="securityLevel" className="flex items-center gap-2">
                            <Shield className="h-4 w-4 dark:text-cybergold-400" />
                            Sikkerhetsnivå
                        </Label>
                        <Select value={securityLevel} onValueChange={(value: SecurityLevel) => setSecurityLevel(value)}>
                            <SelectTrigger className="w-full dark:bg-cyberdark-800 dark:border-cybergold-500/30">
                                <SelectValue placeholder="Velg sikkerhetsnivå" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-cyberdark-800">
                                <SelectItem value="low" className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        <span>Lav</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="standard">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-cyberblue-400" />
                                        <span>Standard</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="high">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-cyberblue-600" />
                                        <span>Høy</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="maximum">
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck className="h-4 w-4 text-cyberred-400" />
                                        <span>Maksimal</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs dark:text-gray-400 light:text-gray-500 mt-1 flex items-start gap-2">
                            {getSecurityLevelIcon(securityLevel)}
                            <span>{getSecurityLevelDescription(securityLevel)}</span>
                        </p>
                    </div>

                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="dark:border-cybergold-500/30"
                        >
                            Avbryt
                        </Button>
                        <Button
                            type="submit"
                            className="dark:bg-gradient-to-r dark:from-cyberblue-600 dark:to-cyberblue-800 dark:text-white
                         light:bg-gradient-to-r light:from-blue-500 light:to-blue-700 light:text-white"
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
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
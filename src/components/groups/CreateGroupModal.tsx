import { useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { GroupVisibility } from "@/types/groups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Users, Lock, Globe } from "lucide-react";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<GroupVisibility>("private");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createGroup } = useGroups();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            await createGroup({
                name: name.trim(),
                description: description.trim(),
                visibility,
            });

            // Reset form
            setName("");
            setDescription("");
            setVisibility("private");

            // Close modal
            onClose();
        } catch (error) {
            console.error("Error creating group:", error);
        } finally {
            setIsSubmitting(false);
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
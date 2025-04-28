import { useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Copy, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface InviteGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export const InviteGroupModal = ({ isOpen, onClose, groupId }: InviteGroupModalProps) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { groups, inviteToGroup } = useGroups();

    const group = groups.find((g) => g.id === groupId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) return;

        setIsSubmitting(true);

        try {
            const invite = await inviteToGroup(groupId, email.trim());
            if (invite) {
                setInviteCode(invite.code);
                setEmail("");
            }
        } catch (error) {
            console.error("Error inviting user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyCode = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setEmail("");
        setInviteCode(null);
        setCopied(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md dark:bg-cyberdark-900 light:bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Inviter til {group?.name || 'gruppe'}
                    </DialogTitle>
                    <DialogDescription>
                        Inviter venner og familie til å delta i samtaler
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-postadresse</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="navn@eksempel.no"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting || !!inviteCode}
                            className="dark:bg-cyberdark-800 dark:border-cybergold-500/30"
                        />
                    </div>

                    {inviteCode && (
                        <div className="space-y-2 mt-4">
                            <Label>Invitasjonskode</Label>
                            <div className="flex items-center space-x-2">
                                <div className={`flex-1 p-2 rounded-md font-mono text-sm
                  ${isDark
                                        ? 'bg-cyberdark-800 border border-cybergold-500/30'
                                        : 'bg-gray-100 border border-gray-200'}`}>
                                    {inviteCode}
                                </div>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={handleCopyCode}
                                    className="dark:border-cybergold-500/30"
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs dark:text-gray-400 light:text-gray-500">
                                Del denne koden med vennen din for å bli med i gruppen.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="dark:border-cybergold-500/30"
                        >
                            {inviteCode ? "Lukk" : "Avbryt"}
                        </Button>

                        {!inviteCode && (
                            <Button
                                type="submit"
                                className={`${isDark
                                    ? 'bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                disabled={isSubmitting || !email.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sender...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send invitasjon
                                    </>
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
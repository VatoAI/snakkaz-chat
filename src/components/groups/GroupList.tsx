import { useState, useEffect } from "react";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateGroupModal } from "./CreateGroupModal";
import { InviteGroupModal } from "./InviteGroupModal";
import { UserPlus, Users, Lock, Globe, Plus, Shield, RefreshCcw, Search, Star } from "lucide-react";
import { type Group, SecurityLevel } from "@/types/groups";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const GroupList = () => {
    const { myGroups, loading, activeGroupId, setActiveGroupId, fetchGroups } = useGroups();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
    const { theme } = useTheme();
    const { toast } = useToast();

    // Automatisk refresh av gruppene hver 30. sekund for å fange opp nye grupper
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchGroups().catch(console.error);
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchGroups]);

    const handleInviteClick = (groupId: string) => {
        setSelectedGroupId(groupId);
        setShowInviteModal(true);
    };

    const handleGroupSelect = (groupId: string) => {
        setActiveGroupId(groupId);
    };

    const handleRefreshGroups = async () => {
        setIsRefreshing(true);
        try {
            await fetchGroups();
            toast({
                title: "Grupper oppdatert",
                description: "Gruppelisten er nå oppdatert.",
                variant: "default"
            });
        } catch (error) {
            console.error("Feil ved oppdatering av grupper:", error);
            toast({
                title: "Kunne ikke oppdatere grupper",
                description: "Prøv igjen senere.",
                variant: "destructive"
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCreateSuccess = (newGroupId: string) => {
        // Oppdaterer gruppene og aktiverer den nye gruppen automatisk
        fetchGroups().then(() => {
            setActiveGroupId(newGroupId);
            toast({
                title: "Gruppe aktivert",
                description: "Du er nå i den nyopprettede gruppen.",
                variant: "default"
            });
        }).catch(console.error);
    };

    const getSecurityLevelIcon = (securityLevel?: SecurityLevel) => {
        switch (securityLevel) {
            case "low":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                <p>Lavt sikkerhetsnivå</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case "standard":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                <p>Standard sikkerhetsnivå</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case "high":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-cybergold-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                <p>Høyt sikkerhetsnivå</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case "maximum":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                <p>Maksimalt sikkerhetsnivå</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            default:
                return null;
        }
    };

    // Filtrer gruppene basert på søkestrengen
    const filteredGroups = myGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Sorter de filtrerte gruppene: uleste først, deretter alfabetisk
    const sortedGroups = [...filteredGroups].sort((a, b) => {
        // Først sorterer vi etter uleste
        if (a.unreadCount && !b.unreadCount) return -1;
        if (!a.unreadCount && b.unreadCount) return 1;
        // Deretter alfabetisk
        return a.name.localeCompare(b.name);
    });

    if (loading) {
        return (
            <div className="space-y-3 p-3 bg-gradient-to-b from-cyberdark-850 to-cyberdark-900 rounded-lg border border-cyberdark-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-cybergold-400">Mine grupper</h2>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-cyberdark-800/40 rounded-lg border border-cyberdark-700">
                            <Skeleton className="h-10 w-10 rounded-full bg-cyberdark-700" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24 bg-cyberdark-700" />
                                <Skeleton className="h-3 w-16 bg-cyberdark-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full bg-gradient-to-b from-cyberdark-850 to-cyberdark-900 rounded-lg border border-cyberdark-800 overflow-hidden">
                <div className="p-4 border-b border-cyberdark-750 bg-cyberdark-900">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <h2 className="text-lg font-semibold text-cybergold-400">Mine grupper</h2>
                            <button
                                onClick={handleRefreshGroups}
                                disabled={isRefreshing}
                                className={cn(
                                    "ml-2 p-1.5 rounded-full transition-all duration-200",
                                    "text-cybergold-600 hover:text-cybergold-400",
                                    "hover:bg-cyberdark-800/50",
                                    isRefreshing && "animate-spin text-cybergold-400"
                                )}
                                title="Oppdater gruppelisten"
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </button>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setShowCreateModal(true)}
                            className={cn(
                                "bg-gradient-to-r from-cybergold-600 to-cybergold-700",
                                "hover:from-cybergold-500 hover:to-cybergold-600",
                                "text-black font-medium transition-all",
                                "shadow-[0_2px_8px_rgba(218,188,69,0.25)]",
                                "border border-cybergold-900/50"
                            )}
                        >
                            <Plus className="h-4 w-4 mr-1.5" /> Opprett
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-600" />
                        <Input 
                            placeholder="Søk i grupper..." 
                            className={cn(
                                "pl-9 bg-cyberdark-800/80 border-cyberdark-700",
                                "placeholder:text-cybergold-800 text-cybergold-400",
                                "focus-visible:ring-cybergold-500/30 focus-visible:border-cybergold-700"
                            )}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {sortedGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        {searchQuery ? (
                            <>
                                <Search className="h-12 w-12 mb-2 text-cybergold-700" />
                                <h3 className="font-medium text-cybergold-400">Ingen treff</h3>
                                <p className="text-sm mb-4 text-cybergold-700">
                                    Ingen grupper matcher "{searchQuery}"
                                </p>
                                <Button 
                                    variant="outline"
                                    onClick={() => setSearchQuery("")}
                                    className="border-cyberdark-700 text-cybergold-500"
                                >
                                    Nullstill søk
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="p-4 rounded-full bg-gradient-to-br from-cyberdark-800 to-cyberdark-900 border border-cyberdark-700 shadow-xl mb-3">
                                    <Users className="h-12 w-12 text-cybergold-400" />
                                </div>
                                <h3 className="font-medium text-cybergold-400">Ingen grupper enda</h3>
                                <p className="text-sm mb-6 text-cybergold-700 max-w-xs">
                                    Opprett din første gruppe for å starte samtaler med venner eller kollegaer
                                </p>
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className={cn(
                                        "bg-gradient-to-r from-cybergold-600 to-cybergold-700",
                                        "hover:from-cybergold-500 hover:to-cybergold-600",
                                        "text-black font-medium",
                                        "shadow-[0_2px_10px_rgba(218,188,69,0.25)]"
                                    )}
                                >
                                    <Plus className="h-4 w-4 mr-1.5" /> Opprett gruppe
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
                        {sortedGroups.map((group) => (
                            <div
                                key={group.id}
                                className={cn(
                                    "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 relative group border",
                                    activeGroupId === group.id 
                                        ? "bg-gradient-to-r from-cyberdark-800 to-cyberdark-850 border-cybergold-800" 
                                        : "hover:bg-cyberdark-800/70 border-transparent",
                                    hoveredGroup === group.id && "bg-cyberdark-800/50"
                                )}
                                onClick={() => handleGroupSelect(group.id)}
                                onMouseEnter={() => setHoveredGroup(group.id)}
                                onMouseLeave={() => setHoveredGroup(null)}
                            >
                                {/* Aktiv indikator */}
                                {activeGroupId === group.id && (
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cybergold-400 to-cybergold-600 rounded-r-full shadow-[0_0_6px_rgba(218,188,69,0.3)]" />
                                )}
                                
                                {/* Gruppe avatar */}
                                {group.avatarUrl ? (
                                    <div className={cn(
                                        "relative h-10 w-10 rounded-full overflow-hidden border-2",
                                        activeGroupId === group.id 
                                            ? "border-cybergold-600" 
                                            : "border-cyberdark-700",
                                        "transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(218,188,69,0.15)]"
                                    )}>
                                        <img
                                            src={group.avatarUrl}
                                            alt={group.name}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "relative h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br transition-all duration-300",
                                        activeGroupId === group.id
                                            ? "from-cybergold-900 to-cyberdark-900 text-cybergold-400 border-2 border-cybergold-800" 
                                            : "from-cyberdark-800 to-cyberdark-900 text-cybergold-600 border border-cyberdark-700",
                                        "group-hover:shadow-[0_0_8px_rgba(218,188,69,0.15)]"
                                    )}>
                                        <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                )}

                                {/* Gruppe informasjon */}
                                <div className="ml-3 flex-1 overflow-hidden">
                                    <div className="flex items-center">
                                        <h3 className={cn(
                                            "font-medium truncate",
                                            activeGroupId === group.id ? "text-cybergold-400" : "text-cybergold-300"
                                        )}>
                                            {group.name}
                                        </h3>
                                        <div className="flex items-center ml-1.5 space-x-1.5">
                                            {group.isPremium && (
                                                <Star className="h-3.5 w-3.5 text-cybergold-500 fill-cybergold-500" />
                                            )}
                                            {group.visibility === "private" ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Lock className="h-3.5 w-3.5 text-cybergold-600" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                                            <p>Privat gruppe</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Globe className="h-3.5 w-3.5 text-cybergold-600" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="bg-cyberdark-900 text-xs border-cyberdark-700">
                                                            <p>Offentlig gruppe</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {group.securityLevel && getSecurityLevelIcon(group.securityLevel)}
                                        </div>
                                    </div>
                                    {group.description && (
                                        <p className="text-xs truncate text-cybergold-700">
                                            {group.description}
                                        </p>
                                    )}
                                    <div className="flex items-center text-xs space-x-2 mt-0.5">
                                        <p className="text-cybergold-700/80">
                                            {group.memberCount} {group.memberCount === 1 ? "medlem" : "medlemmer"}
                                        </p>
                                        {group.unreadCount > 0 && (
                                            <Badge 
                                                className={cn(
                                                    "px-1.5 py-0.5 bg-gradient-to-r from-cybergold-500 to-cybergold-600",
                                                    "text-black text-xs rounded-full font-semibold",
                                                    "shadow-[0_0_6px_rgba(218,188,69,0.3)] border-0"
                                                )}
                                            >
                                                {group.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Invite button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all duration-200",
                                        "opacity-0 group-hover:opacity-100",
                                        activeGroupId === group.id ? "text-cybergold-400" : "text-cybergold-600",
                                        "hover:bg-cyberdark-700 hover:text-cybergold-400"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInviteClick(group.id);
                                    }}
                                    title="Inviter medlemmer"
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {selectedGroupId && (
                <InviteGroupModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    groupId={selectedGroupId}
                />
            )}
        </>
    );
};
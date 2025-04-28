import { useState } from "react";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateGroupModal } from "./CreateGroupModal";
import { InviteGroupModal } from "./InviteGroupModal";
import { UserPlus, Users, Lock, Globe, Plus, LoaderCircle } from "lucide-react";
import { type Group } from "@/types/groups";
import { useTheme } from "@/contexts/ThemeContext";

export const GroupList = () => {
    const { myGroups, loading, activeGroupId, setActiveGroupId } = useGroups();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleInviteClick = (groupId: string) => {
        setSelectedGroupId(groupId);
        setShowInviteModal(true);
    };

    const handleGroupSelect = (groupId: string) => {
        setActiveGroupId(groupId);
    };

    if (loading) {
        return (
            <div className="space-y-3 p-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Mine grupper</h2>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-2 p-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-3">
                    <h2 className="text-lg font-semibold">Mine grupper</h2>
                    <Button
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                        className={`${isDark
                            ? 'bg-gradient-to-r from-cyberblue-600 to-cyberblue-800'
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Ny
                    </Button>
                </div>

                {myGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <Users className={`h-12 w-12 mb-2 ${isDark ? 'text-cybergold-400' : 'text-blue-500'}`} />
                        <h3 className="font-medium">Ingen grupper enda</h3>
                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Opprett din første gruppe for å starte samtaler med venner og familie
                        </p>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="h-4 w-4 mr-1" /> Opprett gruppe
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1 px-2">
                        {myGroups.map((group) => (
                            <div
                                key={group.id}
                                className={`flex items-center p-2 my-1 rounded-lg cursor-pointer transition-colors 
                  ${activeGroupId === group.id
                                        ? isDark
                                            ? 'bg-cyberdark-700'
                                            : 'bg-blue-100'
                                        : isDark
                                            ? 'hover:bg-cyberdark-800'
                                            : 'hover:bg-gray-100'}`}
                                onClick={() => handleGroupSelect(group.id)}
                            >
                                {group.avatarUrl ? (
                                    <img
                                        src={group.avatarUrl}
                                        alt={group.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${isDark ? 'bg-cyberblue-900 text-cyberblue-300' : 'bg-blue-100 text-blue-600'}`}>
                                        <Users className="h-5 w-5" />
                                    </div>
                                )}

                                <div className="ml-3 flex-1 overflow-hidden">
                                    <div className="flex items-center">
                                        <h3 className="font-medium truncate">{group.name}</h3>
                                        {group.visibility === "private" ? (
                                            <Lock className={`h-3 w-3 ml-1 ${isDark ? 'text-cyberred-400' : 'text-red-500'}`} />
                                        ) : (
                                            <Globe className={`h-3 w-3 ml-1 ${isDark ? 'text-cyberblue-400' : 'text-blue-500'}`} />
                                        )}
                                    </div>
                                    {group.description && (
                                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {group.description}
                                        </p>
                                    )}
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {group.memberCount} {group.memberCount === 1 ? "medlem" : "medlemmer"}
                                    </p>
                                </div>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={`h-7 w-7 rounded-full ${isDark ? 'hover:bg-cyberdark-700' : 'hover:bg-gray-200'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInviteClick(group.id);
                                    }}
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
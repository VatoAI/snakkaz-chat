import { useState } from 'react';
import { GroupList } from '@/components/groups/GroupList';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, MessageSquare, Users, UserPlus } from 'lucide-react';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import { useGroups } from '@/hooks/useGroups';

const GroupsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { activeGroupId, groups } = useGroups();

    const activeGroup = groups.find(g => g.id === activeGroupId);

    return (
        <div className={`flex flex-col h-screen ${isDark ? 'dark' : ''}`}>
            <header className={`flex items-center justify-between p-4 border-b 
        ${isDark
                    ? 'bg-cyberdark-900 border-cybergold-500/30 text-white'
                    : 'bg-white border-gray-200 text-gray-800'}`}>
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold">SnakkaZ Grupper</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Opprett gruppe
                    </Button>
                    <ThemeToggle />
                </div>
            </header>

            <div className={`flex flex-1 overflow-hidden 
        ${isDark ? 'bg-cyberdark-950' : 'bg-gray-100'}`}>
                <aside className={`w-64 border-r overflow-hidden flex flex-col
          ${isDark
                        ? 'bg-cyberdark-900 border-cybergold-500/30'
                        : 'bg-white border-gray-200'}`}>
                    <GroupList />
                </aside>

                <main className="flex-1 flex flex-col overflow-hidden">
                    {activeGroupId && activeGroup ? (
                        <>
                            <div className={`p-3 border-b flex items-center justify-between
                ${isDark
                                    ? 'bg-cyberdark-800 border-cybergold-500/30'
                                    : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2
                    ${isDark ? 'bg-cyberblue-900 text-cyberblue-300' : 'bg-blue-100 text-blue-600'}`}>
                                        <Users className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">{activeGroup.name}</h2>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {activeGroup.memberCount} {activeGroup.memberCount === 1 ? "medlem" : "medlemmer"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <MessageSquare className={`h-12 w-12 mb-3 ${isDark ? 'text-cybergold-400' : 'text-blue-500'}`} />
                                    <h3 className="font-medium text-lg mb-1">Ingen meldinger ennå</h3>
                                    <p className={`text-center max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Send den første meldingen i denne gruppen for å starte samtalen.
                                    </p>
                                </div>
                            </div>

                            <div className={`p-4 border-t
                ${isDark
                                    ? 'bg-cyberdark-800 border-cybergold-500/30'
                                    : 'bg-white border-gray-200'}`}>
                                <div className={`flex items-center gap-2 rounded-lg p-2
                  ${isDark ? 'bg-cyberdark-700' : 'bg-gray-100'}`}>
                                    <input
                                        type="text"
                                        placeholder="Skriv en melding..."
                                        className={`flex-1 bg-transparent border-none outline-none
                      ${isDark ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'}`}
                                    />
                                    <Button
                                        size="sm"
                                        className={`${isDark
                                            ? 'bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Users className={`h-16 w-16 mb-3 ${isDark ? 'text-cybergold-400' : 'text-blue-500'}`} />
                            <h2 className="font-semibold text-xl mb-1">Velg eller opprett en gruppe</h2>
                            <p className={`text-center max-w-md mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Velg en gruppe fra sidepanelet eller opprett en ny for å starte en samtale.
                            </p>
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className={`${isDark
                                    ? 'bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Opprett ny gruppe
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default GroupsPage;
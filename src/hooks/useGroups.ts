import { useState, useEffect } from 'react';
import { Group, GroupMember, GroupInvite } from '@/types/groups';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
// import { supabase } from '@/integrations/supabase'; // Kommentert ut inntil vi har tilgang til Supabase-konfigurasjon

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [invites, setInvites] = useState<GroupInvite[]>([]);

    const { user } = useAuth();
    const { toast } = useToast();

    // Dummy data for now, will be replaced with actual Supabase calls
    const dummyGroups: Group[] = [
        {
            id: '1',
            name: 'Venner',
            description: 'Gruppe for nære venner',
            avatarUrl: 'https://picsum.photos/200',
            visibility: 'private',
            createdAt: new Date(),
            createdBy: user?.id || '',
            updatedAt: new Date(),
            memberCount: 5
        },
        {
            id: '2',
            name: 'Familie',
            description: 'Familiegruppe',
            avatarUrl: 'https://picsum.photos/201',
            visibility: 'private',
            createdAt: new Date(),
            createdBy: user?.id || '',
            updatedAt: new Date(),
            memberCount: 8
        },
        {
            id: '3',
            name: 'Kolleger',
            description: 'Arbeidsgruppe',
            avatarUrl: 'https://picsum.photos/202',
            visibility: 'private',
            createdAt: new Date(),
            createdBy: '123456',
            updatedAt: new Date(),
            memberCount: 12
        }
    ];

    // Last grupper (dummy data foreløpig)
    useEffect(() => {
        if (user) {
            try {
                setLoading(true);
                // Simuler API-kall
                setTimeout(() => {
                    setGroups(dummyGroups);
                    setMyGroups(dummyGroups.filter(g => g.createdBy === user.id));
                    setLoading(false);
                }, 500);
            } catch (err) {
                setError('Kunne ikke laste grupper');
                setLoading(false);
                console.error('Error loading groups:', err);
            }
        }
    }, [user]);

    // Opprett en ny gruppe
    const createGroup = async (groupData: Partial<Group>) => {
        if (!user) {
            toast({
                title: "Ikke autorisert",
                description: "Du må være pålogget for å opprette en gruppe",
                variant: "destructive"
            });
            return null;
        }

        try {
            setLoading(true);
            // Simuler API-kall
            const newGroup: Group = {
                id: crypto.randomUUID(),
                name: groupData.name || 'Ny gruppe',
                description: groupData.description,
                avatarUrl: groupData.avatarUrl,
                visibility: groupData.visibility || 'private',
                createdAt: new Date(),
                createdBy: user.id,
                updatedAt: new Date(),
                memberCount: 1
            };

            setTimeout(() => {
                setGroups(prev => [...prev, newGroup]);
                setMyGroups(prev => [...prev, newGroup]);
                setLoading(false);

                toast({
                    title: "Gruppe opprettet",
                    description: `${newGroup.name} har blitt opprettet!`
                });
            }, 500);

            return newGroup;
        } catch (err) {
            setError('Kunne ikke opprette gruppe');
            setLoading(false);
            console.error('Error creating group:', err);

            toast({
                title: "Feil ved oppretting av gruppe",
                description: "Kunne ikke opprette gruppen. Prøv igjen senere.",
                variant: "destructive"
            });

            return null;
        }
    };

    // Inviter bruker til gruppe
    const inviteToGroup = async (groupId: string, email: string) => {
        if (!user) return;

        try {
            // Simuler API-kall
            const invite: GroupInvite = {
                id: crypto.randomUUID(),
                groupId,
                inviterId: user.id,
                inviteeEmail: email,
                code: Math.random().toString(36).substring(2, 10).toUpperCase(),
                status: 'pending',
                createdAt: new Date()
            };

            setInvites(prev => [...prev, invite]);

            toast({
                title: "Invitasjon sendt",
                description: `Invitasjon sendt til ${email}`,
            });

            return invite;
        } catch (err) {
            console.error('Error inviting user:', err);

            toast({
                title: "Feil ved sending av invitasjon",
                description: "Kunne ikke sende invitasjonen. Prøv igjen senere.",
                variant: "destructive"
            });

            return null;
        }
    };

    // Aksepter invitasjon
    const acceptInvite = async (code: string) => {
        if (!user) return;

        try {
            // Finner invitasjonen basert på koden
            const invite = invites.find(i => i.code === code && i.status === 'pending');
            if (!invite) {
                toast({
                    title: "Ugyldig invitasjonskode",
                    description: "Invitasjonskoden eksisterer ikke eller har utløpt.",
                    variant: "destructive"
                });
                return null;
            }

            // Oppdaterer invitasjonsstatusen
            setInvites(prev =>
                prev.map(i => i.id === invite.id ? { ...i, status: 'accepted' } : i)
            );

            // Finner gruppen som invitasjonen gjelder for
            const group = groups.find(g => g.id === invite.groupId);
            if (group) {
                setMyGroups(prev => [...prev, group]);
            }

            toast({
                title: "Invitasjon akseptert",
                description: `Du har blitt med i gruppen ${group?.name || 'Ukjent gruppe'}`,
            });

            return group;
        } catch (err) {
            console.error('Error accepting invite:', err);

            toast({
                title: "Feil ved akseptering av invitasjon",
                description: "Kunne ikke akseptere invitasjonen. Prøv igjen senere.",
                variant: "destructive"
            });

            return null;
        }
    };

    // Forlat gruppe
    const leaveGroup = async (groupId: string) => {
        if (!user) return;

        try {
            // Oppdaterer gruppelisten
            setMyGroups(prev => prev.filter(g => g.id !== groupId));

            toast({
                title: "Gruppe forlatt",
                description: "Du har forlatt gruppen.",
            });

            return true;
        } catch (err) {
            console.error('Error leaving group:', err);

            toast({
                title: "Feil ved forlating av gruppe",
                description: "Kunne ikke forlate gruppen. Prøv igjen senere.",
                variant: "destructive"
            });

            return false;
        }
    };

    return {
        groups,
        myGroups,
        loading,
        error,
        activeGroupId,
        setActiveGroupId,
        invites,
        createGroup,
        inviteToGroup,
        acceptInvite,
        leaveGroup
    };
}
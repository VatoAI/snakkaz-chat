import { useState, useEffect, useCallback } from 'react';
import { Group, GroupMember, GroupInvitation, CreateGroupData } from '@/types/groups';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [invites, setInvites] = useState<GroupInvitation[]>([]);
    const [isPremium, setIsPremium] = useState<boolean>(false);

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
            securityLevel: 'standard',
            is_premium: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            memberCount: 5,
            unreadCount: 0
        },
        {
            id: '2',
            name: 'Familie',
            description: 'Familiegruppe',
            avatarUrl: 'https://picsum.photos/201',
            visibility: 'private',
            securityLevel: 'standard',
            is_premium: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            memberCount: 8,
            unreadCount: 2
        },
        {
            id: '3',
            name: 'Cybersecurity',
            description: 'Premium gruppe med kryptert kommunikasjon',
            avatarUrl: 'https://picsum.photos/202',
            visibility: 'private',
            securityLevel: 'maximum',
            is_premium: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            memberCount: 12,
            unreadCount: 5
        }
    ];

    // Fetch groups - hent grupper med mulighet for manuell oppdatering
    const fetchGroups = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            // Simuler API-kall
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    setGroups(dummyGroups);
                    setMyGroups(dummyGroups);
                    setLoading(false);
                    resolve();
                }, 500);
            });
        } catch (err) {
            setError('Kunne ikke laste grupper');
            setLoading(false);
            console.error('Error loading groups:', err);
            throw err;
        }
    }, [user]);

    // Sjekk premium-status
    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (!user) return;

            try {
                // I en virkelig implementasjon ville dette være et kall til Supabase
                // For demo-formål setter vi premium-status basert på lokale data

                // Simuler API-kall for å hente premium-status
                setTimeout(() => {
                    // 30% sjanse for at brukeren er premium i demo
                    const hasRandomPremium = Math.random() < 0.3;
                    setIsPremium(hasRandomPremium);
                }, 500);

                // Virkelig implementasjon ville være noe som:
                // const { data, error } = await supabase
                //   .from('user_subscriptions')
                //   .select('*')
                //   .eq('user_id', user.id)
                //   .eq('subscription_type', 'premium')
                //   .gt('expires_at', new Date().toISOString())
                //   .single();
                // 
                // setIsPremium(!!data);

            } catch (err) {
                console.error('Error checking premium status:', err);
            }
        };

        checkPremiumStatus();
    }, [user]);

    // Last grupper
    useEffect(() => {
        fetchGroups().catch(console.error);
    }, [fetchGroups]);

    // Opprett en ny gruppe
    const createGroup = async (groupData: CreateGroupData) => {
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
                name: groupData.name,
                description: groupData.description,
                visibility: groupData.visibility,
                is_premium: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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

    // Opprett en premium-gruppe
    const createPremiumGroup = async (groupData: CreateGroupData) => {
        if (!user) {
            toast({
                title: "Ikke autorisert",
                description: "Du må være pålogget for å opprette en premium-gruppe",
                variant: "destructive"
            });
            return null;
        }

        // Sjekk om brukeren har premium-tilgang
        if (!isPremium) {
            toast({
                title: "Premium-tilgang kreves",
                description: "Du må ha et premium-abonnement for å opprette krypterte grupper.",
                variant: "destructive"
            });
            return null;
        }

        try {
            setLoading(true);
            // Simuler API-kall
            const newGroup: Group = {
                id: crypto.randomUUID(),
                name: groupData.name,
                description: groupData.description,
                visibility: groupData.visibility,
                is_premium: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                memberCount: 1
            };

            setTimeout(() => {
                setGroups(prev => [...prev, newGroup]);
                setMyGroups(prev => [...prev, newGroup]);
                setLoading(false);

                toast({
                    title: "Premium-gruppe opprettet",
                    description: `${newGroup.name} har blitt opprettet med kryptert kommunikasjon!`
                });
            }, 500);

            return newGroup;
        } catch (err) {
            setError('Kunne ikke opprette premium-gruppe');
            setLoading(false);
            console.error('Error creating premium group:', err);

            toast({
                title: "Feil ved oppretting av premium-gruppe",
                description: "Kunne ikke opprette premium-gruppen. Prøv igjen senere.",
                variant: "destructive"
            });

            return null;
        }
    };

    // Inviter bruker til gruppe
    const inviteToGroup = async (groupId: string, email: string) => {
        if (!user) return null;

        try {
            // Simuler API-kall
            const invite: GroupInvitation = {
                id: crypto.randomUUID(),
                group_id: groupId,
                email,
                code: Math.random().toString(36).substring(2, 10).toUpperCase(),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dager
                created_by: user.id,
                createdAt: new Date().toISOString()
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
        if (!user) return null;

        try {
            // Finner invitasjonen basert på koden
            const invite = invites.find(i => i.code === code);
            if (!invite) {
                toast({
                    title: "Ugyldig invitasjonskode",
                    description: "Invitasjonskoden eksisterer ikke eller har utløpt.",
                    variant: "destructive"
                });
                return null;
            }

            // Sjekker om invitasjonen har utløpt
            if (new Date(invite.expires_at) < new Date()) {
                toast({
                    title: "Invitasjonen har utløpt",
                    description: "Invitasjonen er ikke lenger gyldig.",
                    variant: "destructive"
                });
                return null;
            }

            // Finner gruppen som invitasjonen gjelder for
            const group = groups.find(g => g.id === invite.group_id);
            if (group) {
                // Sjekk om gruppen er premium og brukeren har premium-tilgang
                if (group.is_premium && !isPremium) {
                    toast({
                        title: "Premium-tilgang kreves",
                        description: "Du må ha et premium-abonnement for å bli med i denne gruppen.",
                        variant: "destructive"
                    });
                    return null;
                }

                setMyGroups(prev => [...prev, group]);

                // Fjern invitasjonen fra listen
                setInvites(prev => prev.filter(i => i.id !== invite.id));

                toast({
                    title: "Invitasjon akseptert",
                    description: `Du har blitt med i gruppen ${group.name}`,
                });
            }

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
        if (!user) return false;

        try {
            // Oppdaterer gruppelisten
            setMyGroups(prev => prev.filter(g => g.id !== groupId));

            // Hvis aktiv gruppe forlates, nullstill aktiv gruppe
            if (activeGroupId === groupId) {
                setActiveGroupId(null);
            }

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

    // Oppgrader til premium-abonnement
    const upgradeToPremium = async () => {
        // I en virkelig implementasjon ville dette åpne betalingssiden
        // For demo-formål setter vi premium til true direkte
        setIsPremium(true);

        toast({
            title: "Oppgradert til Premium!",
            description: "Du har nå tilgang til alle premium-funksjoner.",
        });

        return true;
    };

    return {
        groups,
        myGroups,
        loading,
        error,
        activeGroupId,
        setActiveGroupId,
        invites,
        isPremium,
        createGroup,
        createPremiumGroup,
        inviteToGroup,
        acceptInvite,
        leaveGroup,
        upgradeToPremium,
        fetchGroups
    };
}
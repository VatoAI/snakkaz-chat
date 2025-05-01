import { useState, useEffect, useCallback } from 'react';
import { Group, GroupMember, GroupInvitation, CreateGroupData } from '@/types/groups';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocalStorage } from './useLocalStorage';

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeGroupId, setActiveGroupId] = useLocalStorage<string | null>('snakkaz_active_group_id', null);
    const [invites, setInvites] = useState<GroupInvitation[]>([]);
    const [isPremium, setIsPremium] = useState<boolean>(false);

    const { user } = useAuth();
    const { toast } = useToast();

    const fetchGroups = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            const { data: groupsData, error: groupsError } = await supabase
                .from('groups')
                .select('*');

            if (groupsError) {
                throw groupsError;
            }

            if (!groupsData || groupsData.length === 0) {
                if (import.meta.env.DEV) {
                    console.log('Ingen grupper funnet i Supabase, bruker dummy data for utvikling');
                    const dummyGroups: Group[] = [
                        {
                            id: '1',
                            name: 'Venner',
                            description: 'Gruppe for nære venner',
                            avatarUrl: 'https://picsum.photos/200',
                            visibility: 'private',
                            is_premium: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            memberCount: 5
                        },
                        {
                            id: '2',
                            name: 'Familie',
                            description: 'Familiegruppe',
                            avatarUrl: 'https://picsum.photos/201',
                            visibility: 'private',
                            is_premium: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            memberCount: 8
                        },
                        {
                            id: '3',
                            name: 'Cybersecurity',
                            description: 'Premium gruppe med kryptert kommunikasjon',
                            avatarUrl: 'https://picsum.photos/202',
                            visibility: 'private',
                            is_premium: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            memberCount: 12
                        }
                    ];

                    setGroups(dummyGroups);
                    setMyGroups(dummyGroups);
                } else {
                    setGroups([]);
                    setMyGroups([]);
                }
            } else {
                const formattedGroups = groupsData.map(group => ({
                    ...group,
                    createdAt: group.created_at || new Date().toISOString(),
                    updatedAt: group.updated_at || new Date().toISOString(),
                    memberCount: group.member_count || 1,
                    is_premium: group.is_premium || false
                }));

                setGroups(formattedGroups);

                const { data: memberships, error: membershipsError } = await supabase
                    .from('group_members')
                    .select('group_id')
                    .eq('user_id', user.id);

                if (membershipsError) {
                    console.error('Feil ved henting av gruppemedlemskap:', membershipsError);
                } else if (memberships && memberships.length > 0) {
                    const myGroupIds = memberships.map(m => m.group_id);
                    const myGroupsList = formattedGroups.filter(g => myGroupIds.includes(g.id));
                    setMyGroups(myGroupsList);
                } else {
                    setMyGroups([]);
                }
            }

            setLoading(false);
        } catch (err) {
            setError('Kunne ikke laste grupper');
            setLoading(false);
            console.error('Error loading groups:', err);
            throw err;
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchGroups().catch(err => {
                console.error('Error in initial fetchGroups:', err);
            });
        }
    }, [user, fetchGroups]);

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

            const { data: newGroupData, error: createError } = await supabase
                .from('groups')
                .insert([{
                    name: groupData.name,
                    description: groupData.description,
                    visibility: groupData.visibility,
                    security_level: groupData.securityLevel || "standard",
                    is_premium: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: user.id
                }])
                .select()
                .single();

            if (createError) {
                throw createError;
            }

            if (!newGroupData) {
                throw new Error('Ingen data returnert ved oppretting av gruppe');
            }

            const newGroup: Group = {
                id: newGroupData.id,
                name: newGroupData.name,
                description: newGroupData.description,
                visibility: newGroupData.visibility,
                securityLevel: newGroupData.security_level || "standard",
                is_premium: false,
                createdAt: newGroupData.created_at,
                updatedAt: newGroupData.updated_at,
                memberCount: 1,
                unreadCount: 0
            };

            const { error: memberError } = await supabase
                .from('group_members')
                .insert([{
                    group_id: newGroup.id,
                    user_id: user.id,
                    role: 'admin',
                    added_at: new Date().toISOString(),
                    added_by: user.id
                }]);

            if (memberError) {
                console.error('Feil ved tillegging av medlem til ny gruppe:', memberError);
            }

            setGroups(prev => [...prev, newGroup]);
            setMyGroups(prev => [...prev, newGroup]);
            setActiveGroupId(newGroup.id);

            setLoading(false);

            toast({
                title: "Gruppe opprettet",
                description: `${newGroup.name} har blitt opprettet!`
            });

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

    const createPremiumGroup = async (groupData: CreateGroupData) => {
        if (!user) {
            toast({
                title: "Ikke autorisert",
                description: "Du må være pålogget for å opprette en premium-gruppe",
                variant: "destructive"
            });
            return null;
        }

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

            const { data: newGroupData, error: createError } = await supabase
                .from('groups')
                .insert([{
                    name: groupData.name,
                    description: groupData.description,
                    visibility: groupData.visibility,
                    is_premium: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: user.id
                }])
                .select()
                .single();

            if (createError) {
                throw createError;
            }

            if (!newGroupData) {
                throw new Error('Ingen data returnert ved oppretting av premium-gruppe');
            }

            const newGroup: Group = {
                id: newGroupData.id,
                name: newGroupData.name,
                description: newGroupData.description,
                visibility: newGroupData.visibility,
                is_premium: true,
                createdAt: newGroupData.created_at,
                updatedAt: newGroupData.updated_at,
                memberCount: 1
            };

            const { error: memberError } = await supabase
                .from('group_members')
                .insert([{
                    group_id: newGroup.id,
                    user_id: user.id,
                    role: 'admin',
                    added_at: new Date().toISOString(),
                    added_by: user.id
                }]);

            if (memberError) {
                console.error('Feil ved tillegging av medlem til ny premium-gruppe:', memberError);
            }

            setGroups(prev => [...prev, newGroup]);
            setMyGroups(prev => [...prev, newGroup]);
            setActiveGroupId(newGroup.id);

            setLoading(false);

            toast({
                title: "Premium-gruppe opprettet",
                description: `${newGroup.name} har blitt opprettet med kryptert kommunikasjon!`
            });

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
        fetchGroups
    };
}
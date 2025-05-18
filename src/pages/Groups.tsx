// Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning
import { supabase } from '@/lib/supabaseClient';
// Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning
import { supabase } from '@/lib/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import useEncryption from './hooks/useEncryption';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

// Supabase-konfigurasjon
import { ENV } from '@/utils/env/environmentFix';
const supabaseUrl = ENV.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Type definisjoner
interface Group {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  is_private: boolean;
  member_count: number;
  is_member: boolean;
}

interface Member {
  user_id: string;
  username: string;
  role: 'admin' | 'member';
  joined_at: string;
}

const Groups: React.FC = () => {
  const { user } = useAuth();
  const { hasKeys, encryptForGroup } = useEncryption();
  // REPLACED: // REPLACED: const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For å opprette nye grupper
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  
  // For gruppedetaljer
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<Member[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Last inn grupper
  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);
  
  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Hent brukerens medlemskapsinformasjon
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.uid);
      
      if (membershipError) throw new Error(`Feil ved henting av gruppemedlemskap: ${membershipError.message}`);
      
      // Opprett et sett med gruppe-IDer som brukeren er medlem av
      const memberGroupIds = new Set(memberships?.map(m => m.group_id) || []);
      
      // Hent alle offentlige grupper og private grupper brukeren er medlem av
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');
      
      if (groupsError) throw new Error(`Feil ved henting av grupper: ${groupsError.message}`);
      
      // Legg til informasjon om brukeren er medlem og medlemsantall
      const groupsWithMemberInfo = await Promise.all((groupsData || []).map(async (group) => {
        const { count, error: countError } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
        
        const isMember = memberGroupIds.has(group.id);
        
        // Filtrer ut private grupper som brukeren ikke er medlem av
        if (group.is_private && !isMember) return null;
        
        return {
          ...group,
          member_count: count || 0,
          is_member: isMember
        };
      }));
      
      // Fjern null-verdier (private grupper som brukeren ikke er medlem av)
      const filteredGroups = groupsWithMemberInfo.filter(Boolean) as Group[];
      
      setGroups(filteredGroups);
    } catch (error) {
      console.error('Feil ved henting av grupper:', error);
      setError(error instanceof Error ? error.message : 'Ukjent feil ved henting av grupper');
    } finally {
      setLoading(false);
    }
  };
  
  // Opprett en ny gruppe
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Du må være logget inn for å opprette en gruppe');
      return;
    }
    
    if (!newGroupName.trim()) {
      setError('Gruppenavnet kan ikke være tomt');
      return;
    }
    
    try {
      setCreatingGroup(true);
      setError(null);
      
      // Opprett gruppen i databasen
      const { data: newGroup, error: createError } = await supabase
        .from('groups')
        .insert([{
          name: newGroupName,
          description: newGroupDescription,
          is_private: isPrivate,
          created_by: user.uid
        }])
        .select()
        .single();
      
      if (createError) throw new Error(`Feil ved oppretting av gruppe: ${createError.message}`);
      
      if (!newGroup) {
        throw new Error('Kunne ikke opprette gruppe: Ingen data returnert');
      }
      
      // Legg til brukeren som administrator for gruppen
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([{
          group_id: newGroup.id,
          user_id: user.uid,
          role: 'admin',
          joined_at: new Date().toISOString()
        }]);
      
      if (memberError) throw new Error(`Feil ved tillegging av bruker som admin: ${memberError.message}`);
      
      // Opprett en gruppenøkkel for kryptert kommunikasjon
      // Dette ville normalt gjøres med ekte krypteringslogikk
      const { error: keyError } = await supabase
        .from('group_keys')
        .insert([{
          group_id: newGroup.id,
          user_id: user.uid,
          encrypted_key: 'mock-encrypted-key', // Her ville vi egentlig bruke krypteringslogikk
          created_at: new Date().toISOString()
        }]);
      
      if (keyError) throw new Error(`Feil ved opprettelse av gruppenøkkel: ${keyError.message}`);
      
      // Nullstill skjemaet og skjul det
      setNewGroupName('');
      setNewGroupDescription('');
      setIsPrivate(false);
      setShowCreateForm(false);
      
      // Oppdater gruppelisten
      await fetchGroups();
    } catch (error) {
      console.error('Feil ved oppretting av gruppe:', error);
      setError(error instanceof Error ? error.message : 'Ukjent feil ved oppretting av gruppe');
    } finally {
      setCreatingGroup(false);
    }
  };
  
  // Bli med i en gruppe
  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      setError('Du må være logget inn for å bli med i en gruppe');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Sjekk om brukeren allerede er medlem
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.uid)
        .single();
      
      if (!checkError && existingMember) {
        setError('Du er allerede medlem av denne gruppen');
        return;
      }
      
      // Legg til bruker som medlem
      const { error: joinError } = await supabase
        .from('group_members')
        .insert([{
          group_id: groupId,
          user_id: user.uid,
          role: 'member',
          joined_at: new Date().toISOString()
        }]);
      
      if (joinError) throw new Error(`Feil ved tilmelding til gruppe: ${joinError.message}`);
      
      // Oppdater gruppelisten
      await fetchGroups();
      
    } catch (error) {
      console.error('Feil ved tilmelding til gruppe:', error);
      setError(error instanceof Error ? error.message : 'Ukjent feil ved tilmelding til gruppe');
    } finally {
      setLoading(false);
    }
  };
  
  // Få gruppedetaljer
  const handleViewGroupDetails = async (group: Group) => {
    if (!user) return;
    
    try {
      setLoadingDetails(true);
      setSelectedGroup(group);
      
      // Hent medlemmer
      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select(`
          user_id,
          role,
          joined_at,
          users:user_id (username)
        `)
        .eq('group_id', group.id);
      
      if (membersError) throw new Error(`Feil ved henting av gruppemedlemmer: ${membersError.message}`);
      
      // Formater medlemslisten
      const formattedMembers = members?.map(m => ({
        user_id: m.user_id,
        username: m.users?.[0]?.username || 'Ukjent bruker',
        role: m.role as 'admin' | 'member',
        joined_at: m.joined_at
      })) || [];
      
      setGroupMembers(formattedMembers);
    } catch (error) {
      console.error('Feil ved henting av gruppedetaljer:', error);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Lukk gruppedetaljer
  const handleCloseDetails = () => {
    setSelectedGroup(null);
    setGroupMembers([]);
  };
  
  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Grupper</h1>
        <p>Du må være <Link to="/Login" className="text-blue-500 underline">logget inn</Link> for å se grupper.</p>
      </div>
    );
  }
  
  if (!hasKeys) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Grupper</h1>
        <p>Setter opp sikker kryptering...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grupper</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Knapp for å vise/skjule opprettelseskjema */}
      <div className="mb-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {showCreateForm ? 'Avbryt' : 'Opprett ny gruppe'}
        </button>
      </div>
      
      {/* Skjema for å opprette ny gruppe */}
      {showCreateForm && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-4">Opprett ny gruppe</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gruppenavn
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivelse
              </label>
              <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2"
                />
                <span>Privat gruppe (bare synlig for medlemmer)</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={creatingGroup}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              {creatingGroup ? 'Oppretter...' : 'Opprett gruppe'}
            </button>
          </form>
        </div>
      )}
      
      {/* Detaljvisning for valgt gruppe */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">{selectedGroup.description}</p>
            
            <div className="mb-4">
              <p>
                <span className="font-semibold">Type:</span> {selectedGroup.is_private ? 'Privat' : 'Offentlig'}
              </p>
              <p>
                <span className="font-semibold">Opprettet:</span> {new Date(selectedGroup.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Medlemmer:</span> {selectedGroup.member_count}
              </p>
            </div>
            
            {selectedGroup.is_member && (
              <div className="mb-4">
                <Link 
                  to={`/chat/ChatPage?groupId=${selectedGroup.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-block"
                >
                  Gå til gruppechat
                </Link>
              </div>
            )}
            
            <h3 className="font-semibold mb-2">Medlemmer:</h3>
            {loadingDetails ? (
              <p>Laster medlemmer...</p>
            ) : (
              <ul className="divide-y">
                {groupMembers.map((member) => (
                  <li key={member.user_id} className="py-2 flex justify-between">
                    <span>{member.username}</span>
                    <span className="text-sm text-gray-500">
                      {member.role === 'admin' ? 'Administrator' : 'Medlem'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {/* Liste over grupper */}
      {loading ? (
        <p>Laster grupper...</p>
      ) : groups.length === 0 ? (
        <p>Ingen grupper funnet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded p-4">
              <h2 className="font-bold text-lg">{group.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{group.description}</p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Type:</span> {group.is_private ? 'Privat' : 'Offentlig'}
              </p>
              <p className="text-sm mb-4">
                <span className="font-semibold">Medlemmer:</span> {group.member_count}
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewGroupDetails(group)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                >
                  Detaljer
                </button>
                
                {group.is_member ? (
                  <Link 
                    to={`/chat/ChatPage?groupId=${group.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Chat
                  </Link>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Bli medlem
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;

import React, { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase";
import { useToast } from "../../hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Loader2, Mail, Shield, User, UserPlus } from "lucide-react";
import { fetchUserEmail, checkIsAdmin } from "../../services/ai/admin-utils";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  is_admin: boolean;
}

type SortOption = "username" | "email" | "created" | "last_login";

export default function AdminUsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>("username");
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await checkIsAdmin();
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        fetchUsers();
      } else {
        toast({
          title: "Tilgang avvist",
          description: "Du har ikke admin-tilgang til å se denne informasjonen.",
          variant: "destructive",
        });
      }
    };
    
    checkAdminStatus();
  }, []);

  const sortUsers = (users: User[], sortBy: SortOption): User[] => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case "username":
          return a.username.localeCompare(b.username);
        case "email":
          return a.email.localeCompare(b.email);
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "last_login":
          const lastA = a.last_sign_in ? new Date(a.last_sign_in).getTime() : 0;
          const lastB = b.last_sign_in ? new Date(b.last_sign_in).getTime() : 0;
          return lastB - lastA;
        default:
          return 0;
      }
    });
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true });
        
        if (countError) throw countError;
        setUserCount(count || 0);
        
        // First try using admin APIs to get full user data including emails
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // Get profile data to complement user information
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url");

        if (profilesError) throw profilesError;

        // Get admin role information
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select("user_id, role")
          .eq("role", "admin");

        if (rolesError) throw rolesError;

        const adminRoles = new Set((rolesData as any[] || []).map(role => role.user_id));
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        const combinedUsers = authData.users.map(user => {
          const profile = profilesMap.get(user.id);
          return {
            id: user.id,
            email: user.email || 'Ukjent e-post',
            username: profile?.username || 'Ikke angitt',
            full_name: profile?.full_name || 'Ikke angitt',
            avatar_url: profile?.avatar_url,
            created_at: user.created_at,
            last_sign_in: user.last_sign_in_at,
            is_admin: adminRoles.has(user.id)
          };
        });

        setUsers(sortUsers(combinedUsers, sortOption));
      } catch (adminApiError) {
        console.error("Admin API error, falling back to manual email fetch:", adminApiError);

        // Fallback: Get profile data first
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url");

        if (profilesError) throw profilesError;

        // Get admin role information
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select("user_id, role")
          .eq("role", "admin");

        if (rolesError) throw rolesError;

        const adminRoles = new Set((rolesData as any[] || []).map(role => role.user_id));

        // Use our utility function to fetch emails securely
        const usersWithProfiles = await Promise.all(
          profilesData.map(async (profile) => {
            // Use our new utility function to fetch the email
            const email = await fetchUserEmail(profile.id);
            
            return {
              id: profile.id,
              email: email,
              username: profile.username || 'Ikke angitt',
              full_name: profile.full_name || 'Ikke angitt',
              avatar_url: profile.avatar_url,
              created_at: new Date().toISOString(),
              is_admin: adminRoles.has(profile.id)
            };
          })
        );

        setUsers(sortUsers(usersWithProfiles, sortOption));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Feil ved henting av brukere",
        description: "Kunne ikke hente brukerliste. Sjekk konsollen for detaljer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (value: string) => {
    setSortOption(value as SortOption);
    setUsers(sortUsers(users, value as SortOption));
  };

  const grantAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: "admin" }]);

      if (error) throw error;

      toast({
        title: "Admin-rolle tildelt",
        description: "Brukeren har fått admin-tilgang.",
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_admin: true } : user
        )
      );
    } catch (error) {
      console.error("Error granting admin role:", error);
      toast({
        title: "Feil ved tildeling av admin-rolle",
        description: "Kunne ikke tildele admin-rolle. Sjekk konsollen for detaljer.",
        variant: "destructive",
      });
    }
  };

  const revokeAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;

      toast({
        title: "Admin-rolle fjernet",
        description: "Admin-tilgang er fjernet fra brukeren.",
      });

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_admin: false } : user
        )
      );
    } catch (error) {
      console.error("Error revoking admin role:", error);
      toast({
        title: "Feil ved fjerning av admin-rolle",
        description: "Kunne ikke fjerne admin-rolle. Sjekk konsollen for detaljer.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full">
        <Shield className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">Admin-tilgang kreves</h3>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Du har ikke tilgang til å se brukeradministrasjonssiden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Brukeradministrasjon</h2>
          <p className="text-gray-500">Totalt {userCount} brukere registrert</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => fetchUsers()} 
            variant="outline" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Oppdater liste
          </Button>
          <Select value={sortOption} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sorter etter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="username">Brukernavn</SelectItem>
                <SelectItem value="email">E-post</SelectItem>
                <SelectItem value="created">Opprettet</SelectItem>
                <SelectItem value="last_login">Sist innlogget</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bruker</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Opprettet</TableHead>
                <TableHead>Sist innlogget</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.full_name}</div>
                      </div>
                      {user.is_admin && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.created_at && formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in
                      ? formatDistanceToNow(new Date(user.last_sign_in), { addSuffix: true })
                      : "Aldri"}
                  </TableCell>
                  <TableCell className="text-right">
                    {!user.is_admin ? (
                      <Button
                        onClick={() => grantAdminRole(user.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>Gi admin</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => revokeAdminRole(user.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-red-500 hover:text-red-600"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>Fjern admin</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

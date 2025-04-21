import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Trash, 
  Lock, 
  Mail, 
  Shield, 
  User,
  Loader2,
  Users as UsersIcon,
  Pencil,
  QrCode,
  ArrowUpDown,
  FilterX,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserType {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  is_admin?: boolean;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export const AdminUsersManager = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showQrCodeDialog, setShowQrCodeDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [userCount, setUserCount] = useState(0);
  const { toast } = useToast();

  const sortUsers = useCallback((users: UserType[], option: string) => {
    return [...users].sort((a, b) => {
      switch(option) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return (a.full_name || a.username || a.email).localeCompare(b.full_name || b.username || b.email);
        case "admins":
          return (b.is_admin ? 1 : 0) - (a.is_admin ? 1 : 0);
        default:
          return 0;
      }
    });
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: hasAdminRole, error: adminCheckError } = await supabase.rpc('has_role', {
        user_id: session.user.id,
        role: 'admin'
      });

      if (adminCheckError) throw adminCheckError;

      setCurrentUserIsAdmin(!!hasAdminRole);

      if (hasAdminRole) {
        fetchUsers();
      } else {
        setLoading(false);
        toast({
          title: "Tilgangsfeil",
          description: "Du har ikke administratortilgang.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setLoading(false);
      toast({
        title: "Feil ved sjekking av admin-status",
        description: "Kunne ikke verifisere administratortilgang.",
        variant: "destructive",
      });
    }
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
        
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url");

        if (profilesError) throw profilesError;

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
        console.error("Admin API error, falling back to regular query:", adminApiError);

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url");

        if (profilesError) throw profilesError;

        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select("user_id, role")
          .eq("role", "admin");

        if (rolesError) throw rolesError;

        const adminRoles = new Set((rolesData as any[] || []).map(role => role.user_id));

        const usersWithProfiles = profilesData.map(profile => ({
          id: profile.id,
          email: 'Fetching...',
          username: profile.username || 'Ikke angitt',
          full_name: profile.full_name || 'Ikke angitt',
          avatar_url: profile.avatar_url,
          created_at: new Date().toISOString(),
          is_admin: adminRoles.has(profile.id)
        }));

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

  useEffect(() => {
    if (users.length > 0) {
      setUsers(sortUsers(users, sortOption));
    }
  }, [sortOption, sortUsers]);

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      (user.username?.toLowerCase().includes(query) || false) ||
      (user.full_name?.toLowerCase().includes(query) || false)
    );
  });

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: "Manglende informasjon",
        description: "E-post og passord er påkrevd.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              username: newUserEmail.split('@')[0], 
              full_name: newUserName 
            }
          ]);
        
        if (profileError) throw profileError;

        if (adminRole) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([
              {
                user_id: data.user.id,
                role: 'admin'
              }
            ]);
          
          if (roleError) throw roleError;
        }
        
        toast({
          title: "Bruker opprettet",
          description: `Bruker ${newUserEmail} ble opprettet. En bekreftelsesmail er sendt til brukeren.`,
        });
        
        setShowAddUserDialog(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
        setAdminRole(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Feil ved opprettelse av bruker",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    
    try {
      if (editUsername !== selectedUser.username || editFullName !== selectedUser.full_name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            username: editUsername,
            full_name: editFullName
          })
          .eq('id', selectedUser.id);
        
        if (profileError) throw profileError;
      }
      
      if (resetPassword && newPassword) {
        try {
          const { error: resetError } = await supabase.auth.admin.updateUserById(
            selectedUser.id,
            { password: newPassword }
          );
          
          if (resetError) throw resetError;
        } catch (resetError) {
          console.error("Admin password reset failed:", resetError);
          const { error: emailResetError } = await supabase.auth.resetPasswordForEmail(
            selectedUser.email,
            { redirectTo: `${window.location.origin}/reset-password` }
          );
          
          if (emailResetError) throw emailResetError;
          
          toast({
            title: "Passord tilbakestilling",
            description: "En e-post med lenke for tilbakestilling av passord er sendt til brukeren.",
          });
        }
      }
      
      const isCurrentlyAdmin = selectedUser.is_admin;
      
      if (adminRole !== isCurrentlyAdmin) {
        if (adminRole) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([
              {
                user_id: selectedUser.id,
                role: 'admin'
              }
            ]);
          
          if (roleError) throw roleError;
        } else {
          const { error: roleError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', selectedUser.id)
            .eq('role', 'admin');
          
          if (roleError) throw roleError;
        }
      }
      
      toast({
        title: "Bruker oppdatert",
        description: `Brukeren ${selectedUser.email} ble oppdatert.`,
      });
      
      setShowEditUserDialog(false);
      setSelectedUser(null);
      setEditUsername("");
      setEditFullName("");
      setResetPassword(false);
      setNewPassword("");
      setAdminRole(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Feil ved oppdatering av bruker",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    
    try {
      try {
        const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
        if (error) throw error;
      } catch (adminError) {
        console.error("Admin delete failed, falling back:", adminError);
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedUser.id);
        
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Bruker slettet",
        description: `Bruker ${selectedUser.email} ble slettet.`,
      });
      
      setShowDeleteUserDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Feil ved sletting av bruker",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const showUserQrCode = (user: UserType) => {
    setSelectedUser(user);
    setShowQrCodeDialog(true);
  };

  const exportUserData = () => {
    try {
      const exportData = users.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in,
        is_admin: user.is_admin ? 'Ja' : 'Nei'
      }));
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `bruker-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Data eksportert",
        description: "Brukerdata er lastet ned som JSON-fil.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Eksportfeil",
        description: "Kunne ikke eksportere brukerdata.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-cyberblue-300 flex items-center">
                  <UsersIcon className="mr-2" size={20} />
                  Brukeradministrasjon
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span>Totalt {userCount} brukere</span>
                  {filteredUsers.length !== users.length && (
                    <span className="ml-2 text-xs bg-cyberdark-700 text-gray-300 px-2 py-0.5 rounded-full">
                      Viser {filteredUsers.length} resultat{filteredUsers.length !== 1 ? 'er' : ''}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportUserData}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  <Download size={16} className="mr-2" />
                  Eksporter
                </Button>
                {currentUserIsAdmin && (
                  <Button 
                    onClick={() => setShowAddUserDialog(true)}
                    className="bg-cyberblue-600 hover:bg-cyberblue-700"
                    size="sm"
                  >
                    <Plus size={16} className="mr-2" />
                    Ny Bruker
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  placeholder="Søk etter brukere..."
                  className="pl-10 bg-cyberdark-800 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setSearchQuery("")}
                    title="Nullstill søk"
                  >
                    <FilterX size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex-shrink-0 w-full md:w-48">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="bg-cyberdark-800 border-gray-700">
                    <SelectValue placeholder="Sorter etter..." />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-gray-700">
                    <SelectItem value="newest">Nyeste først</SelectItem>
                    <SelectItem value="oldest">Eldste først</SelectItem>
                    <SelectItem value="name">Etter navn</SelectItem>
                    <SelectItem value="admins">Administratorer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyberblue-400" />
              </div>
            ) : !currentUserIsAdmin ? (
              <div className="rounded-md border border-gray-700 p-8 text-center">
                <Shield className="mx-auto h-12 w-12 text-cyberred-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">Tilgang nektet</h3>
                <p className="text-gray-400">Du har ikke administratortilgang til å administrere brukere.</p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-cyberdark-800">
                    <TableRow>
                      <TableHead className="text-gray-300 w-1/3">
                        <div className="flex items-center">
                          Bruker
                          <ArrowUpDown 
                            className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-300"
                            onClick={() => setSortOption(sortOption === "name" ? "newest" : "name")}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">E-post</TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Registrert
                          <ArrowUpDown 
                            className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-300"
                            onClick={() => setSortOption(sortOption === "newest" ? "oldest" : "newest")}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        <div className="flex items-center">
                          Rolle
                          <ArrowUpDown 
                            className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-300"
                            onClick={() => setSortOption(sortOption === "admins" ? "newest" : "admins")}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300 text-right">Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-cyberdark-800/50 border-t border-gray-700">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-cyberdark-700 flex items-center justify-center text-cyberblue-400 mr-3">
                                {user.avatar_url ? (
                                  <img 
                                    src={user.avatar_url} 
                                    alt={user.username || 'User'} 
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  user.username ? user.username.charAt(0).toUpperCase() : <User size={14} />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-200">{user.full_name || 'Ikke angitt'}</div>
                                <div className="text-xs text-gray-400">@{user.username || 'Ikke angitt'}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-xs text-gray-400">
                            {new Date(user.created_at).toLocaleDateString('no-NO', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </TableCell>
                          <TableCell className="text-xs text-gray-300">
                            {user.is_admin ? (
                              <div className="flex items-center text-cyberblue-400">
                                <Shield size={14} className="mr-1" />
                                <span>Admin</span>
                              </div>
                            ) : (
                              <span>Bruker</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={() => showUserQrCode(user)}
                                  >
                                    <QrCode size={15} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="text-xs">Vis QR-kode</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setEditUsername(user.username || '');
                                      setEditFullName(user.full_name || '');
                                      setAdminRole(user.is_admin || false);
                                      setShowEditUserDialog(true);
                                    }}
                                  >
                                    <Pencil size={15} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="text-xs">Rediger bruker</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setResetPassword(true);
                                      setShowEditUserDialog(true);
                                    }}
                                  >
                                    <Lock size={15} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="text-xs">Tilbakestill passord</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-300"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowDeleteUserDialog(true);
                                    }}
                                  >
                                    <Trash size={15} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="text-xs">Slett bruker</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          {searchQuery ? 'Ingen brukere samsvarer med søket' : 'Ingen brukere funnet'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent className="bg-cyberdark-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-cyberblue-300">Legg til ny bruker</DialogTitle>
              <DialogDescription>
                Opprett en ny brukerkonto. En bekreftelsesmail vil bli sendt til brukeren.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Fullt navn</label>
                <Input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-cyberdark-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">E-post</label>
                <Input
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="bruker@example.com"
                  className="bg-cyberdark-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Passord</label>
                <Input
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="bg-cyberdark-800 border-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="adminRole"
                  checked={adminRole}
                  onChange={(e) => setAdminRole(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-cyberblue-600 focus:ring-cyberblue-500"
                />
                <label htmlFor="adminRole" className="text-sm text-gray-300">
                  <span className="flex items-center">
                    <Shield size={14} className="mr-1 text-cyberblue-400" />
                    Gi administratortilgang
                  </span>
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAddUserDialog(false)}
                disabled={processing}
              >
                Avbryt
              </Button>
              <Button 
                onClick={handleAddUser}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oppretter...
                  </>
                ) : (
                  'Opprett bruker'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="bg-cyberdark-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-cyberblue-300">Rediger bruker</DialogTitle>
              <DialogDescription>
                Endre brukerinformasjon for {selectedUser?.email}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Brukernavn</label>
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="brukernavn"
                  className="bg-cyberdark-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Fullt navn</label>
                <Input
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Fullt navn"
                  className="bg-cyberdark-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="resetPassword"
                    checked={resetPassword}
                    onChange={(e) => setResetPassword(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-cyberblue-600 focus:ring-cyberblue-500"
                  />
                  <label htmlFor="resetPassword" className="text-sm text-gray-300">
                    Tilbakestill passord
                  </label>
                </div>
                
                {resetPassword && (
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="Nytt passord"
                    className="bg-cyberdark-800 border-gray-700"
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="editAdminRole"
                  checked={adminRole}
                  onChange={(e) => setAdminRole(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-cyberblue-600 focus:ring-cyberblue-500"
                />
                <label htmlFor="editAdminRole" className="text-sm text-gray-300">
                  <span className="flex items-center">
                    <Shield size={14} className="mr-1 text-cyberblue-400" />
                    Administratortilgang
                  </span>
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowEditUserDialog(false)}
                disabled={processing}
              >
                Avbryt
              </Button>
              <Button 
                onClick={handleEditUser}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  'Lagre endringer'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
          <AlertDialogContent className="bg-cyberdark-900 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-cyberred-300">Bekreft sletting</AlertDialogTitle>
              <AlertDialogDescription>
                Er du sikker på at du vil slette brukeren {selectedUser?.email}? Denne handlingen kan ikke angres.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-cyberdark-800 border-gray-700 hover:bg-cyberdark-700"
                disabled={processing}
              >
                Avbryt
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sletter...
                  </>
                ) : (
                  'Slett bruker'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={showQrCodeDialog} onOpenChange={setShowQrCodeDialog}>
          <DialogContent className="bg-cyberdark-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-cyberblue-300">Bruker QR-kode</DialogTitle>
              <DialogDescription>
                Del denne QR-koden for å la andre legge til {selectedUser?.username} som venn.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
                <UserQrCode userId={selectedUser?.id || ""} username={selectedUser?.username || ""} />
              </div>
              <p className="text-sm text-gray-400 text-center mt-2">
                Brukere kan skanne denne koden for å sende venneforespørsel.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowQrCodeDialog(false)}>
                Lukk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

interface UserQrCodeProps {
  userId: string;
  username: string;
}

const UserQrCode = ({ userId, username }: UserQrCodeProps) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  
  useEffect(() => {
    const generateQrCode = async () => {
      if (!userId) return;
      
      try {
        const QRCode = await import('qrcode');
        
        const payload = JSON.stringify({
          type: 'friend-request',
          userId,
          username
        });
        
        QRCode.toString(payload, {
          type: 'svg',
          color: {
            dark: '#000',
            light: '#fff'
          },
          width: 200,
          margin: 1
        }, (err, svg) => {
          if (err) throw err;
          setQrCodeSvg(svg);
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    
    generateQrCode();
  }, [userId, username]);
  
  if (!qrCodeSvg) {
    return (
      <div className="h-48 w-48 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <div className="h-48 w-48" dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
  );
};

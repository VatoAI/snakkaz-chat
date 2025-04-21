
import { useState, useEffect } from "react";
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
  Search, 
  Plus, 
  Trash, 
  Lock, 
  Mail, 
  Shield, 
  User,
  Loader2,
  Users as UsersIcon
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
}

export const AdminUsersManager = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url');
      
      if (profilesError) throw profilesError;
      
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
          last_sign_in: user.last_sign_in_at
        };
      });
      
      setUsers(combinedUsers);
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
        
        toast({
          title: "Bruker opprettet",
          description: `Bruker ${newUserEmail} ble opprettet. En bekreftelsesmail er sendt til brukeren.`,
        });
        
        setShowAddUserDialog(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      
      if (error) throw error;
      
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-cyberblue-300 flex items-center">
                  <UsersIcon className="mr-2" size={20} />
                  Brukeradministrasjon
                </CardTitle>
                <CardDescription>Administrer brukere i systemet</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddUserDialog(true)}
                className="bg-cyberblue-600 hover:bg-cyberblue-700"
              >
                <Plus size={16} className="mr-2" />
                Ny Bruker
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                placeholder="Søk etter brukere..."
                className="pl-10 bg-cyberdark-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyberblue-400" />
              </div>
            ) : (
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-cyberdark-800">
                    <TableRow>
                      <TableHead className="text-gray-300">Bruker</TableHead>
                      <TableHead className="text-gray-300">E-post</TableHead>
                      <TableHead className="text-gray-300">Registrert</TableHead>
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
                                {user.username ? user.username.charAt(0).toUpperCase() : <User size={14} />}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-200">{user.full_name}</div>
                                <div className="text-xs text-gray-400">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-xs text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                                  >
                                    <Mail size={15} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p className="text-xs">Send e-post til bruker</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
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
                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
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
      </div>
    </TooltipProvider>
  );
};


import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Check, X, Upload, Lock, Eye, EyeOff, MessageSquare, Clock } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { GroupWritePermission, MessageTTLOption } from "@/types/group";
import { SecurityLevelSelector } from "./SecurityLevelSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface GroupFormData {
  name: string;
  security_level: SecurityLevel;
  write_permissions: GroupWritePermission;
  message_ttl: MessageTTLOption;
  encrypted: boolean;
  is_premium: boolean;
  description: string;
  password?: string;
  avatar?: File;
}

interface GroupChatCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (
    name: string, 
    members: string[], 
    securityLevel: SecurityLevel, 
    password?: string, 
    avatar?: File,
    writePermissions?: GroupWritePermission,
    defaultMessageTtl?: MessageTTLOption,
    memberWritePermissions?: Record<string, boolean>
  ) => void;
  currentUserId: string;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  friendsList: string[];
}

export const GroupChatCreator = ({
  isOpen,
  onClose,
  onCreateGroup,
  currentUserId,
  userProfiles,
  friendsList
}: GroupChatCreatorProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [memberWritePermissions, setMemberWritePermissions] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<GroupFormData>({
    defaultValues: {
      name: "",
      security_level: "server_e2ee" as SecurityLevel,
      write_permissions: "all" as GroupWritePermission,
      message_ttl: 86400 as MessageTTLOption,
      encrypted: false,
      is_premium: false,
      description: "",
      password: ""
    }
  });
  
  const writePermissions = form.watch("write_permissions");

  const handleClose = () => {
    form.reset();
    setSelectedMembers([]);
    setSearchQuery("");
    setAvatarPreview(null);
    setMemberWritePermissions({});
    onClose();
  };
  
  const handleCreateGroup = (data: GroupFormData) => {
    if (data.name.trim() === '') {
      return;
    }
    
    onCreateGroup(
      data.name, 
      selectedMembers, 
      data.security_level, 
      data.password && data.password.trim() !== "" ? data.password : undefined,
      data.avatar,
      data.write_permissions,
      data.message_ttl,
      memberWritePermissions
    );
    
    handleClose();
  };
  
  const toggleFriendSelection = (friendId: string) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== friendId));
      
      const newPermissions = { ...memberWritePermissions };
      delete newPermissions[friendId];
      setMemberWritePermissions(newPermissions);
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
      
      setMemberWritePermissions(prev => ({
        ...prev,
        [friendId]: true
      }));
    }
  };

  const toggleMemberWritePermission = (friendId: string) => {
    setMemberWritePermissions(prev => ({
      ...prev,
      [friendId]: !prev[friendId]
    }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ugyldig filtype",
          description: "Last opp kun bildefiler",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Filen er for stor",
          description: "Maksimal størrelse er 5MB",
          variant: "destructive"
        });
        return;
      }
      
      form.setValue("avatar", file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const filteredFriends = friendsList.filter(friendId => {
    const profile = userProfiles[friendId];
    return (
      profile && 
      profile.username &&
      profile.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const getTTLLabel = (value: MessageTTLOption) => {
    switch (value) {
      case 300: return "5 minutter";
      case 1800: return "30 minutter";
      case 3600: return "1 time";
      case 86400: return "24 timer (standard)";
      case 604800: return "7 dager";
      default: return "24 timer (standard)";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Opprett ny gruppe</DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Legg til venner i gruppen og velg sikkerhetsnivå.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateGroup)} className="space-y-4 pt-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cybergold-500/30 bg-cyberdark-800 flex items-center justify-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <Avatar className="w-full h-full">
                      <AvatarImage src={avatarPreview} alt="Group avatar preview" className="object-cover" />
                    </Avatar>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-cybergold-400">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-xs">Last opp</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cybergold-200">Gruppenavn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Skriv et gruppenavn..."
                          className="bg-cyberdark-800 border-cybergold-500/30"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cybergold-200">
                        Gruppepassord (valgfritt)
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Opprett et passord..."
                            className="bg-cyberdark-800 border-cybergold-500/30 pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-cybergold-400"
                        >
                          {passwordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormDescription className="text-xs text-cybergold-500/70">
                        Passord kan brukes for å bli med i gruppen uten invitasjon
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="security_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cybergold-200">
                    Sikkerhetsnivå
                  </FormLabel>
                  <FormControl>
                    <SecurityLevelSelector 
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="write_permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cybergold-200 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Skrivetillatelser
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-cyberdark-800 border-cybergold-500/30">
                        <SelectValue placeholder="Velg hvem som kan skrive meldinger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-cyberdark-800 border-cybergold-500/30">
                      <SelectItem value="all">Alle medlemmer kan skrive</SelectItem>
                      <SelectItem value="admin">Kun administratorer kan skrive</SelectItem>
                      <SelectItem value="selected">Utvalgte medlemmer kan skrive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message_ttl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cybergold-200 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Standard meldingslevetid
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value) as MessageTTLOption)}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-cyberdark-800 border-cybergold-500/30">
                        <SelectValue placeholder="Velg standard levetid for meldinger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-cyberdark-800 border-cybergold-500/30">
                      <SelectItem value="300">5 minutter</SelectItem>
                      <SelectItem value="1800">30 minutter</SelectItem>
                      <SelectItem value="3600">1 time</SelectItem>
                      <SelectItem value="86400">24 timer (standard)</SelectItem>
                      <SelectItem value="604800">7 dager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-cybergold-500/70">
                    Meldinger slettes automatisk etter valgt tid
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-cybergold-500/30 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-cybergold-200">Premium gruppe</FormLabel>
                    <FormDescription className="text-cybergold-500/70 text-xs">
                      Gruppen vil ha tilgang til premium-funksjoner
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-cybergold-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cybergold-200">Beskrivelse</FormLabel>
                  <FormControl>
                    <textarea 
                      placeholder="Beskriv gruppen (valgfritt)..." 
                      className="w-full min-h-[80px] rounded-md border border-cybergold-500/30 bg-cyberdark-800 p-2 text-cybergold-200 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel className="text-cybergold-200">Legg til medlemmer</FormLabel>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-500/70" />
                <Input
                  type="text"
                  placeholder="Søk etter venner..."
                  className="pl-9 bg-cyberdark-800 border-cybergold-500/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="border rounded-md border-cybergold-500/20 max-h-[200px] overflow-y-auto">
                {filteredFriends.length > 0 ? (
                  <div className="divide-y divide-cybergold-500/10">
                    {filteredFriends.map(friendId => {
                      const profile = userProfiles[friendId] || {};
                      const isSelected = selectedMembers.includes(friendId);
                      const canWrite = memberWritePermissions[friendId];
                      
                      return (
                        <div key={friendId} className="p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-sm border",
                                isSelected 
                                  ? "bg-cybergold-600 border-cybergold-600" 
                                  : "border-cybergold-500/30"
                              )}
                              onClick={() => toggleFriendSelection(friendId)}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </button>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                                  {(profile.username?.charAt(0) || '?').toUpperCase()}
                                </AvatarFallback>
                                {profile.avatar_url && (
                                  <AvatarImage src={profile.avatar_url} alt={profile.username || ''} />
                                )}
                              </Avatar>
                              <span className="text-sm text-cybergold-300">{profile.username}</span>
                            </div>
                          </div>
                          
                          {isSelected && writePermissions === 'selected' && (
                            <Switch
                              checked={canWrite}
                              onCheckedChange={() => toggleMemberWritePermission(friendId)}
                              className="data-[state=checked]:bg-cybergold-600"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-cybergold-500/70">
                    {searchQuery ? "Ingen treff på søket" : "Ingen venner funnet"}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-cybergold-500/70 flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{selectedMembers.length} venner valgt</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} className="border-cybergold-500/30 text-cybergold-400">
                Avbryt
              </Button>
              <Button 
                type="submit" 
                className="bg-cybergold-600 text-white hover:bg-cybergold-500"
                disabled={!form.watch('name')}
              >
                Opprett gruppe
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

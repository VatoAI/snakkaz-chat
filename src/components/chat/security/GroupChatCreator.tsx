import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Check, X, Upload, Lock, Eye, EyeOff, MessageSquare, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SecurityLevelSelector } from "./SecurityLevelSelector";
import { SecurityLevel } from "@/types/security";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { GroupWritePermission, MessageTTLOption } from "@/types/group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface GroupFormData {
  name: string;
  password?: string;
  security_level: SecurityLevel;
  avatar?: File;
  write_permissions: GroupWritePermission;
  default_message_ttl: MessageTTLOption;
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
      password: "",
      security_level: "server_e2ee" as SecurityLevel,
      write_permissions: "all" as GroupWritePermission,
      default_message_ttl: null
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
      data.default_message_ttl,
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
      case 86400: return "24 timer";
      case 604800: return "7 dager";
      default: return "Ingen auto-sletting";
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
                  <FormDescription className="text-xs text-cybergold-500/70">
                    Velg hvem som skal ha tillatelse til å skrive meldinger i gruppen
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_message_ttl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cybergold-200 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Automatisk sletting av meldinger
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "null" ? null : Number(val))}
                    defaultValue={field.value?.toString() || "null"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-cyberdark-800 border-cybergold-500/30">
                        <SelectValue placeholder="Velg standard levetid for meldinger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-cyberdark-800 border-cybergold-500/30">
                      <SelectItem value="null">Ingen auto-sletting</SelectItem>
                      <SelectItem value="300">5 minutter</SelectItem>
                      <SelectItem value="1800">30 minutter</SelectItem>
                      <SelectItem value="3600">1 time</SelectItem>
                      <SelectItem value="86400">24 timer</SelectItem>
                      <SelectItem value="604800">7 dager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-cybergold-500/70">
                    Meldinger i gruppen vil automatisk slettes etter valgt tid
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <FormLabel className="text-cybergold-200">
                  Legg til medlemmer (valgfritt)
                </FormLabel>
                <span className="text-xs text-cybergold-400">
                  {selectedMembers.length} valgt
                </span>
              </div>
              
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyberdark-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søk etter venner..."
                  className="pl-10 bg-cyberdark-800 border-cybergold-500/30"
                />
              </div>
              
              <div className="h-48 overflow-y-auto border border-cybergold-500/20 rounded-md p-2 bg-cyberdark-800">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map(friendId => {
                    const profile = userProfiles[friendId];
                    const isSelected = selectedMembers.includes(friendId);
                    const canWrite = memberWritePermissions[friendId];
                    
                    return (
                      <div 
                        key={friendId}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-cyberdark-700",
                          isSelected && "bg-cyberdark-700"
                        )}
                      >
                        <div 
                          className="flex items-center gap-2 flex-1"
                          onClick={() => toggleFriendSelection(friendId)}
                        >
                          <Avatar className="h-8 w-8 border border-cybergold-500/20">
                            {profile?.avatar_url ? (
                              <AvatarImage 
                                src={supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl} 
                                alt={profile.username || 'User'} 
                              />
                            ) : (
                              <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                                {(profile.username || 'U')[0].toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm">{profile.username}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {isSelected && writePermissions === 'selected' && (
                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                              <Switch 
                                checked={canWrite} 
                                onCheckedChange={() => toggleMemberWritePermission(friendId)}
                                className="data-[state=checked]:bg-green-500"
                              />
                              <span className="text-xs ml-1 whitespace-nowrap text-cybergold-400">
                                {canWrite ? "Kan skrive" : "Kan ikke skrive"}
                              </span>
                            </div>
                          )}
                          <div onClick={() => toggleFriendSelection(friendId)}>
                            {isSelected ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-cybergold-400/40" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Users className="h-8 w-8 text-cyberdark-400 mb-2" />
                    <p className="text-sm text-cyberdark-400">
                      {searchQuery ? 'Ingen venner funnet' : 'Du har ingen venner å legge til ennå'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
              >
                <X className="h-4 w-4 mr-2" />
                Avbryt
              </Button>
              <Button 
                type="submit"
                className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
                disabled={!form.getValues().name.trim()}
              >
                <Check className="h-4 w-4 mr-2" />
                Opprett gruppe
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

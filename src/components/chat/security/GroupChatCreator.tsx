
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Check, X, Upload, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SecurityLevelSelector } from "./SecurityLevelSelector";
import { SecurityLevel } from "@/types/security";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface GroupFormData {
  name: string;
  password?: string;
  security_level: SecurityLevel;
  avatar?: File;
}

interface GroupChatCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, members: string[], securityLevel: SecurityLevel, password?: string, avatar?: File) => void;
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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<GroupFormData>({
    defaultValues: {
      name: "",
      password: "",
      security_level: "server_e2ee" as SecurityLevel
    }
  });
  
  const handleClose = () => {
    form.reset();
    setSelectedMembers([]);
    setSearchQuery("");
    setAvatarPreview(null);
    onClose();
  };
  
  const handleCreateGroup = (data: GroupFormData) => {
    if (data.name.trim() === '') {
      return;
    }
    
    // Allow creating groups with no members (can add members later)
    onCreateGroup(
      data.name, 
      selectedMembers, 
      data.security_level, 
      data.password && data.password.trim() !== "" ? data.password : undefined,
      data.avatar
    );
    
    handleClose();
  };
  
  const toggleFriendSelection = (friendId: string) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== friendId));
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ugyldig filtype",
          description: "Last opp kun bildefiler",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Filen er for stor",
          description: "Maksimal størrelse er 5MB",
          variant: "destructive"
        });
        return;
      }
      
      form.setValue("avatar", file);
      
      // Create preview
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
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[500px]">
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
                    
                    return (
                      <div 
                        key={friendId}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-cyberdark-700",
                          isSelected && "bg-cyberdark-700"
                        )}
                        onClick={() => toggleFriendSelection(friendId)}
                      >
                        <div className="flex items-center gap-2">
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
                        
                        {isSelected ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-cybergold-400/40" />
                        )}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateGroup } from "@/components/groups/CreateGroup";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreated, setIsCreated] = useState(false);
  
  // Redirect to login if user is not authenticated
  if (!user) {
    navigate('/login', { state: { returnUrl: '/create-group' } });
    return null;
  }

  const handleGroupCreated = (groupId: string) => {
    setIsCreated(true);
    
    // Navigate to the group chat after a short delay
    setTimeout(() => {
      navigate(`/group-chat/${groupId}`);
    }, 1500);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Tilbake
        </Button>
        <h1 className="text-2xl font-bold dark:text-cybergold-300">Opprett ny gruppe</h1>
      </div>
      
      <div className="mb-8">
        <p className="dark:text-cybergold-400 mb-4">
          Opprett en gruppe for å starte samtaler med venner, familie eller kolleger. 
          Du kan invitere medlemmer etter at gruppen er opprettet.
        </p>
        
        {isCreated ? (
          <div className="p-4 bg-green-100 dark:bg-cybergreen-900/30 border border-green-200 dark:border-cybergreen-800/50 rounded-md mb-6">
            <p className="text-green-800 dark:text-cybergreen-400">
              Gruppen er opprettet! Du blir omdirigert til gruppen...
            </p>
          </div>
        ) : null}
      </div>
      
      <CreateGroup onSuccess={handleGroupCreated} />
    </div>
  );
};

export default CreateGroupPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink, Database, RefreshCw, HelpCircle, MessageSquare, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { ProjectProps } from "../ProjectCard";
import { HelpDeskDialog } from "./HelpDeskDialog";
import { Badge } from "@/components/ui/badge";

interface FeaturedProjectProps {
  project: (ProjectProps & { isFeatured?: boolean }) | undefined;
}

export const FeaturedProject = ({ project }: FeaturedProjectProps) => {
  const [refreshKey, setRefreshKey] = useState(0); // State to force image refresh
  const [showHelpDesk, setShowHelpDesk] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [projectStatus, setProjectStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!project) return;
    
    const checkProjectStatus = async () => {
      try {
        await fetch(`${project.previewUrl}/ping`, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        });
        setProjectStatus('online');
      } catch (error) {
        console.log(`Could not connect to ${project.title}`);
        setProjectStatus('offline');
      }
    };
    
    checkProjectStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkProjectStatus, 30000);
    
    return () => clearInterval(interval);
  }, [project]);
  
  if (!project) return null;
  
  // Function to refresh the preview image
  const refreshPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageLoading(true);
    setRefreshKey(prev => prev + 1);
  };
  
  const handleChatRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/chat');
  };
  
  const getStatusIcon = () => {
    switch (projectStatus) {
      case 'online':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'offline':
        return <AlertTriangle size={16} className="text-amber-400" />;
      default:
        return <Activity size={16} className="text-cyberblue-400 animate-pulse" />;
    }
  };
  
  // Thumbnail URL with cache busting
  const thumbnailUrl = `${project.previewUrl.replace('https://', 'https://thumbnail--')}/thumbnail.png?t=${refreshKey}&cache=${new Date().getTime()}`;
  
  return (
    <div 
      className="mb-12 bg-gradient-to-r from-cyberdark-800/90 to-cyberdark-900/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(26,157,255,0.15)]"
      style={{
        borderImage: 'linear-gradient(90deg, #1a9dff, #d62828) 1',
        border: '2px solid',
      }}
    >
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        <div className="md:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center"
              style={{
                background: 'linear-gradient(90deg, #1a9dff, #ffffff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              <span className="bg-gradient-to-r from-cyberblue-500/20 to-cyberdark-900 p-1.5 rounded-lg mr-3">
                <MessageSquare size={24} className="text-cyberblue-400" />
              </span>
              {project.title}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/50"
              onClick={() => setShowHelpDesk(true)}
            >
              <HelpCircle size={16} className="mr-2" />
              Hjelp
            </Button>
          </div>
          
          <div className="flex items-center mb-4">
            <Badge variant="outline" className="bg-cyberdark-800/40 text-gray-300 border-gray-500/30 flex items-center gap-1 px-3 py-1">
              {getStatusIcon()}
              <span className="ml-1">
                {projectStatus === 'online' ? 'Live' : projectStatus === 'offline' ? 'Offline' : 'Sjekker status...'}
              </span>
            </Badge>
          </div>
          
          <p className="text-gray-300 mb-6 text-base sm:text-lg">{project.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="text-white font-medium px-6 py-5 h-auto text-base"
              onClick={handleChatRedirect}
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
                boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(214,40,40,0.4)'
              }}
            >
              <MessageSquare size={18} className="mr-2" />
              Start {project.title}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/50 h-auto py-2"
              onClick={handleChatRedirect}
            >
              <ExternalLink size={16} className="mr-2" />
              Åpne Chat
            </Button>
          </div>
          
          {project.hasSupabase && (
            <div className="mt-6 flex items-center">
              <span className="bg-green-900/40 text-green-300 border border-green-500/30 px-3 py-1.5 rounded-md text-sm shadow-[0_0_8px_rgba(34,197,94,0.3)] flex items-center">
                <Database size={14} className="mr-2 text-green-400 animate-pulse" />
                Supabase Integration
              </span>
            </div>
          )}
        </div>
        
        <div className="md:w-1/2">
          <div 
            className="overflow-hidden rounded-lg bg-cyberdark-950/50 relative group"
            style={{
              borderImage: 'linear-gradient(90deg, #d62828, #1a9dff) 1',
              border: '2px solid',
            }}
          >
            <AspectRatio ratio={16/9}>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/60 z-10">
                  <div className="w-10 h-10 border-2 border-cyberblue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                key={refreshKey} // Use key to force reload of image when refreshed
                src={thumbnailUrl}
                alt={`Preview of ${project.title}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.log("Image failed to load, using SnakkaZ logo as fallback");
                  setImageLoading(false);
                  (e.target as HTMLImageElement).src = "/snakkaz-logo.png";
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-cyberdark-950/90 via-cyberdark-950/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                onClick={handleChatRedirect}
              >
                <div className="text-center p-4">
                  <span className="text-cyberblue-300 font-medium flex items-center justify-center mb-2">
                    <ExternalLink size={20} className="mr-2" />
                    Åpne {project.title}
                  </span>
                  <p className="text-cyberblue-400/80 text-sm max-w-xs mx-auto">
                    Klikk for å prøve {project.title} med ende-til-ende-kryptering
                  </p>
                </div>
              </div>
              <button 
                className="absolute top-2 right-2 bg-cyberdark-900/80 p-1.5 rounded-full text-cyberblue-400 hover:text-cyberblue-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={refreshPreview}
                title="Oppdater forhåndsvisning"
              >
                <RefreshCw size={16} />
              </button>
            </AspectRatio>
          </div>
          
          <div className="mt-4 flex justify-center items-center">
            <img 
              src="/snakkaz-logo.png" 
              alt="SnakkaZ Logo" 
              className="h-16 object-contain rounded-full border border-cyberblue-500/30 p-1 bg-cyberdark-900/50" 
              onError={(e) => {
                console.log("Logo failed to load, using placeholder");
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
      </div>
      
      <HelpDeskDialog open={showHelpDesk} onOpenChange={setShowHelpDesk} />
    </div>
  );
};

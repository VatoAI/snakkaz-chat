
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, ExternalLink, Database, RefreshCw, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export interface ProjectProps {
  title: string;
  description: string;
  previewUrl: string;
  githubUrl?: string;
  category: 'chat' | 'business' | 'analytics' | 'infrastructure';
  hasSupabase?: boolean;
  progress?: number;
}

export const ProjectCard = ({ title, description, previewUrl, githubUrl, category, hasSupabase, progress = 0 }: ProjectProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [projectStatus, setProjectStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const navigate = useNavigate();
  
  // Fetch project status
  useEffect(() => {
    const checkProjectStatus = async () => {
      try {
        const response = await fetch(`${previewUrl}/ping`, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        });
        setProjectStatus('online');
      } catch (error) {
        console.log(`Could not connect to ${title}`);
        setProjectStatus('offline');
      }
    };
    
    checkProjectStatus();
    // Check status every 60 seconds
    const interval = setInterval(checkProjectStatus, 60000);
    
    return () => clearInterval(interval);
  }, [previewUrl, title]);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'chat':
        return 'border-l-cyberblue-500 border-t-cyberblue-500 border-r-red-500 border-b-red-500';
      case 'business':
        return 'border-l-red-500 border-t-red-500 border-r-cyberblue-500 border-b-cyberblue-500';
      case 'analytics':
        return 'border-l-green-500 border-t-green-500 border-r-cyberblue-500 border-b-cyberblue-500';
      case 'infrastructure':
        return 'border-l-cyberblue-500 border-t-cyberblue-500 border-r-purple-500 border-b-purple-500';
      default:
        return 'border-gray-500';
    }
  };

  const refreshPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setImageError(false);
    setImageLoading(true);
    setRefreshKey(prev => prev + 1);
  };
  
  const handleCardClick = () => {
    if (title === "SnakkaZ Guardian Chat" || title === "ChatCipher Assistant") {
      navigate('/chat');
    } else if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusIcon = () => {
    switch (projectStatus) {
      case 'online':
        return <CheckCircle size={14} className="text-green-400" />;
      case 'offline':
        return <AlertTriangle size={14} className="text-amber-400" />;
      default:
        return <Activity size={14} className="text-cyberblue-400 animate-pulse" />;
    }
  };

  const failbackUrl = "/snakkaz-logo.png";
  const thumbnailUrl = imageError 
    ? failbackUrl
    : `${previewUrl.replace('https://', 'https://thumbnail--').replace('.lovable.app', '.lovable.app')}/thumbnail.png?t=${refreshKey}&cache=${new Date().getTime()}`;

  return (
    <Card 
      className={`h-full bg-cyberdark-900 border-2 ${getCategoryColor(category)} hover:shadow-[0_0_20px_rgba(26,157,255,0.3)_,_0_0_20px_rgba(214,40,40,0.3)] transition-all duration-300 cursor-pointer`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle 
          className="text-xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(90deg, #1a9dff, #ffffff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          <div className="flex items-center">
            {title}
            <Badge variant="outline" className="ml-2 bg-cyberdark-800/40 text-gray-300 border-gray-500/30 flex items-center gap-1 px-2">
              {getStatusIcon()}
              <span className="text-xs ml-1">
                {projectStatus === 'online' ? 'Live' : projectStatus === 'offline' ? 'Offline' : 'Sjekker...'}
              </span>
            </Badge>
          </div>
          {hasSupabase && (
            <Badge variant="outline" className="bg-green-900/40 text-green-300 border-green-500/30 flex items-center gap-1 px-2 shadow-[0_0_8px_rgba(34,197,94,0.3)]">
              <Database size={14} className="text-green-400 animate-pulse" />
              Supabase
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-gray-300 text-sm space-y-4">
        <div className="overflow-hidden rounded-md bg-cyberdark-800 relative group">
          <AspectRatio ratio={16/9} className="bg-cyberdark-800">
            <div className="block w-full h-full relative group">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/60 z-10">
                  <div className="w-8 h-8 border-2 border-cyberblue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                key={refreshKey}
                src={thumbnailUrl}
                alt={`Preview of ${title}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.log(`Image failed to load for ${title}, using SnakkaZ logo as fallback`);
                  setImageError(true);
                  setImageLoading(false);
                  (e.target as HTMLImageElement).src = failbackUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyberdark-950/70 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyberblue-500/80 to-red-500/80 text-white flex items-center">
                  <ExternalLink size={16} className="mr-2" />
                  {title === "SnakkaZ Guardian Chat" || title === "ChatCipher Assistant" ? "Åpne Chat" : "Se Preview"}
                </div>
              </div>
            </div>
          </AspectRatio>
          <button 
            className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full text-cyberblue-400 hover:text-cyberblue-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={refreshPreview}
            title="Oppdater forhåndsvisning"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        
        <p className="line-clamp-3">{description}</p>

        {/* Progress indicator */}
        {progress > 0 && (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Fremgang</span>
              <span className="text-cyberblue-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between mt-auto pt-4">
        <button
          className="flex items-center text-cyberblue-400 hover:text-cyberblue-300 text-sm transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (title === "SnakkaZ Guardian Chat" || title === "ChatCipher Assistant") {
              navigate('/chat');
            } else {
              window.open(previewUrl, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <ExternalLink size={16} className="mr-1" />
          {title === "SnakkaZ Guardian Chat" || title === "ChatCipher Assistant" ? "Åpne Chat" : "Preview"}
        </button>
        
        {githubUrl ? (
          <button
            className="flex items-center text-cyberblue-400 hover:text-cyberblue-300 text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <GithubIcon size={16} className="mr-1" />
            GitHub
          </button>
        ) : (
          <span className="text-gray-500 text-sm italic">Private Repo</span>
        )}
      </CardFooter>
    </Card>
  );
};

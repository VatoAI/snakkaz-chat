import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Image, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLogoSection = () => {
  const [logoSize, setLogoSize] = useState(() => {
    return parseInt(localStorage.getItem("logoSize") || "50");
  });
  const [showLogo, setShowLogo] = useState(() => {
    return localStorage.getItem("showLogo") !== "false";
  });
  const [logoStyle, setLogoStyle] = useState(() => {
    return localStorage.getItem("logoStyle") || "circle";
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(() => {
    return localStorage.getItem("logoUrl") || "/snakkaz-logo.png";
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const previousPreviewRef = useRef<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (previousPreviewRef.current && previousPreviewRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreviewRef.current);
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ugyldig filtype",
        description: "Vennligst last opp et bilde (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Filen er for stor",
        description: "Maksimal størrelse er 5MB",
        variant: "destructive",
      });
      return;
    }

    if (previousPreviewRef.current && previousPreviewRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreviewRef.current);
    }

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    previousPreviewRef.current = imageUrl;
    setPreviewUrl(imageUrl);
    
    await uploadLogoToStorage(file);
  };

  const uploadLogoToStorage = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + (Math.random() * 15);
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'anonymous';
      
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${userId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('app-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
      
      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('app-assets')
        .getPublicUrl(fileName);
      
      localStorage.setItem("logoUrl", publicUrl);
      setPreviewUrl(publicUrl);
      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: "Bilde lastet opp",
        description: "Logoen er nå lagret og tilgjengelig",
      });
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadStatus('error');
      
      toast({
        title: "Opplastingsfeil",
        description: "Kunne ikke laste opp bilde. Prøv igjen senere.",
        variant: "destructive",
      });
      
      localStorage.setItem("logoUrl", previewUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoSizeChange = (values: number[]) => {
    setLogoSize(values[0]);
    localStorage.setItem("logoSize", values[0].toString());
  };

  const handleLogoStyleChange = (style: string) => {
    setLogoStyle(style);
    localStorage.setItem("logoStyle", style);
  };

  const handleShowLogoChange = (show: boolean) => {
    setShowLogo(show);
    localStorage.setItem("showLogo", show.toString());
  };

  const handleRemoveLogo = () => {
    const oldUrl = previewUrl;
    
    setPreviewUrl("/snakkaz-logo.png");
    setSelectedFile(null);
    localStorage.setItem("logoUrl", "/snakkaz-logo.png");
    
    if (oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }
    
    toast({
      title: "Bilde fjernet",
      description: "Standard SnakkaZ logo vises nå",
    });
  };

  return (
    <div 
      className="p-6 rounded-xl bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
      style={{
        borderImage: 'linear-gradient(90deg, #d62828, #1a9dff) 1',
        border: '2px solid',
      }}
    >
      <div className="flex items-center mb-4">
        <Image className="mr-3 text-red-400" size={24} />
        <h2 className="text-xl font-semibold text-red-300">Logo Innstillinger</h2>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <div 
          className={`relative overflow-hidden ${logoStyle === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
          style={{ width: `${logoSize}%`, maxWidth: '200px' }}
        >
          <img
            src={previewUrl}
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/snakkaz-logo.png";
              localStorage.setItem("logoUrl", "/snakkaz-logo.png");
            }}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="logoFile" className="block mb-2 text-gray-300">
            Last opp nytt logo
          </Label>
          <Input
            id="logoFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="bg-cyberdark-950 border-red-500/30"
            disabled={isUploading}
          />
          
          {uploadStatus !== 'idle' && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {uploadStatus === 'uploading' ? 'Laster opp...' : 
                   uploadStatus === 'success' ? 'Opplasting fullført' : 
                   'Opplasting feilet'}
                </span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
              <div className="flex items-center justify-center mt-1">
                {uploadStatus === 'uploading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                {uploadStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {uploadStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Logo størrelse</Label>
          <Slider
            defaultValue={[logoSize]}
            value={[logoSize]}
            min={30}
            max={100}
            step={5}
            onValueChange={handleLogoSizeChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>30%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showLogo" className="text-gray-300">
            Vis logo
          </Label>
          <Switch
            id="showLogo"
            checked={showLogo}
            onCheckedChange={handleShowLogoChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="logoStyle" className="text-gray-300">
            Logo stil
          </Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogoStyleChange("circle")}
              className={logoStyle === "circle" ? "bg-red-500/20 border-red-500" : ""}
            >
              Sirkel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogoStyleChange("square")}
              className={logoStyle === "square" ? "bg-red-500/20 border-red-500" : ""}
            >
              Firkant
            </Button>
          </div>
        </div>
        
        <Button
          variant="destructive"
          onClick={handleRemoveLogo}
          className="w-full"
          disabled={isUploading}
        >
          Fjern Logo
        </Button>
      </div>
    </div>
  );
};

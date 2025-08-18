import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Edit3, X, User, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AvatarUploaderProps {
    currentAvatar?: string;
    userName: string;
    onAvatarChange?: (file: File) => Promise<void>;
    onAvatarRemove?: () => Promise<void>;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    editable?: boolean;
    className?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
    currentAvatar,
    userName,
    onAvatarChange,
    onAvatarRemove,
    size = 'lg',
    editable = true,
    className = ''
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vennligst velg en bildefil');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Bildet er for stort. Maksimal størrelse er 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        if (onAvatarChange) {
            setIsLoading(true);
            try {
                await onAvatarChange(file);
            } catch (error) {
                console.error('Avatar upload failed:', error);
                alert('Opplasting feilet. Prøv igjen.');
                setPreviewUrl(currentAvatar || null);
            } finally {
                setIsLoading(false);
            }
        }
    }, [onAvatarChange, currentAvatar]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    const handleRemoveAvatar = async () => {
        if (onAvatarRemove) {
            setIsLoading(true);
            try {
                await onAvatarRemove();
                setPreviewUrl(null);
            } catch (error) {
                console.error('Avatar removal failed:', error);
                alert('Kunne ikke fjerne profilbilde');
            } finally {
                setIsLoading(false);
            }
        } else {
            setPreviewUrl(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (!editable) {
        return (
            <Avatar className={`${sizeClasses[size]} ${className}`}>
                <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <div className={`relative group ${className}`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Avatar with drag/drop overlay */}
            <div
                className={`relative ${sizeClasses[size]} cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <Avatar className="w-full h-full">
                    <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                    <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                {/* Overlay */}
                <div className={`
          absolute inset-0 rounded-full flex items-center justify-center
          bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity
          ${dragActive ? 'opacity-100 bg-blue-500/20 border-2 border-blue-400 border-dashed' : ''}
          ${isLoading ? 'opacity-100' : ''}
        `}>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    ) : (
                        <Camera className="w-6 h-6 text-white" />
                    )}
                </div>

                {/* Edit badge */}
                <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="p-1 h-auto">
                        <Edit3 className="w-3 h-3" />
                    </Badge>
                </div>
            </div>

            {/* Remove button */}
            {previewUrl && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3 text-red-600" />
                </Button>
            )}

            {/* Upload instructions */}
            {size === 'xl' && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Klikk eller dra og slipp for å laste opp profilbilde
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span>JPG, PNG</span>
                        <span>•</span>
                        <span>Maks 5MB</span>
                        <span>•</span>
                        <span>Kvadratisk anbefales</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Quick avatar selector with preset options
export const AvatarSelector: React.FC<{
    onSelect: (avatar: string) => void;
    currentAvatar?: string;
}> = ({ onSelect, currentAvatar }) => {
    const presetAvatars = [
        '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎨', '👩‍🎨', '🧑‍🔬',
        '🐱', '🐶', '🦊', '🐻', '🐼', '🦁',
        '🎯', '⚡', '🔥', '💎', '🚀', '⭐'
    ];

    return (
        <div className="grid grid-cols-6 gap-2 p-4">
            {presetAvatars.map((emoji, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(emoji)}
                    className={`
            w-12 h-12 rounded-full flex items-center justify-center text-xl
            border-2 transition-colors hover:bg-blue-50
            ${currentAvatar === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          `}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default AvatarUploader;

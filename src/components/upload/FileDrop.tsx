import React, { useState, useCallback } from 'react';
import {
    IconPaperclip, IconSend, IconX, IconFile, IconPhoto,
    IconVideo, IconMusic, IconLoader
} from '@tabler/icons-react';

interface FileDropProps {
    onSendFiles: (files: File[], message?: string) => void;
    disabled?: boolean;
    className?: string;
}

interface FilePreview {
    file: File;
    id: string;
    preview?: string;
}

const FileDrop: React.FC<FileDropProps> = ({
    onSendFiles,
    disabled = false,
    className = ''
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Generate file preview
    const generateFilePreview = async (file: File): Promise<string | undefined> => {
        if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });
        }
        return undefined;
    };

    // Get file icon
    const getFileIcon = (file: File) => {
        const type = file.type.toLowerCase();
        if (type.startsWith('image/')) return <IconPhoto className="w-5 h-5" />;
        if (type.startsWith('video/')) return <IconVideo className="w-5 h-5" />;
        if (type.startsWith('audio/')) return <IconMusic className="w-5 h-5" />;
        return <IconFile className="w-5 h-5" />;
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle file selection
    const handleFileSelection = async (fileList: FileList) => {
        const fileArray = Array.from(fileList);
        const newFiles: FilePreview[] = [];

        for (const file of fileArray) {
            const preview = await generateFilePreview(file);
            newFiles.push({
                file,
                id: Date.now() + Math.random().toString(),
                preview
            });
        }

        setFiles(prev => [...prev, ...newFiles]);
    };

    // Drag handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (disabled) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileSelection(droppedFiles);
        }
    }, [disabled]);

    // Remove file
    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    // Send files
    const sendFiles = async () => {
        if (files.length === 0 || disabled || isUploading) return;

        setIsUploading(true);
        try {
            await onSendFiles(files.map(f => f.file), message.trim() || undefined);
            setFiles([]);
            setMessage('');
        } catch (error) {
            console.error('Error sending files:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendFiles();
        }
    };

    return (
        <div
            className={`file-drop-container ${className} ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            {isDragOver && (
                <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-blue-500 border-dashed">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="p-3 bg-blue-500 text-white rounded-full">
                                <IconPaperclip className="w-6 h-6" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Slipp filer for å dele
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* File preview area */}
            {files.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filer som skal sendes ({files.length})
                        </h4>
                        <button
                            onClick={() => setFiles([])}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            Fjern alle
                        </button>
                    </div>

                    {/* Files grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {files.map((filePreview) => (
                            <div key={filePreview.id} className="relative group">
                                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    {/* File preview/icon */}
                                    <div className="flex-shrink-0">
                                        {filePreview.preview ? (
                                            <img
                                                src={filePreview.preview}
                                                alt={filePreview.file.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                {getFileIcon(filePreview.file)}
                                            </div>
                                        )}
                                    </div>

                                    {/* File info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {filePreview.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(filePreview.file.size)}
                                        </p>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeFile(filePreview.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                                    >
                                        <IconX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message input */}
                    <div className="space-y-2">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Legg til en melding (valgfritt)..."
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            disabled={disabled || isUploading}
                        />

                        {/* Send button */}
                        <div className="flex justify-end">
                            <button
                                onClick={sendFiles}
                                disabled={disabled || isUploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {isUploading ? (
                                    <>
                                        <IconLoader className="w-4 h-4 animate-spin" />
                                        <span>Sender...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconSend className="w-4 h-4" />
                                        <span>Send filer</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileDrop;

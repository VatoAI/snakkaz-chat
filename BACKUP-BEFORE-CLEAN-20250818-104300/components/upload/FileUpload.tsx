import React, { useState, useRef, useCallback } from 'react';
import {
    IconUpload, IconFile, IconPhoto, IconVideo, IconMusic,
    IconX, IconCheck, IconLoader, IconExclamationTriangle
} from '@tabler/icons-react';

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    maxFiles?: number;
    maxSizePerFile?: number; // in bytes
    acceptedTypes?: string[];
    className?: string;
}

interface UploadProgress {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    maxFiles = 5,
    maxSizePerFile = 50 * 1024 * 1024, // 50MB
    acceptedTypes = [
        'image/*',
        'video/*',
        'audio/*',
        'application/pdf',
        'text/*',
        '.doc,.docx,.xls,.xlsx,.ppt,.pptx'
    ],
    className = ''
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get file icon based on type
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

    // Validate file
    const validateFile = (file: File): string | null => {
        if (file.size > maxSizePerFile) {
            return `Filen er for stor. Maks størrelse: ${formatFileSize(maxSizePerFile)}`;
        }

        const isTypeAccepted = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.includes('*')) {
                const baseType = type.split('/')[0];
                return file.type.startsWith(baseType);
            }
            return file.type === type;
        });

        if (!isTypeAccepted) {
            return 'Filtype ikke støttet';
        }

        return null;
    };

    // Handle file selection
    const handleFileSelection = (files: FileList) => {
        setError(null);
        const fileArray = Array.from(files);

        // Validate total file count
        if (selectedFiles.length + fileArray.length > maxFiles) {
            setError(`Maksimalt ${maxFiles} filer tillatt`);
            return;
        }

        // Validate each file
        const validatedFiles: File[] = [];
        const errors: string[] = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validatedFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join(', '));
            return;
        }

        const newFiles = [...selectedFiles, ...validatedFiles];
        setSelectedFiles(newFiles);
        onFileSelect(newFiles);
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files);
        }
    }, [selectedFiles]);

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files);
        }
    };

    // Remove file
    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFileSelect(newFiles);
    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Simulate upload progress (replace with actual upload logic)
    const simulateUpload = async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setUploadProgress(prev =>
                        prev.map(p =>
                            p.file === file
                                ? { ...p, progress: 100, status: 'completed' }
                                : p
                        )
                    );
                    resolve();
                } else {
                    setUploadProgress(prev =>
                        prev.map(p =>
                            p.file === file
                                ? { ...p, progress: Math.floor(progress) }
                                : p
                        )
                    );
                }
            }, 100);

            // Simulate random error (5% chance)
            if (Math.random() < 0.05) {
                setTimeout(() => {
                    clearInterval(interval);
                    setUploadProgress(prev =>
                        prev.map(p =>
                            p.file === file
                                ? { ...p, status: 'error', error: 'Upload feilet' }
                                : p
                        )
                    );
                    reject(new Error('Upload failed'));
                }, 2000);
            }
        });
    };

    // Start upload
    const startUpload = async () => {
        const progressItems: UploadProgress[] = selectedFiles.map(file => ({
            file,
            progress: 0,
            status: 'uploading' as const
        }));

        setUploadProgress(progressItems);

        // Upload files (simulate for now)
        try {
            await Promise.all(selectedFiles.map(file => simulateUpload(file)));
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <div className={`file-upload-container ${className}`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFilePicker}
                className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }
          ${selectedFiles.length > 0 ? 'mb-4' : ''}
        `}
            >
                <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full ${isDragOver ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                        <IconUpload className="w-6 h-6" />
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {isDragOver ? 'Slipp filene her' : 'Dra og slipp filer her'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            eller klikk for å velge filer
                        </p>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                        <p>Maks {maxFiles} filer, {formatFileSize(maxSizePerFile)} per fil</p>
                        <p>Støttede typer: Bilder, videoer, lyd, dokumenter</p>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <IconExclamationTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                </div>
            )}

            {/* Selected files list */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Valgte filer ({selectedFiles.length})
                        </h4>
                        {uploadProgress.length === 0 && (
                            <button
                                onClick={startUpload}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                                Last opp
                            </button>
                        )}
                    </div>

                    {selectedFiles.map((file, index) => {
                        const progress = uploadProgress.find(p => p.file === file);

                        return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-gray-500 dark:text-gray-400">
                                    {getFileIcon(file)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>

                                    {/* Progress bar */}
                                    {progress && (
                                        <div className="mt-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${progress.status === 'completed' ? 'bg-green-500' :
                                                                progress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                                            }`}
                                                        style={{ width: `${progress.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {progress.status === 'completed' ? '✓' :
                                                        progress.status === 'error' ? '✗' :
                                                            `${progress.progress}%`}
                                                </span>
                                            </div>
                                            {progress.error && (
                                                <p className="text-xs text-red-500 mt-1">{progress.error}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status icon */}
                                <div className="flex items-center space-x-2">
                                    {progress ? (
                                        progress.status === 'completed' ? (
                                            <IconCheck className="w-4 h-4 text-green-500" />
                                        ) : progress.status === 'error' ? (
                                            <IconExclamationTriangle className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <IconLoader className="w-4 h-4 text-blue-500 animate-spin" />
                                        )
                                    ) : (
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        >
                                            <IconX className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FileUpload;

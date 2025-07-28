import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Video, Music, File, Check } from 'lucide-react';

interface FileUploadModalProps {
  onUploadFiles: (files: FileList) => void;
  onClose: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onUploadFiles,
  onClose
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-400" />;
    if (fileType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-400" />;
    if (fileType.startsWith('audio/')) return <Music className="w-8 h-8 text-green-400" />;
    if (fileType.includes('text/') || fileType.includes('document')) return <FileText className="w-8 h-8 text-orange-400" />;
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createFilePreview = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }
    return undefined;
  };

  const processFiles = async (files: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = await createFilePreview(file);
      
      newFiles.push({
        file,
        id: Date.now().toString() + i,
        progress: 0,
        status: 'uploading',
        preview
      });
    }
    
    setUploadFiles(newFiles);
    
    // Simulate upload progress
    newFiles.forEach((uploadFile, index) => {
      const interval = setInterval(() => {
        setUploadFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 20, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
      }, 2000 + index * 500);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const sendFiles = () => {
    const completedFiles = uploadFiles.filter(f => f.status === 'completed');
    if (completedFiles.length > 0) {
      const fileList = new DataTransfer();
      completedFiles.forEach(f => fileList.items.add(f.file));
      onUploadFiles(fileList.files);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          className="glass-card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Upload Files</h3>
            <motion.button
              className="glass-button p-2"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Drop Zone */}
          <motion.div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            whileHover={{ scale: 1.02 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            
            <motion.div
              animate={{ y: dragOver ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">
                {dragOver ? 'Drop files here' : 'Drag & drop files here'}
              </h4>
              <p className="text-gray-400 mb-4">or</p>
              <motion.button
                className="glass-button primary px-6 py-3"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose Files
              </motion.button>
            </motion.div>
          </motion.div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Uploading Files</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploadFiles.map((uploadFile) => (
                  <motion.div
                    key={uploadFile.id}
                    className="glass-card p-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    layout
                  >
                    <div className="flex items-center space-x-4">
                      {uploadFile.preview ? (
                        <img 
                          src={uploadFile.preview} 
                          alt={uploadFile.file.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center">
                          {getFileIcon(uploadFile.file.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${
                                uploadFile.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : uploadFile.status === 'error'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadFile.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {uploadFile.status === 'completed' ? 'Completed' : `${Math.round(uploadFile.progress)}%`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'completed' && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                        <motion.button
                          className="text-red-400 hover:text-red-300 p-1"
                          onClick={() => removeFile(uploadFile.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {uploadFiles.length > 0 && (
            <motion.div 
              className="flex space-x-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="glass-button flex-1 py-3"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                className="glass-button primary flex-1 py-3"
                onClick={sendFiles}
                disabled={!uploadFiles.some(f => f.status === 'completed')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send {uploadFiles.filter(f => f.status === 'completed').length} Files
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileUploadModal;

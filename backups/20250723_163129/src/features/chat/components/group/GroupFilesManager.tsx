/**
 * Group Files Manager Component for Snakkaz Chat
 * 
 * This component implements a file sharing and management system for group chats,
 * allowing users to upload, organize, and download files within a group.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { 
  FileIcon, FolderIcon, DownloadIcon, TrashIcon, 
  UploadIcon, FolderPlusIcon, RefreshCwIcon, FileTextIcon, 
  ImageIcon, FilmIcon, FileArchiveIcon, FileSpreadsheetIcon,
  FileSliders, Presentation, Lock, Globe, Search, XIcon, 
  MoreVerticalIcon, LinkIcon, Share2Icon, ClipboardCheckIcon
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

// File interface
interface GroupFile {
  id: string;
  groupId: string;
  uploadedBy: string;
  uploadedByName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  path: string;
  publicUrl: string;
  folderId: string | null;
  isEncrypted: boolean;
  createdAt: string;
  thumbnailUrl?: string;
}

// Folder interface
interface GroupFolder {
  id: string;
  groupId: string;
  createdBy: string;
  name: string;
  createdAt: string;
  fileCount: number;
}

interface GroupFilesManagerProps {
  groupId: string;
  currentUserId: string;
  isAdmin: boolean;
  canManageFiles?: boolean;
  isPremium: boolean;
  groupName: string;
  maxUploadSize?: number; // in MB
}

export function GroupFilesManager({
  groupId,
  currentUserId,
  isAdmin,
  canManageFiles = isAdmin, // Default to isAdmin if not provided
  isPremium,
  groupName,
  maxUploadSize = isPremium ? 100 : 20 // Default max size: 100MB for premium, 20MB for standard
}: GroupFilesManagerProps) {
  // File management state
  const [files, setFiles] = useState<GroupFile[]>([]);
  const [folders, setFolders] = useState<GroupFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch files and folders from database
  const fetchFilesAndFolders = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      
      // Fetch files
      const { data: filesData, error: filesError } = await supabase
        .from('group_files')
        .select(`
          *,
          profiles:uploaded_by (display_name)
        `)
        .eq('group_id', groupId);
        
      if (filesError) throw filesError;
      
      // Fetch folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('group_folders')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
        
      if (foldersError) throw foldersError;
      
      // Process files to add proper URLs and metadata
      const processedFiles = filesData?.map(file => ({
        id: file.id,
        groupId: file.group_id,
        uploadedBy: file.uploaded_by,
        uploadedByName: file.profiles?.display_name || 'Unknown User',
        fileName: file.file_name,
        fileSize: file.file_size,
        fileType: file.file_type,
        path: file.path,
        publicUrl: file.public_url || supabase.storage.from('group-files').getPublicUrl(file.path).data.publicUrl,
        folderId: file.folder_id,
        isEncrypted: file.is_encrypted,
        createdAt: file.created_at,
        thumbnailUrl: file.thumbnail_url
      })) || [];
      
      // Process folders to add file counts
      const processedFolders = foldersData?.map(folder => {
        const fileCount = processedFiles.filter(file => file.folderId === folder.id).length;
        return {
          id: folder.id,
          groupId: folder.group_id,
          createdBy: folder.created_by,
          name: folder.name,
          createdAt: folder.created_at,
          fileCount
        };
      }) || [];
      
      setFiles(processedFiles);
      setFolders(processedFolders);
      
    } catch (error) {
      console.error('Failed to fetch files and folders:', error);
      toast({
        title: "Failed to load files",
        description: "Could not load file data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  }, [groupId, toast]);
  
  // Load files and folders for this group
  useEffect(() => {
    fetchFilesAndFolders();
    
    // Set up real-time subscription for file updates
    const filesSubscription = supabase
      .channel('group-files')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_files',
        filter: `group_id=eq.${groupId}`
      }, () => {
        fetchFilesAndFolders();
      })
      .subscribe();
      
    const foldersSubscription = supabase
      .channel('group-folders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_folders',
        filter: `group_id=eq.${groupId}`
      }, () => {
        fetchFilesAndFolders();
      })
      .subscribe();
      
    return () => {
      filesSubscription.unsubscribe();
      foldersSubscription.unsubscribe();
    };
  }, [groupId, fetchFilesAndFolders]);

  // Handle file selection for upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Check if any file exceeds the max size
    const oversizedFiles = files.filter(file => file.size > maxUploadSize * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversizedFiles.length} file(s) exceed the ${maxUploadSize}MB limit.`,
        variant: "destructive",
      });
      
      // Filter out oversized files
      const validFiles = files.filter(file => file.size <= maxUploadSize * 1024 * 1024);
      setSelectedFiles(validFiles);
    } else {
      setSelectedFiles(files);
    }
    
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let successCount = 0;
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress for multi-file uploads
        const fileProgress = i / selectedFiles.length * 100;
        setUploadProgress(fileProgress);
        
        // Create a unique file path in storage
        const filePath = `${groupId}/${Date.now()}-${file.name}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('group-files')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          continue;
        }
        
        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('group-files')
          .getPublicUrl(filePath);
          
        // Insert file record in database
        const { error: dbError } = await supabase
          .from('group_files')
          .insert({
            group_id: groupId,
            uploaded_by: currentUserId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            path: filePath,
            public_url: urlData?.publicUrl,
            folder_id: currentFolder,
            is_encrypted: false // Basic upload is unencrypted
          });
          
        if (dbError) {
          console.error(`Failed to record ${file.name} in database:`, dbError);
          continue;
        }
        
        // Notify group about the new file
        await supabase
          .from('group_messages')
          .insert({
            group_id: groupId,
            sender_id: currentUserId,
            content: `📎 **File Shared**: "${file.name}"`,
            message_type: 'system',
            metadata: {
              type: 'file_shared',
              file_name: file.name,
              file_type: file.type
            }
          });
          
        successCount++;
      }
      
      // Show success message
      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${successCount} file(s)`,
        });
        
        // Refresh files list
        fetchFilesAndFolders();
      } else {
        toast({
          title: "Upload Failed",
          description: "Could not upload any files. Please try again.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Failed during upload:', error);
      toast({
        title: "Upload Error",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
      setShowUploadDialog(false);
    }
  };

  // Create a new folder
  const createFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: "Missing Folder Name",
        description: "Please provide a name for the folder.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingFolder(true);
    
    try {
      // Check if folder with same name exists
      const { data: existingFolders } = await supabase
        .from('group_folders')
        .select('id')
        .eq('group_id', groupId)
        .eq('name', folderName.trim())
        .limit(1);
        
      if (existingFolders && existingFolders.length > 0) {
        toast({
          title: "Folder Already Exists",
          description: "A folder with this name already exists.",
          variant: "destructive",
        });
        return;
      }
      
      // Insert the folder
      const { data, error } = await supabase
        .from('group_folders')
        .insert({
          group_id: groupId,
          created_by: currentUserId,
          name: folderName.trim()
        })
        .select();
        
      if (error) throw error;
      
      // Reset form state
      setFolderName("");
      setShowCreateFolderDialog(false);
      
      // Show success message
      toast({
        title: "Folder Created",
        description: "Your folder has been created successfully.",
      });
      
      // Refresh folders
      fetchFilesAndFolders();
      
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast({
        title: "Folder Creation Failed",
        description: "Could not create your folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Delete selected files
  const deleteSelectedFiles = async () => {
    if (selectedFileIds.length === 0) return;
    
    try {
      // Get the files to delete
      const filesToDelete = files.filter(file => selectedFileIds.includes(file.id));
      
      // Delete files from storage
      for (const file of filesToDelete) {
        await supabase.storage
          .from('group-files')
          .remove([file.path]);
      }
      
      // Delete file records from database
      await supabase
        .from('group_files')
        .delete()
        .in('id', selectedFileIds);
        
      // Show success message
      toast({
        title: "Files Deleted",
        description: `Successfully deleted ${selectedFileIds.length} file(s)`,
      });
      
      // Reset selection
      setSelectedFileIds([]);
      
      // Refresh files list
      fetchFilesAndFolders();
      
    } catch (error) {
      console.error('Failed to delete files:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the selected files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  // Navigate to a folder
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedFileIds([]);
  };

  // Generate a sharing URL for a file
  const generateShareUrl = async (fileId: string) => {
    setShareFileId(fileId);
    setIsGeneratingShareUrl(true);
    
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');
      
      // Create a sharing record with an expiry time
      const expiryTime = new Date();
      expiryTime.setDate(expiryTime.getDate() + 7); // 7-day expiry
      
      const { data, error } = await supabase
        .from('file_shares')
        .insert({
          file_id: fileId,
          created_by: currentUserId,
          expires_at: expiryTime.toISOString(),
          share_token: crypto.randomUUID()
        })
        .select();
        
      if (error) throw error;
      
      const shareToken = data[0].share_token;
      const url = `${window.location.origin}/shared-file/${shareToken}`;
      
      setShareUrl(url);
      setShowShareDialog(true);
      
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      toast({
        title: "Sharing Failed",
        description: "Could not create sharing link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingShareUrl(false);
    }
  };

  // Copy share URL to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: "Link Copied",
          description: "Sharing link copied to clipboard",
        });
      },
      (err) => {
        console.error('Failed to copy URL:', err);
      }
    );
  };

  // Get icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <FilmIcon className="h-5 w-5" />;
    if (fileType.startsWith('text/')) return <FileTextIcon className="h-5 w-5" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheetIcon className="h-5 w-5" />;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <Presentation className="h-5 w-5" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('compressed')) return <FileArchiveIcon className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and sort files based on current view
  const filteredFiles = files
    .filter(file => {
      // Filter by current folder
      const folderMatch = currentFolder === null 
        ? file.folderId === null
        : file.folderId === currentFolder;
        
      // Filter by search query
      const searchMatch = searchQuery === '' || 
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
        
      return folderMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort based on selected criteria
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.fileName.localeCompare(b.fileName)
          : b.fileName.localeCompare(a.fileName);
      } else if (sortBy === 'size') {
        return sortDirection === 'asc'
          ? a.fileSize - b.fileSize
          : b.fileSize - a.fileSize;
      } else {
        // Default: sort by date
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Get breadcrumb path
  const getBreadcrumb = () => {
    if (currentFolder === null) {
      return <span className="text-cybergold-200">All Files</span>;
    }
    
    const folder = folders.find(f => f.id === currentFolder);
    return (
      <>
        <button
          className="text-cyberblue-400 hover:text-cyberblue-300"
          onClick={() => navigateToFolder(null)}
        >
          All Files
        </button>
        <span className="text-gray-500 mx-1">/</span>
        <span className="text-cybergold-200">{folder?.name || 'Unknown Folder'}</span>
      </>
    );
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cybergold-200 flex items-center">
          <FileIcon className="mr-2 h-5 w-5 text-cybergold-400" />
          Group Files
        </h3>
      </div>
      
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex border-b border-cyberdark-700 mb-4">
          <Tabs.Trigger
            value="files"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'files' 
                ? 'text-cybergold-400 border-b-2 border-cybergold-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Files
          </Tabs.Trigger>
          <Tabs.Trigger
            value="folders"
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === 'folders' 
                ? 'text-cybergold-400 border-b-2 border-cybergold-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Folders
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="files" className="outline-none">
          <div className="bg-cyberdark-900/50 rounded-md p-3 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-600" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-cyberdark-800 border-cyberdark-700 text-white"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
                  onClick={() => fetchFilesAndFolders()}
                >
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
                
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-10 bg-cybergold-700 hover:bg-cybergold-600 text-cyberdark-950"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
                    <DialogHeader>
                      <DialogTitle className="text-cybergold-200">Upload Files</DialogTitle>
                      <DialogDescription className="text-cybergold-400">
                        Upload files to share with the group.
                        {currentFolder !== null && (
                          <span className="block mt-1">
                            Uploading to folder: <strong>{folders.find(f => f.id === currentFolder)?.name}</strong>
                          </span>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-cybergold-500/30 rounded-md p-8 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        <div className="flex flex-col items-center">
                          <UploadIcon className="h-12 w-12 text-cybergold-400 mb-4" />
                          <p className="text-cybergold-200 mb-2">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-cybergold-500 text-sm mb-4">
                            Maximum file size: {maxUploadSize} MB
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-cybergold-500/50 text-cybergold-400"
                          >
                            Select Files
                          </Button>
                        </div>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="bg-cyberdark-800/70 rounded-md p-3">
                          <p className="text-sm text-cybergold-200 mb-2">
                            Selected {selectedFiles.length} file(s):
                          </p>
                          <div className="max-h-32 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex justify-between items-center py-1 border-b border-cyberdark-700 last:border-0">
                                <div className="flex items-center">
                                  {getFileIcon(file.type)}
                                  <span className="ml-2 text-sm text-white truncate max-w-[200px]">
                                    {file.name}
                                  </span>
                                </div>
                                <span className="text-xs text-cybergold-500">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUploadDialog(false);
                          setSelectedFiles([]);
                        }}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={isUploading || selectedFiles.length === 0}
                        className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950"
                      >
                        {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {selectedFileIds.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-10"
                    onClick={deleteSelectedFiles}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete ({selectedFileIds.length})
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-3 text-sm text-cybergold-500">
              {getBreadcrumb()}
            </div>
          </div>
          
          {isLoadingFiles ? (
            <div className="text-center py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-36 bg-cyberdark-800 rounded-md mb-4"></div>
                <div className="h-4 w-48 bg-cyberdark-800 rounded-md"></div>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-6 bg-cyberdark-900/50 rounded-lg">
              <FileIcon className="h-10 w-10 text-cybergold-400/50 mx-auto mb-2" />
              {searchQuery ? (
                <p className="text-cybergold-500">No files match your search.</p>
              ) : (
                <>
                  <p className="text-cybergold-500">No files have been uploaded yet.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadDialog(true)}
                    className="mt-2 text-cybergold-400 hover:text-cybergold-300"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2 bg-cyberdark-800 rounded-t-md text-cybergold-400 text-sm font-medium">
                <div className="w-6"></div>
                <button
                  className={`text-left ${sortBy === 'name' ? 'text-cybergold-300' : ''}`}
                  onClick={() => {
                    setSortDirection(sortBy === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
                    setSortBy('name');
                  }}
                >
                  Name
                </button>
                <button
                  className={`text-right ${sortBy === 'size' ? 'text-cybergold-300' : ''} w-20`}
                  onClick={() => {
                    setSortDirection(sortBy === 'size' && sortDirection === 'asc' ? 'desc' : 'asc');
                    setSortBy('size');
                  }}
                >
                  Size
                </button>
                <button
                  className={`text-right ${sortBy === 'date' ? 'text-cybergold-300' : ''} w-32`}
                  onClick={() => {
                    setSortDirection(sortBy === 'date' && sortDirection === 'asc' ? 'desc' : 'asc');
                    setSortBy('date');
                  }}
                >
                  Uploaded
                </button>
              </div>
              
              <div className="bg-cyberdark-900/50 rounded-b-md overflow-hidden">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-3 items-center border-b border-cyberdark-800 last:border-0 hover:bg-cyberdark-800/50 ${
                      selectedFileIds.includes(file.id) ? 'bg-cybergold-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFileIds.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="h-4 w-4 rounded border-cybergold-500/50 bg-transparent"
                      />
                    </div>
                    
                    <div className="min-w-0 flex items-center">
                      <span className="mr-2 flex-shrink-0 text-cybergold-400">
                        {getFileIcon(file.fileType)}
                      </span>
                      
                      <a
                        href={file.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-white hover:text-cybergold-300"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </a>
                      
                      {file.isEncrypted && (
                        <Lock className="h-3.5 w-3.5 ml-2 text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-cybergold-500 text-sm text-right w-20">
                      {formatFileSize(file.fileSize)}
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <span className="text-cybergold-500 text-sm text-right w-32" title={format(new Date(file.createdAt), 'PPP')}>
                        {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                      </span>
                      
                      <div className="flex ml-3">
                        <button
                          onClick={() => window.open(file.publicUrl, '_blank')}
                          className="text-cyberblue-400 hover:text-cyberblue-300 p-1"
                          title="Download"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => generateShareUrl(file.id)}
                          className="text-cyberblue-400 hover:text-cyberblue-300 p-1"
                          title="Share"
                        >
                          <Share2Icon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Tabs.Content>
        
        <Tabs.Content value="folders" className="outline-none">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-cybergold-200">Group Folders</h4>
            
            <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-950/30"
                >
                  <FolderPlusIcon className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              
              <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
                <DialogHeader>
                  <DialogTitle className="text-cybergold-200">Create New Folder</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folderName" className="text-cybergold-200">Folder Name</Label>
                    <Input
                      id="folderName"
                      placeholder="Enter folder name"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      className="bg-cyberdark-950 border-cybergold-500/30 text-cybergold-200"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateFolderDialog(false)}
                    disabled={isCreatingFolder}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createFolder}
                    disabled={isCreatingFolder || !folderName.trim()}
                    className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950"
                  >
                    {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoadingFiles ? (
            <div className="text-center py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-36 bg-cyberdark-800 rounded-md mb-4"></div>
                <div className="h-4 w-48 bg-cyberdark-800 rounded-md"></div>
              </div>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-6 bg-cyberdark-900/50 rounded-lg">
              <FolderIcon className="h-10 w-10 text-cybergold-400/50 mx-auto mb-2" />
              <p className="text-cybergold-500">No folders have been created yet.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateFolderDialog(true)}
                className="mt-2 text-cybergold-400 hover:text-cybergold-300"
              >
                <FolderPlusIcon className="h-4 w-4 mr-2" />
                Create First Folder
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <Card key={folder.id} className="bg-cyberdark-900/70 border-cybergold-500/30 hover:bg-cyberdark-800/70 transition-colors">
                  <CardHeader className="pb-3 cursor-pointer" onClick={() => navigateToFolder(folder.id)}>
                    <div className="flex items-center">
                      <FolderIcon className="h-6 w-6 text-cybergold-400 mr-2" />
                      <CardTitle className="text-base text-cybergold-200 truncate">{folder.name}</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-3">
                    <p className="text-cybergold-500 text-sm">
                      {folder.fileCount} file{folder.fileCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-cybergold-500 text-xs">
                      Created {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToFolder(folder.id)}
                      className="w-full text-cybergold-400 hover:text-cybergold-300 bg-cyberdark-800/50"
                    >
                      Open Folder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
          <DialogHeader>
            <DialogTitle className="text-cybergold-200">Share File</DialogTitle>
            <DialogDescription className="text-cybergold-400">
              Anyone with this link can access the file
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-cyberdark-800 p-3 rounded-md flex items-center">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={copyShareUrl}
                className="flex-shrink-0"
              >
                <ClipboardCheckIcon className="h-4 w-4 text-cybergold-400" />
              </Button>
            </div>
            
            <div className="bg-cyberdark-800/50 p-3 rounded-md text-center">
              <Globe className="h-5 w-5 text-cybergold-400 mx-auto mb-1" />
              <p className="text-xs text-cybergold-500">
                This link expires in 7 days
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(false)}
            >
              Done
            </Button>
            <Button
              onClick={copyShareUrl}
              className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-950"
            >
              <ClipboardCheckIcon className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper label component
const Label = ({ htmlFor, children, className = '' }: { htmlFor?: string, children: React.ReactNode, className?: string }) => (
  <label htmlFor={htmlFor} className={`mb-2 block text-sm font-medium ${className}`}>
    {children}
  </label>
);

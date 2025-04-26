/**
 * Utility for initializing storage buckets and settings
 */
import { supabase } from '@/integrations/supabase/client';

// Define all buckets that should exist
const REQUIRED_BUCKETS = [
  {
    name: 'avatars',
    isPublic: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  {
    name: 'group_avatars',
    isPublic: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  {
    name: 'chat-media',
    isPublic: true,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/msword', 'text/plain']
  },
  {
    name: 'app-assets',
    isPublic: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/*']
  }
];

/**
 * Initialize all required storage buckets
 */
export const initializeStorage = async (): Promise<{success: boolean, errors: string[]}> => {
  const errors: string[] = [];
  
  try {
    console.log('Initializing storage buckets...');
    
    // 1. List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      errors.push(`Failed to list storage buckets: ${listError.message}`);
      return { success: false, errors };
    }
    
    const existingBucketNames = buckets?.map(b => b.name) || [];
    console.log('Existing buckets:', existingBucketNames);
    
    // 2. Create missing buckets
    for (const bucket of REQUIRED_BUCKETS) {
      if (!existingBucketNames.includes(bucket.name)) {
        console.log(`Creating bucket: ${bucket.name}`);
        const { error: createError } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.isPublic,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes
        });
        
        if (createError) {
          console.error(`Error creating bucket ${bucket.name}:`, createError);
          errors.push(`Failed to create bucket ${bucket.name}: ${createError.message}`);
        } else {
          console.log(`Bucket ${bucket.name} created successfully`);
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`);
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing storage';
    console.error('Storage initialization failed:', err);
    errors.push(errorMessage);
    return { success: false, errors };
  }
};
/**
 * Dynamic Profile Page Wrapper
 * 
 * This wrapper implements dynamic loading for the Profile page to reduce bundle size.
 * The Profile page includes large components and form validation libraries.
 */
import React, { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, Crown } from 'lucide-react';

// Dynamically load the Profile component
const Profile = lazy(() => import("@/pages/Profile"));

// Custom loading skeleton that matches the Profile page layout
const ProfileLoadingSkeleton = () => (
  <div className="min-h-screen bg-cyberdark-950 p-4">
    <div className="max-w-4xl mx-auto">
      {/* Navigation skeleton */}
      <div className="mb-6">
        <Skeleton className="h-16 w-full bg-cyberdark-800" />
      </div>
      
      {/* Profile header skeleton */}
      <Card className="mb-6 bg-cyberdark-900 border-cyberdark-700">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-cyberdark-800">
                <User className="h-8 w-8 text-cybergold-400" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48 bg-cyberdark-700" />
              <Skeleton className="h-4 w-32 bg-cyberdark-700" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16 bg-cyberdark-700 rounded-full" />
                <Crown className="h-5 w-5 text-cybergold-400" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700">
          <Skeleton className="h-10 w-24 bg-cyberdark-700 rounded-md" />
          <Skeleton className="h-10 w-28 bg-cyberdark-800 rounded-md" />
          <Skeleton className="h-10 w-20 bg-cyberdark-800 rounded-md" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <Card className="bg-cyberdark-900 border-cyberdark-700">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Form fields skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-cyberdark-700" />
                <Skeleton className="h-10 w-full bg-cyberdark-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-cyberdark-700" />
                <Skeleton className="h-10 w-full bg-cyberdark-800" />
              </div>
            </div>
            
            {/* Bio skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-cyberdark-700" />
              <Skeleton className="h-24 w-full bg-cyberdark-800" />
            </div>
            
            {/* Action buttons skeleton */}
            <div className="flex space-x-3 pt-4">
              <Skeleton className="h-10 w-24 bg-cybergold-600/20" />
              <Skeleton className="h-10 w-20 bg-cyberdark-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Main dynamic Profile component
export const DynamicProfile: React.FC = () => {
  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      <Profile />
    </Suspense>
  );
};

export default DynamicProfile;

/**
 * Dynamic Mail Page Wrapper
 * 
 * This wrapper implements dynamic loading for the Mail page to reduce bundle size.
 * The Mail page includes complex animations, form handling, and UI libraries.
 */
import React, { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Inbox, Send, Archive, Star, Search } from 'lucide-react';

// Dynamically load the Mail component
const Mail = lazy(() => import("@/pages/Mail"));

// Custom loading skeleton that matches the Mail page layout
const MailLoadingSkeleton = () => (
  <div className="min-h-screen bg-cyberdark-950">
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-cyberdark-900 border-r border-cyberdark-700 p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-6 w-6 text-cybergold-400" />
            <Skeleton className="h-6 w-20 bg-cyberdark-700" />
          </div>
          <Skeleton className="h-10 w-full bg-cybergold-600/20 rounded-md" />
        </div>
        
        <div className="space-y-2">
          {[
            { icon: Inbox, label: "Innboks" },
            { icon: Send, label: "Sendt" },
            { icon: Archive, label: "Arkiv" },
            { icon: Star, label: "Stjernert" }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 p-2 rounded-md bg-cyberdark-800">
              <item.icon className="h-4 w-4 text-cybergold-400" />
              <Skeleton className="h-4 w-16 bg-cyberdark-700" />
              <Skeleton className="h-4 w-6 bg-cyberdark-700 ml-auto rounded-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="p-4 border-b border-cyberdark-700 bg-cyberdark-900">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32 bg-cyberdark-700" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 bg-cyberdark-700 rounded" />
              <Skeleton className="h-8 w-8 bg-cyberdark-700 rounded" />
              <Skeleton className="h-8 w-8 bg-cyberdark-700 rounded" />
            </div>
          </div>
          
          {/* Search bar skeleton */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-10 w-full bg-cyberdark-800 pl-10" />
          </div>
        </div>
        
        {/* Email list skeleton */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-cyberdark-900 border-cyberdark-700 hover:bg-cyberdark-800/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 bg-cyberdark-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32 bg-cyberdark-700" />
                        <Skeleton className="h-3 w-16 bg-cyberdark-800" />
                      </div>
                      <Skeleton className="h-4 w-48 bg-cyberdark-700" />
                      <Skeleton className="h-3 w-3/4 bg-cyberdark-800" />
                    </div>
                    <div className="flex space-x-2">
                      <Star className="h-4 w-4 text-cyberdark-600" />
                      <Skeleton className="h-4 w-4 bg-cyberdark-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main dynamic Mail component
export const DynamicMail: React.FC = () => {
  return (
    <Suspense fallback={<MailLoadingSkeleton />}>
      <Mail />
    </Suspense>
  );
};

export default DynamicMail;

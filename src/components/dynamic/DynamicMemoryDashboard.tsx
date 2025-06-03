/**
 * Dynamic Memory Dashboard Wrapper
 * 
 * This wrapper implements dynamic loading for the MemoryDashboard to reduce bundle size.
 * The MemoryDashboard includes AI services, complex forms, and data visualization components.
 */
import React, { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Search, BarChart3, Database, Star, Clock } from 'lucide-react';

// Dynamically load the MemoryDashboard component
const MemoryDashboard = lazy(() => import("@/pages/MemoryDashboard"));

// Custom loading skeleton that matches the MemoryDashboard layout
const MemoryDashboardLoadingSkeleton = () => (
  <div className="min-h-screen bg-cyberdark-950 p-4">
    <div className="max-w-6xl mx-auto">
      {/* Navigation skeleton */}
      <div className="mb-6">
        <Skeleton className="h-16 w-full bg-cyberdark-800" />
      </div>
      
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-10 w-10 text-cybergold-400" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-cyberdark-700" />
            <Skeleton className="h-4 w-72 bg-cyberdark-800" />
          </div>
        </div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Database, label: "Total Memories" },
          { icon: Star, label: "Favorites" },
          { icon: Clock, label: "Recent" },
          { icon: BarChart3, label: "Analytics" }
        ].map((item, i) => (
          <Card key={i} className="bg-cyberdark-900 border-cyberdark-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <item.icon className="h-8 w-8 text-cybergold-400" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-12 bg-cyberdark-700" />
                  <Skeleton className="h-3 w-16 bg-cyberdark-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700">
          <Skeleton className="h-10 w-24 bg-cyberdark-700 rounded-md" />
          <Skeleton className="h-10 w-20 bg-cyberdark-800 rounded-md" />
          <Skeleton className="h-10 w-28 bg-cyberdark-800 rounded-md" />
          <Skeleton className="h-10 w-24 bg-cyberdark-800 rounded-md" />
        </div>
      </div>
      
      {/* Search and filters skeleton */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-10 w-full bg-cyberdark-800 pl-10" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 bg-cyberdark-800" />
            <Skeleton className="h-10 w-20 bg-cyberdark-800" />
          </div>
        </div>
      </div>
      
      {/* Memory entries skeleton */}
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-cyberdark-900 border-cyberdark-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4 bg-cyberdark-700" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-4 w-16 bg-cyberdark-800 rounded-full" />
                    <Skeleton className="h-4 w-20 bg-cyberdark-800 rounded-full" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 bg-cyberdark-700 rounded" />
                  <Skeleton className="h-8 w-8 bg-cyberdark-700 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-cyberdark-800" />
                <Skeleton className="h-4 w-5/6 bg-cyberdark-800" />
                <Skeleton className="h-4 w-4/6 bg-cyberdark-800" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-3 w-24 bg-cyberdark-800" />
                <Skeleton className="h-3 w-16 bg-cyberdark-800" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add memory button skeleton */}
      <div className="fixed bottom-6 right-6">
        <Skeleton className="h-14 w-14 bg-cybergold-600/20 rounded-full" />
      </div>
    </div>
  </div>
);

// Main dynamic MemoryDashboard component
export const DynamicMemoryDashboard: React.FC = () => {
  return (
    <Suspense fallback={<MemoryDashboardLoadingSkeleton />}>
      <MemoryDashboard />
    </Suspense>
  );
};

export default DynamicMemoryDashboard;

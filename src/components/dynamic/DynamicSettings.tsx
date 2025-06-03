/**
 * Dynamic Settings Page Wrapper
 * 
 * This wrapper implements dynamic loading for the Settings page to reduce bundle size.
 * The Settings page includes form validation, UI components, and security features.
 */
import React, { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, Palette, Globe, User } from 'lucide-react';

// Dynamically load the Settings component
const Settings = lazy(() => import("@/pages/Settings"));

// Custom loading skeleton that matches the Settings page layout
const SettingsLoadingSkeleton = () => (
  <div className="min-h-screen bg-cyberdark-950 p-4">
    <div className="max-w-4xl mx-auto">
      {/* Navigation skeleton */}
      <div className="mb-6">
        <Skeleton className="h-16 w-full bg-cyberdark-800" />
      </div>
      
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="h-8 w-8 text-cybergold-400" />
          <Skeleton className="h-8 w-32 bg-cyberdark-700" />
        </div>
        <Skeleton className="h-4 w-64 bg-cyberdark-700" />
      </div>
      
      {/* Tabs skeleton */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700">
          <div className="flex items-center space-x-2 px-3 py-2">
            <User className="h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-4 w-16 bg-cyberdark-700" />
          </div>
          <div className="flex items-center space-x-2 px-3 py-2">
            <Shield className="h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-4 w-20 bg-cyberdark-800" />
          </div>
          <div className="flex items-center space-x-2 px-3 py-2">
            <Bell className="h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-4 w-24 bg-cyberdark-800" />
          </div>
          <div className="flex items-center space-x-2 px-3 py-2">
            <Palette className="h-4 w-4 text-cybergold-400" />
            <Skeleton className="h-4 w-12 bg-cyberdark-800" />
          </div>
        </div>
      </div>
      
      {/* Settings cards skeleton */}
      <div className="grid gap-6">
        {/* General Settings Card */}
        <Card className="bg-cyberdark-900 border-cyberdark-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-cybergold-400" />
              <Skeleton className="h-6 w-32 bg-cyberdark-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="flex justify-between items-center py-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 bg-cyberdark-700" />
                <Skeleton className="h-3 w-48 bg-cyberdark-800" />
              </div>
              <Skeleton className="h-6 w-12 bg-cyberdark-700 rounded-full" />
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings Card */}
        <Card className="bg-cyberdark-900 border-cyberdark-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-cybergold-400" />
              <Skeleton className="h-6 w-28 bg-cyberdark-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-cyberdark-700 last:border-b-0">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 bg-cyberdark-700" />
                  <Skeleton className="h-3 w-56 bg-cyberdark-800" />
                </div>
                <Skeleton className="h-6 w-12 bg-cyberdark-700 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Notifications Card */}
        <Card className="bg-cyberdark-900 border-cyberdark-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-cybergold-400" />
              <Skeleton className="h-6 w-28 bg-cyberdark-700" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 bg-cyberdark-700" />
                  <Skeleton className="h-3 w-40 bg-cyberdark-800" />
                </div>
                <Skeleton className="h-6 w-12 bg-cyberdark-700 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Save button skeleton */}
      <div className="mt-8 flex justify-end space-x-3">
        <Skeleton className="h-10 w-20 bg-cyberdark-700" />
        <Skeleton className="h-10 w-32 bg-cybergold-600/20" />
      </div>
    </div>
  </div>
);

// Main dynamic Settings component
export const DynamicSettings: React.FC = () => {
  return (
    <Suspense fallback={<SettingsLoadingSkeleton />}>
      <Settings />
    </Suspense>
  );
};

export default DynamicSettings;

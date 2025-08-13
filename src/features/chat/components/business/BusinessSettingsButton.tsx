import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BusinessSettings } from './BusinessSettings';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';

/**
 * En knapp som åpner Business-innstillingene i et sidepanel
 */
export const BusinessSettingsButton: React.FC = () => {
  const { user } = useAuth();
  const { businessConfig } = useBusiness(user?.id || null);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          title="Business-innstillinger"
        >
          <Briefcase className="h-5 w-5" />
          {businessConfig.enabled && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Business-innstillinger</SheetTitle>
          <SheetDescription>
            Konfigurer hvordan din business fremstår på Snakkaz
          </SheetDescription>
        </SheetHeader>
        <BusinessSettings userId={user.id} />
      </SheetContent>
    </Sheet>
  );
};
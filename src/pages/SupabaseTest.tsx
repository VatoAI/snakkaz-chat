import React from 'react';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SupabaseTest() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            Tilbake til hovedsiden
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Supabase Tilkobling</h1>
          <p className="text-muted-foreground mt-2">
            Test tilkoblingen til Supabase-prosjektet
          </p>
        </div>
        
        <SupabaseConnectionTest />
      </div>
    </div>
  );
}
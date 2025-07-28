import React from 'react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';

const DesignTest: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">SnakkaZ Design Test</h1>
          <p className="text-gray-400">Testing the new LiquidGlass design system</p>
        </div>

        {/* Glass Cards Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedCard variant="glass" padding="lg">
            <h3 className="text-xl font-bold text-white mb-4">Glass Card</h3>
            <p className="text-gray-300 mb-4">This is a glass morphism card with blur effects.</p>
            <EnhancedButton variant="primary">Primary Button</EnhancedButton>
          </EnhancedCard>

          <EnhancedCard variant="gold" padding="lg">
            <h3 className="text-xl font-bold text-white mb-4">Gold Card</h3>
            <p className="text-gray-300 mb-4">This is a gold accent card with glow effects.</p>
            <EnhancedButton variant="secondary">Secondary Button</EnhancedButton>
          </EnhancedCard>

          <EnhancedCard variant="default" padding="lg">
            <h3 className="text-xl font-bold text-white mb-4">Default Card</h3>
            <p className="text-gray-300 mb-4">This is a default card style.</p>
            <EnhancedButton variant="ghost">Ghost Button</EnhancedButton>
          </EnhancedCard>
        </div>

        {/* Buttons Test */}
        <EnhancedCard variant="glass" padding="lg">
          <h3 className="text-xl font-bold text-white mb-6">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <EnhancedButton variant="primary">Primary</EnhancedButton>
            <EnhancedButton variant="secondary">Secondary</EnhancedButton>
            <EnhancedButton variant="ghost">Ghost</EnhancedButton>
            <EnhancedButton variant="primary" loading>Loading</EnhancedButton>
          </div>
        </EnhancedCard>

        {/* Inputs Test */}
        <EnhancedCard variant="glass" padding="lg">
          <h3 className="text-xl font-bold text-white mb-6">Input Elements</h3>
          <div className="space-y-4">
            <EnhancedInput 
              label="Email" 
              placeholder="din@email.no" 
              type="email"
            />
            <EnhancedInput 
              label="Passord" 
              placeholder="Ditt passord" 
              type="password"
              showPasswordToggle
            />
            <EnhancedInput 
              label="Melding" 
              placeholder="Skriv en melding..." 
              hint="Dette er en hjelpetekst"
            />
          </div>
        </EnhancedCard>

        {/* Background Test */}
        <div style={{
          background: 'var(--glass-moderate)',
          backdropFilter: 'var(--blur-moderate)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h3 className="text-xl font-bold text-white mb-4">Direct CSS Variables Test</h3>
          <p className="text-gray-300">
            This uses CSS variables directly to test if they're working properly.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DesignTest;
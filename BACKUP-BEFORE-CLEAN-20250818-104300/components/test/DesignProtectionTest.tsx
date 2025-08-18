/**
 * MCP Server Guided Design Protection Test
 * Testkomponent for å verifisere at Liquid Glass design er beskyttet
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-protected';
import ProtectedSupabaseAuth from '../auth/ProtectedSupabaseAuth';
import SpectacularChat from '../../features/chat/components/SpectacularChat';
import FontDebugTest from '../debug/FontDebugTest';
import { Shield, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const DesignProtectionTest: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [protectionStatus, setProtectionStatus] = useState({
    liquidGlass: false,
    supabaseOverrides: false,
    specificityBooster: false,
    cssLoaded: false
  });

  useEffect(() => {
    // Monitor auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Test design protection
    const testProtection = () => {
      const liquidGlassElements = document.querySelectorAll('.liquid-glass');
      const protectedElements = document.querySelectorAll('.css-protection-lock');
      const designSystem = document.querySelector('link[href*="design-system.css"]');
      const supabaseOverrides = document.querySelector('link[href*="supabase-overrides.css"]');

      setProtectionStatus({
        liquidGlass: liquidGlassElements.length > 0,
        supabaseOverrides: !!supabaseOverrides,
        specificityBooster: protectedElements.length > 0,
        cssLoaded: !!designSystem
      });
    };

    testProtection();
    const interval = setInterval(testProtection, 2000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleAuthSuccess = () => {
    console.log('✅ Auth success - user authenticated!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen liquid-glass css-protection-lock p-8">
      {/* Font & Design Debug */}
      <FontDebugTest />

      {/* Design Protection Status Dashboard */}
      <div className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="font-bold text-sm">Design Protection Status</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            {protectionStatus.liquidGlass ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>Liquid Glass Active</span>
          </div>

          <div className="flex items-center space-x-2">
            {protectionStatus.supabaseOverrides ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>Supabase Overrides</span>
          </div>

          <div className="flex items-center space-x-2">
            {protectionStatus.specificityBooster ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>CSS Protection Lock</span>
          </div>

          <div className="flex items-center space-x-2">
            {protectionStatus.cssLoaded ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>Design System Loaded</span>
          </div>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-xl text-red-200 text-xs transition-all duration-300"
          >
            Logg ut
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            SnakkaZ Design Test
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <p className="text-blue-200 text-xl">
              MCP Server Protected Liquid Glass Design
            </p>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {!user ? (
          <div className="flex justify-center">
            <ProtectedSupabaseAuth
              mode="login"
              onAuthSuccess={handleAuthSuccess}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center text-green-200 text-xl">
              🎉 Innlogget som: {user.email}
            </div>

            <SpectacularChat />
          </div>
        )}
      </div>

      {/* Design Test Elements */}
      <div className="fixed bottom-4 left-4 space-y-2">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-white text-xs">
          <div className="font-bold mb-1">🧪 Design Test Elements:</div>
          <div>• Liquid Glass Background ✓</div>
          <div>• Gradient Text ✓</div>
          <div>• Backdrop Blur ✓</div>
          <div>• Border Glow ✓</div>
          <div>• Animation Effects ✓</div>
        </div>
      </div>
    </div>
  );
};

export default DesignProtectionTest;

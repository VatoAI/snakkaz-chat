import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';
import { Button } from '@/components/ui/button';
import { UserPlus, Info, Mail, Shield, Lock, Users } from 'lucide-react';

const Login: React.FC = () => {

  return (
    <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Glass Liquid Background Effects */}
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Section with Glass Effect */}
          <div className="flex justify-center mb-8">
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/logos/snakkaz-gold.svg" 
                alt="Snakkaz Logo" 
                className="h-16 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logos/snakkaz-gold.png";
                }}
              />
            </div>
          </div>

          {/* Glass Container for Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Enhanced Login Form with 2FA Support */}
            <EnhancedLoginForm />
            
            {/* Additional Options with Glass Effect */}
            <div className="mt-6 space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-black/30 px-3 py-1 rounded-full text-white/70 backdrop-blur">eller</span>
                </div>
              </div>
              
              <Link to="/register" className="w-full block">
                <button style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <UserPlus size={16} />
                  Opprett ny konto
                </button>
              </Link>
              
              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  Glemt passord?
                </Link>
              </div>
            </div>
          </div>

          {/* Information Cards with Glass Effect */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '20px'
          }}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-green-300">100% Sikker - Vi samler IKKE personlig informasjon</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-xs font-medium text-green-400">
                  ✅ Verifisert
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">End-to-end kryptering for alle meldinger</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-xs font-medium text-blue-400">
                  🔒 Privat
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-sm text-purple-300">Trust-system: Brukere blir verifisert over tid</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-xs font-medium text-purple-400">
                  🏆 Community
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Login;

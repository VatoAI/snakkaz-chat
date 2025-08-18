import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, ArrowLeft, Gift, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedRegisterForm } from '@/components/auth/EnhancedRegisterForm';
import { EnhancedAvatarUpload } from '@/components/profile/EnhancedAvatarUpload';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'register' | 'avatar'>('register');
  
  const inviteCode = searchParams.get('ref');
  const isInvited = Boolean(inviteCode);

  const handleRegistrationSuccess = () => {
    setCurrentStep('avatar');
  };

  const handleAvatarUpload = (avatarUrl: string) => {
    console.log('Avatar uploaded:', avatarUrl);
  };

  const handleSkipAvatar = () => {
    navigate('/beta-chat');
  };

  const handleCompleteSetup = () => {
    navigate('/beta-chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-4xl lg:text-5xl font-bold">
                <Sparkles className="h-8 w-8 text-cybergold-400" />
                <span className="bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                  SnakkaZ
                </span>
                <span className="text-cybergold-300">Beta</span>
              </div>
              
              <h1 className="text-2xl lg:text-3xl text-cybergold-200 font-medium">
                Fremtidens chat-plattform
              </h1>
              
              <p className="text-lg text-cybergold-400 max-w-md mx-auto lg:mx-0">
                Sikker, smart og supersonic kommunikasjon med end-to-end kryptering og AI-assistanse.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-cybergold-300">
                <Shield className="h-5 w-5 text-cybergold-400 flex-shrink-0" />
                <span>End-to-end kryptering for alle meldinger</span>
              </div>
              <div className="flex items-center gap-3 text-cybergold-300">
                <Users className="h-5 w-5 text-cybergold-400 flex-shrink-0" />
                <span>Smart gruppesamtaler med AI-moderering</span>
              </div>
              <div className="flex items-center gap-3 text-cybergold-300">
                <Sparkles className="h-5 w-5 text-cybergold-400 flex-shrink-0" />
                <span>Beta-tilgang til eksklusive funksjoner</span>
              </div>
            </div>

            {/* Invitation Banner */}
            {isInvited && (
              <Alert className="bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 border-cybergold-500/50 max-w-md mx-auto lg:mx-0">
                <Gift className="h-4 w-4 text-cybergold-400" />
                <AlertDescription className="text-cybergold-300">
                  🎉 Du er invitert til SnakkaZ Beta! Referansekode: <strong>{inviteCode}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Back to Home */}
            <div className="flex justify-center lg:justify-start">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cybergold-500/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbake til forsiden
              </Button>
            </div>
          </div>

          {/* Right side - Registration Form */}
          <div className="flex justify-center">
            {currentStep === 'register' ? (
              <div className="w-full max-w-md">
                <EnhancedRegisterForm
                  onSuccess={handleRegistrationSuccess}
                  inviteCode={inviteCode || undefined}
                />
                
                <div className="mt-6 text-center">
                  <p className="text-cybergold-500 text-sm">
                    Har du allerede en konto?{' '}
                    <Link 
                      to="/login" 
                      className="text-cybergold-400 hover:text-cybergold-300 underline"
                    >
                      Logg inn her
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <Card className="bg-cyberdark-900 border-cybergold-500/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-cybergold-400">
                      🎉 Velkommen til SnakkaZ Beta!
                    </CardTitle>
                    <CardDescription className="text-cybergold-300">
                      Siste steg: Last opp et profilbilde
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedAvatarUpload
                      onAvatarChange={handleAvatarUpload}
                    />
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSkipAvatar}
                      className="flex-1 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
                    >
                      Hopp over
                    </Button>
                    <Button
                      onClick={handleCompleteSetup}
                      className="flex-1 bg-cybergold-600 hover:bg-cybergold-500 text-black"
                    >
                      Fullfør
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-cybergold-500 text-sm">
          <p>
            Ved å registrere deg godtar du våre{' '}
            <Link to="/terms" className="text-cybergold-400 hover:text-cybergold-300 underline">
              vilkår og betingelser
            </Link>
            {' '}og{' '}
            <Link to="/privacy" className="text-cybergold-400 hover:text-cybergold-300 underline">
              personvernregler
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

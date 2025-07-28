import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EmailConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');

  const handleEmailConfirmation = async (token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setStatus('success');
        setMessage('E-post bekreftet! Kontoen din er nå aktiv.');
        
        toast({
          title: 'Velkommen til Snakkaz!',
          description: 'E-posten din er bekreftet. Du vil bli videresendt til profilredigering.',
        });

        // Set flag for first-time user
        localStorage.setItem('snakkaz_first_time_user', 'true');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 2000);
      }
    } catch (error) {
      console.error('Email confirmation error:', error);
      setStatus('error');
      setMessage('Kunne ikke bekrefte e-post. Lenken kan være utløpt eller ugyldig.');
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      // Handle email confirmation
      handleEmailConfirmation(token);
    } else if (!token) {
      // User accessed this page without a token - show pending state
      setStatus('pending');
      setMessage('Sjekk e-posten din for bekreftelseslenke');
    }
  }, [searchParams, handleEmailConfirmation]);

  const resendConfirmation = async () => {
    const email = localStorage.getItem('snakkaz_pending_email');
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Ingen e-postadresse funnet',
        description: 'Gå tilbake til registrering for å prøve igjen.',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: 'Bekreftelse sendt på nytt',
        description: 'Sjekk e-posten din for ny bekreftelseslenke.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kunne ikke sende bekreftelse',
        description: 'Prøv igjen senere eller kontakt support.',
      });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-cybergold-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-400" />;
      case 'pending':
        return <Mail className="h-16 w-16 text-cybergold-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-cybergold-400';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyberdark-950 py-8">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/logos/snakkaz-gold.svg" 
            alt="Snakkaz Logo" 
            className="h-16 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/logos/snakkaz-gold.png";
            }}
          />
        </div>
        
        <Card className="border-cybergold-600/20 bg-cyberdark-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className={`text-2xl font-bold ${getStatusColor()}`}>
              {status === 'loading' && 'Bekrefter e-post...'}
              {status === 'success' && 'E-post bekreftet!'}
              {status === 'error' && 'Bekreftelsesfeil'}
              {status === 'pending' && 'Sjekk e-posten din'}
            </CardTitle>
            <CardDescription className="text-cybergold-600">
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {status === 'pending' && (
              <div className="space-y-4">
                <div className="p-4 bg-cyberdark-800/50 border border-cybergold-500/20 rounded-lg">
                  <h3 className="text-cybergold-400 font-medium mb-2">Neste steg:</h3>
                  <ol className="space-y-2 text-sm text-cybergold-300">
                    <li>1. Åpne e-posten din</li>
                    <li>2. Finn e-posten fra Snakkaz</li>
                    <li>3. Klikk på bekreftelseslenken</li>
                    <li>4. Kom tilbake hit for å logge inn</li>
                  </ol>
                </div>
                
                <Button 
                  onClick={resendConfirmation}
                  variant="outline" 
                  className="w-full border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/10"
                >
                  Send bekreftelse på nytt
                </Button>
              </div>
            )}
            
            {status === 'success' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/30 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-300">
                    Du vil automatisk bli videresendt til innlogging om noen sekunder.
                  </p>
                </div>
                
                <Button 
                  onClick={() => navigate('/login?verified=true')}
                  className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                >
                  Gå til innlogging
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-900/30 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-300">
                    Bekreftelseslenken kan være utløpt eller allerede brukt.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={resendConfirmation}
                    variant="outline" 
                    className="w-full border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/10"
                  >
                    Send ny bekreftelse
                  </Button>
                  
                  <Link to="/register">
                    <Button variant="ghost" className="w-full text-cybergold-400 hover:bg-cybergold-600/10">
                      Tilbake til registrering
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-cyberdark-700">
              <Link to="/login">
                <Button variant="ghost" className="w-full text-cybergold-400 hover:bg-cybergold-600/10">
                  Har du allerede en konto? Logg inn
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;

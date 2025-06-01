import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface MathCaptchaProps {
  onVerificationChange: (isValid: boolean, token: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const MathCaptcha: React.FC<MathCaptchaProps> = ({ 
  onVerificationChange, 
  isLoading = false,
  error 
}) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Use ref to avoid dependency issues
  const onVerificationChangeRef = useRef(onVerificationChange);
  onVerificationChangeRef.current = onVerificationChange;

  // Generate new math problem
  const generateNewProblem = useCallback(() => {
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setIsCorrect(false);
    setAttempts(0);
    // Call verification change to reset state
    onVerificationChangeRef.current(false, '');
  }, []);

  // Initialize with first problem only once
  useEffect(() => {
    // Inline problem generation to avoid dependency issues
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setIsCorrect(false);
    setAttempts(0);
    onVerificationChangeRef.current(false, '');
  }, []); // Empty dependency array - only run once on mount

  // Check answer whenever user input changes
  useEffect(() => {
    if (!userAnswer) {
      setIsCorrect(false);
      onVerificationChangeRef.current(false, '');
      return;
    }

    const correct = parseInt(userAnswer) === (num1 + num2);
    setIsCorrect(correct);
    
    if (correct) {
      // Generate a simple token for verification
      const token = btoa(`${num1}-${num2}-${userAnswer}-${Date.now()}`);
      onVerificationChangeRef.current(true, token);
      setAttempts(0);
    } else {
      onVerificationChangeRef.current(false, '');
      
      // Track failed attempts only when user finishes typing
      if (userAnswer.length >= 1) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Lock after 3 failed attempts
        if (newAttempts >= 3) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setAttempts(0);
            // Use a fresh problem generation without dependency issues
            const newNum1 = Math.floor(Math.random() * 10) + 1;
            const newNum2 = Math.floor(Math.random() * 10) + 1;
            setNum1(newNum1);
            setNum2(newNum2);
            setUserAnswer('');
            setIsCorrect(false);
            onVerificationChangeRef.current(false, '');
          }, 30000); // 30 second lockout
        }
      }
    }
  }, [userAnswer, num1, num2, attempts]);

  const handleRefresh = useCallback(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleAnswerChange = (value: string) => {
    if (isLocked) return;
    
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setUserAnswer(numericValue);
  };

  const getStatusColor = () => {
    if (isLocked) return 'text-red-500';
    if (userAnswer && isCorrect) return 'text-green-500';
    if (userAnswer && !isCorrect) return 'text-red-500';
    return 'text-cybergold-500';
  };

  const getStatusText = () => {
    if (isLocked) return '🔒 Låst i 30 sekunder';
    if (userAnswer && isCorrect) return '✓ Riktig!';
    if (userAnswer && !isCorrect) return `✗ Feil (${3 - attempts} forsøk igjen)`;
    return '';
  };

  return (
    <div className="space-y-2">
      <Label className="text-cybergold-300 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Verifisering - Løs regnestykket:
      </Label>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-cybergold-200 font-mono text-lg">
          <span className="bg-cyberdark-800 px-3 py-2 rounded border border-cybergold-500/30">
            {num1}
          </span>
          <span>+</span>
          <span className="bg-cyberdark-800 px-3 py-2 rounded border border-cybergold-500/30">
            {num2}
          </span>
          <span>=</span>
        </div>
        
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="?"
          className={`w-20 text-center bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 ${
            isCorrect ? 'border-green-500' : ''
          } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading || isLocked}
          maxLength={3}
        />
        
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || isLocked}
          className="p-2 text-cybergold-500 hover:text-cybergold-400 transition-colors disabled:opacity-50"
          title="Ny oppgave"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {(userAnswer || isLocked) && (
        <div className={`text-sm ${getStatusColor()} flex items-center gap-1`}>
          {getStatusText()}
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      <div className="text-xs text-cyberdark-400">
        Dette beskytter mot automatiserte angrep
      </div>
    </div>
  );
};

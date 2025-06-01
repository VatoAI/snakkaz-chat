import React, { useState, useEffect } from 'react';
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

  // Generate new math problem
  const generateNewProblem = () => {
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setIsCorrect(false);
    onVerificationChange(false, '');
  };

  // Initialize with first problem
  useEffect(() => {
    generateNewProblem();
  }, []);

  // Check answer whenever user input changes
  useEffect(() => {
    if (userAnswer) {
      const correct = parseInt(userAnswer) === (num1 + num2);
      setIsCorrect(correct);
      
      if (correct) {
        // Generate a simple token for verification
        const token = btoa(`${num1}-${num2}-${userAnswer}-${Date.now()}`);
        onVerificationChange(true, token);
        setAttempts(0);
      } else if (userAnswer.length > 0) {
        onVerificationChange(false, '');
        
        // Track failed attempts
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Lock after 3 failed attempts
        if (newAttempts >= 3) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setAttempts(0);
            generateNewProblem();
          }, 30000); // 30 second lockout
        }
      }
    } else {
      onVerificationChange(false, '');
    }
  }, [userAnswer, num1, num2, attempts, onVerificationChange]);

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
          onClick={generateNewProblem}
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

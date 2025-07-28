import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MathCaptchaProps {
  onVerificationChange: (valid: boolean, token: string | null) => void;
}

export const MathCaptcha: React.FC<MathCaptchaProps> = ({ onVerificationChange }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Generate new math problem
  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsValid(false);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    const correctAnswer = num1 + num2;
    const isCorrect = parseInt(userAnswer) === correctAnswer;
    setIsValid(isCorrect);
    onVerificationChange(isCorrect, isCorrect ? 'math-captcha-valid' : null);
  }, [userAnswer, num1, num2, onVerificationChange]);

  return (
    <div className="space-y-2">
      <Label className="text-cybergold-300">Sikkerhet: Løs regnestykket</Label>
      <div className="flex items-center space-x-2">
        <span className="text-white text-lg font-mono">
          {num1} + {num2} =
        </span>
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-20 bg-cyberdark-800 border-cybergold-500/30 text-white"
          placeholder="?"
        />
        {isValid && <span className="text-green-400">✓</span>}
      </div>
      <button
        type="button"
        onClick={generateProblem}
        className="text-xs text-cybergold-400 hover:text-cybergold-300"
      >
        Nytt regnestykke
      </button>
    </div>
  );
};

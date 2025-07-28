import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  className,
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'snakkaz-input',
            leftIcon && 'pl-10',
            (rightIcon || showPasswordToggle) && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:box-shadow-red',
            className
          )}
          {...props}
        />
        
        {(rightIcon || showPasswordToggle) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
});
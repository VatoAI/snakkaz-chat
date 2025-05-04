import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeaderActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'icon' | 'sm' | 'default';
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable button component for header actions
 */
export function HeaderActionButton({
  icon,
  label,
  onClick,
  variant = 'ghost',
  size = 'icon',
  className,
  disabled = false
}: HeaderActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(
        size === 'icon' ? 'p-2 h-9 w-9' : '',
        className
      )}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {icon}
      {size !== 'icon' && <span className="ml-2">{label}</span>}
    </Button>
  );
}
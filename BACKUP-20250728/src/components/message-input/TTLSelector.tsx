import React, { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TTLOptions, DEFAULT_TTL_OPTIONS } from '@/services/message-ttl-service';

const TTL_PRESETS = [
  { value: 0, label: 'No expiration' },
  { value: 300, label: '5 minutes' },
  { value: 3600, label: '1 hour' },
  { value: 28800, label: '8 hours' },
  { value: 86400, label: '24 hours' },
  { value: 604800, label: '7 days' },
];

interface TTLSelectorProps {
  onSelectTTL: (options: TTLOptions) => void;
  currentTTL: number;
  conversationId?: string;
}

export function TTLSelector({ onSelectTTL, currentTTL, conversationId }: TTLSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ttlOptions, setTTLOptions] = useState<TTLOptions>({
    ...DEFAULT_TTL_OPTIONS,
    expiration: currentTTL || 0,
  });

  const handleSelectTTL = (seconds: number) => {
    const newOptions = {
      ...ttlOptions,
      expiration: seconds,
    };
    setTTLOptions(newOptions);
  };

  const handleApply = () => {
    onSelectTTL(ttlOptions);
    setIsOpen(false);
  };

  // Format time for display in button
  const getTimeDisplay = () => {
    const seconds = ttlOptions.expiration;
    if (seconds === 0) return 'No expiration';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted"
          title="Set message expiration time"
        >
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">{getTimeDisplay()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium">Message Expiration</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Set how long messages will remain before self-destructing
          </p>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-2 gap-2">
            {TTL_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant={ttlOptions.expiration === preset.value ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handleSelectTTL(preset.value)}
              >
                {ttlOptions.expiration === preset.value && (
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                )}
                {preset.label}
              </Button>
            ))}
          </div>
          
          {conversationId && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttlOptions.setAsDefault}
                    onChange={() => setTTLOptions({
                      ...ttlOptions,
                      setAsDefault: !ttlOptions.setAsDefault
                    })}
                    className="h-4 w-4"
                  />
                  <span>Set as default for this conversation</span>
                </label>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttlOptions.applyToConversation}
                    onChange={() => setTTLOptions({
                      ...ttlOptions,
                      applyToConversation: !ttlOptions.applyToConversation
                    })}
                    className="h-4 w-4"
                  />
                  <span>Apply to all messages in conversation</span>
                </label>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

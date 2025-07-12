
import { useEffect, useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PinInputProps {
  onComplete: (value: string) => void;
  length?: number;
  initialValue?: string;
  placeholder?: string;
}

export const PinInput = ({ onComplete, length = 4, initialValue = "", placeholder }: PinInputProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length === length) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={(value) => setValue(value)}
        className="grid-cols-4 gap-2"
        containerClassName="justify-center gap-2"
        ref={inputRef}
      >
        {Array.from({ length }).map((_, i) => (
          <InputOTPGroup key={i} className="w-full">
            <InputOTPSlot
              index={i}
              className="w-14 h-14 text-xl bg-cyberdark-800 border-2 border-cybergold-500/30 text-cybergold-300 focus:border-cybergold-500 transition-all duration-200"
            />
          </InputOTPGroup>
        ))}
      </InputOTP>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Input } from "./input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Komponent for å velge klokkeslett
 */
export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

  // Initialiser timer og minutter fra verdien
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h);
      setMinutes(m);
    } else {
      setHours("09");
      setMinutes("00");
    }
  }, [value]);

  // Håndter endring av timer
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let h = e.target.value;
    
    // Begrens timer til gyldige verdier (0-23)
    if (h.length > 0) {
      const hourValue = parseInt(h);
      if (isNaN(hourValue) || hourValue < 0) {
        h = "00";
      } else if (hourValue > 23) {
        h = "23";
      } else if (h.length === 1) {
        h = `0${h}`;
      }
    }
    
    setHours(h);
    if (h && minutes) {
      onChange(`${h}:${minutes}`);
    }
  };

  // Håndter endring av minutter
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let m = e.target.value;
    
    // Begrens minutter til gyldige verdier (0-59)
    if (m.length > 0) {
      const minValue = parseInt(m);
      if (isNaN(minValue) || minValue < 0) {
        m = "00";
      } else if (minValue > 59) {
        m = "59";
      } else if (m.length === 1) {
        m = `0${m}`;
      }
    }
    
    setMinutes(m);
    if (hours && m) {
      onChange(`${hours}:${m}`);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Input
        type="text"
        value={hours}
        onChange={handleHoursChange}
        disabled={disabled}
        className="w-14 text-center"
        maxLength={2}
      />
      <span className="mx-1">:</span>
      <Input
        type="text"
        value={minutes}
        onChange={handleMinutesChange}
        disabled={disabled}
        className="w-14 text-center"
        maxLength={2}
      />
    </div>
  );
};
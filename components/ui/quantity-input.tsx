'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}

export function QuantityInput({ value, onChange, min = 1, className }: QuantityInputProps) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => {
        const v = e.target.value.replace(/[^0-9]/g, '');
        setDisplay(v);
        const num = parseInt(v);
        if (!isNaN(num) && num >= min) {
          onChange(num);
        }
      }}
      onBlur={() => {
        const num = parseInt(display);
        const final = isNaN(num) || num < min ? min : num;
        onChange(final);
        setDisplay(String(final));
      }}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={className}
    />
  );
}

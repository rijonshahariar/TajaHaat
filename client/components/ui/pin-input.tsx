import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  length?: number;
}

export function PinInput({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  disabled,
  length = 6 
}: PinInputProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numbers and limit to specified length
    const numbersOnly = inputValue.replace(/[^\d]/g, '').slice(0, length);
    onChange(numbersOnly);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    // Allow numbers 0-9
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      return;
    }
    // Allow numpad numbers 0-9
    if (e.keyCode >= 96 && e.keyCode <= 105) {
      return;
    }
    e.preventDefault();
  };

  return (
    <Input
      type="password"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder || 'Enter PIN'}
      className={cn(
        'text-center text-lg tracking-widest',
        focused && 'ring-2 ring-ag-green-500',
        className
      )}
      disabled={disabled}
      maxLength={length}
      autoComplete="off"
    />
  );
}

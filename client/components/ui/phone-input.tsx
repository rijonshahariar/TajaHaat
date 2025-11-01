import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PhoneInput({ value, onChange, placeholder, className, disabled }: PhoneInputProps) {
  const [focused, setFocused] = useState(false);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const cleaned = input.replace(/[^\d]/g, '');
    
    // Keep only 11 digits max, ensure it starts with 01
    if (cleaned.length === 0) return '';
    
    // Format as 01XXXXXXXXX (11 digits)
    if (cleaned.startsWith('01')) {
      return cleaned.slice(0, 11);
    } else if (cleaned.startsWith('1') && cleaned.length <= 10) {
      return '0' + cleaned.slice(0, 10);
    } else if (cleaned.startsWith('0')) {
      return cleaned.slice(0, 11);
    } else {
      return '01' + cleaned.slice(0, 9);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  const displayValue = value || '';

  return (
    <div className="relative">
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder || '01XXX XXXXXX'}
        className={cn(
          'pl-4 pr-4',
          focused && 'ring-2 ring-ag-green-500',
          className
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        maxLength={17} // +880 1XXXXXXXXX = 17 characters
      />
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <span className="text-sm text-gray-500">🇧🇩</span>
      </div>
    </div>
  );
}

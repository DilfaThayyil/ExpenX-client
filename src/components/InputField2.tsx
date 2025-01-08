import React, { ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  placeholder?: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  placeholder,
  error
}) => {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 text-left"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          name={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
            'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          } rounded-md shadow-sm focus:outline-none focus:ring-2`}
        />
        {isPassword && onTogglePassword && (
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
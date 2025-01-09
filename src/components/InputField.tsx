import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  isPassword?: boolean;
  passwordVisible?: boolean;
  onPasswordVisibilityChange?: () => void;
}

const FormInput = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  required = false,
  isPassword = false,
  passwordVisible,
  onPasswordVisibilityChange
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 text-left">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={isPassword ? (passwordVisible ? "text" : "password") : type}
          required={required}
          value={value}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
        {isPassword && onPasswordVisibilityChange && (
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onPasswordVisibilityChange}
          >
            {passwordVisible ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
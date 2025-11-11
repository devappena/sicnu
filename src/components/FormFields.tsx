import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant Input réutilisable avec gestion des erreurs
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

interface FormTextareaProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant Textarea réutilisable avec gestion des erreurs
 */
export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  placeholder,
  rows = 4,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

interface FormSelectProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Composant Select réutilisable avec gestion des erreurs
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  options,
  className = '',
  disabled = false,
  placeholder = 'Sélectionnez une option',
}) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

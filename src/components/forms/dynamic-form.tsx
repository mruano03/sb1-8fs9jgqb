import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FormField } from '@/lib/types';
import SignatureCanvas from 'react-signature-canvas';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
}

export function DynamicForm({ fields, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation) {
      const { min, max, pattern } = field.validation;

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `Value must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `Value must be at most ${max}`;
        }
      }

      if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
        return 'Invalid format';
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (field: FormField, value: any) => {
    setFormData(prev => ({ ...prev, [field.id]: value }));
    
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field.id]: error || '',
    }));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            error={errors[field.id]}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, parseFloat(e.target.value))}
            error={errors[field.id]}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            error={errors[field.id]}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleChange(field, file);
              }
            }}
            error={errors[field.id]}
            accept={field.validation?.allowedTypes?.join(',')}
          />
        );

      case 'signature':
        return (
          <div className="border rounded-md p-2">
            <SignatureCanvas
              canvasProps={{
                className: 'signature-canvas w-full h-40 border rounded-md',
              }}
              onEnd={() => {
                // Handle signature data
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Clear signature
              }}
              className="mt-2"
            >
              Clear
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="mt-1">{renderField(field)}</div>
          {errors[field.id] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
          )}
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
}
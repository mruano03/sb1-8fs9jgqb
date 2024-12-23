import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { FormField } from '@/lib/types';
import { Mountain } from 'lucide-react';

interface FormPreviewProps {
  formData: {
    name: string;
    description: string;
    fields: FormField[];
    settings?: {
      requireAuth?: boolean;
      autoSave?: boolean;
    };
  };
}

export function FormPreview({ formData }: FormPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Form Preview</h2>
        <p className="mt-2 text-gray-600">
          Preview how your form will look to users.
        </p>
      </div>

      <div className="relative">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl transform -rotate-1" />
        
        <Card className="relative bg-white p-8 shadow-xl rounded-2xl">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                {formData.settings?.requireAuth ? 'Authenticated Form' : 'Public Form'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
            <p className="mt-2 text-gray-600">{formData.description}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {formData.fields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === 'select' ? (
                  <select
                    disabled
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    disabled
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <Input
                    type={field.type}
                    disabled
                    className="bg-gray-50"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}

                {field.validation?.pattern && (
                  <p className="text-xs text-gray-500 mt-1">
                    Format: {field.validation.pattern}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              disabled
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Submit
            </Button>
          </div>

          {/* Form Footer */}
          {formData.settings?.autoSave && (
            <p className="mt-4 text-sm text-center text-gray-500">
              Responses are automatically saved as you type
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
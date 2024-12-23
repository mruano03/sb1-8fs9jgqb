import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, Lock } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { motion } from 'framer-motion';
import type { FormField } from '@/lib/types';

interface FormFieldsBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FormFieldsBuilder({ fields, onChange }: FormFieldsBuilderProps) {
  const { status } = useSubscriptionStatus();
  const isPro = status.plan === 'Pro';
  const maxFields = isPro ? -1 : 5;

  const handleAddField = () => {
    if (!isPro && fields.length >= maxFields) {
      return;
    }

    const newField: FormField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false,
      validation: {},
    };

    onChange([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Form Fields</h3>
          {!isPro && (
            <p className="text-sm text-gray-500">
              {fields.length}/{maxFields} fields used
            </p>
          )}
        </div>
        <Button onClick={handleAddField} disabled={!isPro && fields.length >= maxFields}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="cursor-move">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Input
                  value={field.label}
                  onChange={(e) =>
                    handleUpdateField(field.id, { label: e.target.value })
                  }
                  placeholder="Field Label"
                />
                <select
                  value={field.type}
                  onChange={(e) =>
                    handleUpdateField(field.id, { type: e.target.value as any })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  {isPro && (
                    <>
                      <option value="file">File Upload</option>
                      <option value="signature">Digital Signature</option>
                      <option value="phone">Phone Number</option>
                      <option value="url">Website URL</option>
                      <option value="textarea">Long Text</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio Buttons</option>
                    </>
                  )}
                </select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveField(field.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    handleUpdateField(field.id, { required: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Required</span>
              </label>

              {field.type === 'select' && (
                <Input
                  value={field.options?.join(', ') || ''}
                  onChange={(e) =>
                    handleUpdateField(field.id, {
                      options: e.target.value.split(',').map((opt) => opt.trim()),
                    })
                  }
                  placeholder="Options (comma-separated)"
                  className="flex-1"
                />
              )}
            </div>

            {field.type === 'number' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Min Value</label>
                  <Input
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) =>
                      handleUpdateField(field.id, {
                        validation: {
                          ...field.validation,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Max Value</label>
                  <Input
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) =>
                      handleUpdateField(field.id, {
                        validation: {
                          ...field.validation,
                          max: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {!isPro && fields.length >= maxFields && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="h-5 w-5" />
            <h3 className="font-medium">Pro Feature</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Upgrade to Pro to add unlimited fields and access advanced field types
            like file uploads, digital signatures, and custom validation.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade to Pro
          </Button>
        </div>
      )}
    </div>
  );
}
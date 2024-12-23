import { FormFieldsBuilder } from './form-fields-builder';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { FormField } from '@/lib/types';

interface FieldsStepProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function FieldsStep({ fields, onFieldsChange, onBack, onNext }: FieldsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Form Fields</h2>
        <p className="mt-2 text-gray-600">
          Add and configure the fields for your form.
        </p>
      </div>

      <FormFieldsBuilder
        fields={fields}
        onChange={onFieldsChange}
      />

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={fields.length === 0}>
          Preview Form
        </Button>
      </div>
    </motion.div>
  );
}
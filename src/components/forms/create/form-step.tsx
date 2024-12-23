import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const formStepSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  settings: z.object({
    requireAuth: z.boolean().optional(),
    autoSave: z.boolean().optional(),
  }).optional(),
});

type FormStepData = z.infer<typeof formStepSchema>;

interface FormStepProps {
  onNext: (data: FormStepData) => void;
}

export function FormStep({ onNext }: FormStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormStepData>({
    resolver: zodResolver(formStepSchema),
    defaultValues: {
      settings: {
        requireAuth: false,
        autoSave: true,
      },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Form Details</h2>
        <p className="mt-2 text-gray-600">
          Start by providing basic information about your form.
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Form Name
          </label>
          <Input
            id="name"
            {...register('name')}
            className="mt-1"
            placeholder="e.g., Customer Feedback Form"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the purpose of this form..."
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.requireAuth')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Require authentication
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.autoSave')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Auto-save responses
              </span>
            </label>
          </div>
        </div>

        <Button type="submit">Continue to Fields</Button>
      </form>
    </motion.div>
  );
}
import { Input } from '@/components/ui/input';
import { Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

interface BasicFormInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function BasicFormInfo({ register, errors }: BasicFormInfoProps) {
  const { status } = useSubscriptionStatus();
  const isPro = status.plan === 'Pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-2">
        <Mountain className="h-6 w-6 text-blue-600" />
        <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
          Create Form
        </span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Form Details</h2>
        <p className="mt-2 text-lg text-gray-600">
          Create a custom form to collect information from your users.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Form Name
          </label>
          <Input
            id="name"
            {...register('name')}
            className="mt-1"
            placeholder="e.g., Contact Form"
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
            className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe the purpose of this form..."
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Settings
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.requireAuth')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Require authentication</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.autoSave')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Auto-save responses</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
import { Input } from '@/components/ui/input';
import { Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

interface BasicInfoFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function BasicInfoForm({ register, errors }: BasicInfoFormProps) {
  const { status } = useSubscriptionStatus();
  const isPro = status.plan === 'Pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-2 text-blue-600">
        <Mountain className="h-6 w-6" />
        <span className="text-sm font-medium px-2 py-1 bg-blue-50 rounded-full">
          Create Waitlist
        </span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Basic Information</h2>
        <p className="mt-2 text-lg text-gray-600">
          Let's start with the essential details of your waitlist.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Waitlist Name
          </label>
          <Input
            id="name"
            {...register('name')}
            className="w-full"
            placeholder="e.g., Early Access Beta"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe what your waitlist is for..."
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {isPro && (
          <>
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <Input
                id="tagline"
                {...register('tagline')}
                className="w-full"
                placeholder="A short, catchy description"
                error={errors.tagline?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Spots
                </label>
                <Input
                  id="totalSpots"
                  type="number"
                  {...register('totalSpots')}
                  className="w-full"
                  placeholder="Leave empty for unlimited"
                  error={errors.totalSpots?.message}
                />
              </div>

              <div>
                <label htmlFor="launchDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Launch Date
                </label>
                <Input
                  id="launchDate"
                  type="date"
                  {...register('launchDate')}
                  className="w-full"
                  error={errors.launchDate?.message}
                />
              </div>
            </div>

            <div>
              <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Domain (Optional)
              </label>
              <Input
                id="customDomain"
                {...register('customDomain')}
                className="w-full"
                placeholder="waitlist.yourdomain.com"
                error={errors.customDomain?.message}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Settings
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.requireEmail')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Require email verification</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('settings.autoApprove')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Auto-approve entries</span>
            </label>
            {isPro && (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('settings.requireReferral')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable referral system</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('settings.notifyOnJoin')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Send notifications on new joins</span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
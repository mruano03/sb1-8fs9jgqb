import { Card } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Waitlist } from '@/lib/types';

interface WaitlistDetailsProps {
  waitlist: Waitlist;
}

export function WaitlistDetails({ waitlist }: WaitlistDetailsProps) {
  const hasFeatures = waitlist.features?.length > 0;
  const hasBenefits = waitlist.benefits?.length > 0;

  if (!hasFeatures && !hasBenefits) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {hasFeatures && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          <div className="space-y-4">
            {waitlist.features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  {feature.description && (
                    <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {hasBenefits && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>
          <div className="space-y-4">
            {waitlist.benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <Star className="w-3 h-3 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{benefit.title}</p>
                  {benefit.description && (
                    <p className="mt-1 text-sm text-gray-500">{benefit.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
import { motion } from 'framer-motion';
import { Check, Star, Users, Clock, Shield } from 'lucide-react';
import type { WaitlistFeature, WaitlistBenefit } from '@/lib/types';

interface ProductDetailsProps {
  waitlist: {
    name: string;
    tagline?: string;
    description: string;
    features?: WaitlistFeature[];
    benefits?: WaitlistBenefit[];
    pricing?: {
      amount: number;
      currency: string;
      interval: string;
    };
    total_spots?: number;
    launch_date?: string;
  };
}

export function ProductDetails({ waitlist }: ProductDetailsProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            Early Access
          </span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">{waitlist.name}</h2>
        {waitlist.tagline && (
          <p className="mt-2 text-lg text-blue-600">{waitlist.tagline}</p>
        )}
        <p className="mt-4 text-lg text-gray-600">{waitlist.description}</p>

        {waitlist.pricing?.amount > 0 && (
          <div className="mt-6 inline-flex items-baseline gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-3xl font-bold text-blue-600">
              ${waitlist.pricing.amount}
            </span>
            <span className="text-blue-600">/{waitlist.pricing.interval}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {waitlist.total_spots && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>{waitlist.total_spots} spots available</span>
          </div>
        )}
        {waitlist.launch_date && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>Launches {new Date(waitlist.launch_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {waitlist.features && waitlist.features.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul className="space-y-4">
            {waitlist.features.map((feature, index) => (
              <motion.li
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
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {waitlist.benefits && waitlist.benefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Early Access Benefits</h3>
          <ul className="space-y-4">
            {waitlist.benefits.map((benefit, index) => (
              <motion.li
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
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Secure Waitlist</h3>
        </div>
        <p className="text-sm text-gray-600">
          Your information is securely stored and will only be used to contact you about this waitlist.
          You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
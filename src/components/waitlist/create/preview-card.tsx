import { motion } from 'framer-motion';
import { Star, Check, Globe, Twitter, Facebook, Instagram } from 'lucide-react';
import type { WaitlistFeature, WaitlistBenefit, WaitlistPricing } from '@/lib/types';

interface PreviewCardProps {
  formData: {
    name: string;
    tagline?: string;
    description: string;
    totalSpots?: string;
    launchDate?: string;
    customDomain?: string;
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    features?: WaitlistFeature[];
    benefits?: WaitlistBenefit[];
    pricing?: WaitlistPricing;
  };
  imageUrl?: string;
}

export function PreviewCard({ formData, imageUrl }: PreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-8"
    >
      <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl p-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          {imageUrl && (
            <div className="relative w-full h-48">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <img
                src={imageUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">
                    Early Access
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formData.name || 'Your Waitlist Name'}
                </h3>
                {formData.tagline && (
                  <p className="mt-2 text-lg text-gray-600">{formData.tagline}</p>
                )}
                <p className="mt-2 text-gray-600">
                  {formData.description || 'Your waitlist description will appear here...'}
                </p>
              </div>

              {formData.pricing?.amount > 0 && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${formData.pricing.amount}
                  </span>
                  <span className="text-gray-500">
                    /{formData.pricing.interval}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {formData.totalSpots && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {formData.totalSpots} spots available
                  </div>
                )}
                {formData.launchDate && (
                  <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    Launches {new Date(formData.launchDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {formData.features && formData.features.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Key Features
                  </h4>
                  <ul className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <motion.li
                        key={feature.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium">{feature.title}</span>
                          {feature.description && (
                            <p className="text-sm text-gray-500">{feature.description}</p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.benefits && formData.benefits.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Early Access Benefits
                  </h4>
                  <ul className="space-y-3">
                    {formData.benefits.map((benefit, index) => (
                      <motion.li
                        key={benefit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                          <Star className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <span className="font-medium">{benefit.title}</span>
                          {benefit.description && (
                            <p className="text-sm text-gray-500">{benefit.description}</p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {(formData.customDomain || formData.socialLinks) && (
                <div className="border-t pt-6">
                  <div className="flex flex-wrap gap-4">
                    {formData.customDomain && (
                      <a href={`https://${formData.customDomain}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Globe className="h-4 w-4" />
                        {formData.customDomain}
                      </a>
                    )}
                    {formData.socialLinks?.twitter && (
                      <a href={formData.socialLinks.twitter} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </a>
                    )}
                    {formData.socialLinks?.facebook && (
                      <a href={formData.socialLinks.facebook} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                    {formData.socialLinks?.instagram && (
                      <a href={formData.socialLinks.instagram} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
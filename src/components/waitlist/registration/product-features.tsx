import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ProductFeaturesProps {
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
  const getIcon = (iconName: string): LucideIcon => {
    return (Icons as Record<string, LucideIcon>)[iconName] || Icons.Circle;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
      {features.map((feature, index) => {
        const Icon = getIcon(feature.icon);
        return (
          <motion.div
            key={`${feature.title}-${index}`} // Using both title and index for uniqueness
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-gray-500">
                {feature.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
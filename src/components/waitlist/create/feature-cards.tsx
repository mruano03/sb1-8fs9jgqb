import { motion } from 'framer-motion';
import { Star, Zap, Users, Bell } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Early Access',
    description: 'Give your users priority access to your product',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Keep users informed about launch progress',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Build excitement and gather feedback early',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Automated updates for your waitlist members',
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
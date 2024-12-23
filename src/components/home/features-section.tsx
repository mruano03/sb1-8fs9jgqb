import { ClipboardList, BarChart3, Bell, Zap } from 'lucide-react';

const features = [
  {
    name: 'Easy List Management',
    description: 'Create and manage multiple waitlists with custom fields and automated sorting.',
    icon: ClipboardList,
  },
  {
    name: 'Real-time Analytics',
    description: 'Track signups, conversion rates, and engagement metrics in real-time.',
    icon: BarChart3,
  },
  {
    name: 'Smart Notifications',
    description: 'Automated email notifications for list updates and position changes.',
    icon: Bell,
  },
  {
    name: 'Quick Integration',
    description: 'Seamlessly integrate with your existing tools and workflows.',
    icon: Zap,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Powerful Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your waitlists
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools you need to create, manage, and analyze your waitlists effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
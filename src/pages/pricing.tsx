import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 waitlists',
      '100 entries per waitlist',
      'Basic analytics',
      'Email notifications',
      'Standard support',
    ],
    limitations: [
      'No priority management',
      'No custom branding',
      'Limited analytics',
    ],
  },
  {
    name: 'Pro',
    price: '20',
    description: 'Best for growing businesses',
    features: [
      'Unlimited waitlists',
      '1,000 entries per waitlist',
      'Advanced analytics',
      'Priority management',
      'Custom branding',
      'Priority support',
      'Custom fields',
      'Export data',
    ],
    popular: true,
  },
];

export function PricingPage() {
  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that best fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative p-8 ${
                tier.popular
                  ? 'border-2 border-blue-500 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-gray-500">{tier.description}</p>
              </div>

              <div className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
                {tier.limitations?.map((limitation) => (
                  <div key={limitation} className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">{limitation}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant={tier.popular ? 'default' : 'outline'}
                  className="w-full"
                  to={tier.name === 'Free' ? '/register' : '/payment'}
                >
                  {tier.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Can I upgrade or downgrade?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept PayPal for all our subscription plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
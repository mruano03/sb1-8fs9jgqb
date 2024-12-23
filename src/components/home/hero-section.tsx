import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, ArrowRight, Globe, Check } from 'lucide-react';

export function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard/waitlists/new');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-100/20 via-white to-white" />
      
      {/* Hero content */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-32 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-8 justify-center lg:justify-start"
            >
              <Mountain className="h-6 w-6 text-blue-600" />
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                Launching Soon
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Create Beautiful Waitlists in Minutes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Build excitement and manage signups for your next product launch. Powerful features, beautiful design, and seamless integration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex items-center gap-x-6 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                to="/docs"
              >
                Learn more
              </Button>
            </motion.div>
          </div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl transform rotate-2" />
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Mountain className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">WaitlistPro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe className="h-4 w-4" />
                  <span>waitlist.example.com</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Early Access Beta</h3>
                  <p className="mt-2 text-gray-600">Join our exclusive beta program and be among the first to experience our revolutionary product.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    100 spots available
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    Launches Dec 1st
                  </span>
                </div>

                <div className="space-y-3">
                  {['Priority access to new features', 'Exclusive beta pricing', 'Direct feedback channel'].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Waitlist Progress</span>
                    <span>65% Full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: 'Active Waitlists', value: '10K+' },
            { label: 'Users Managed', value: '2M+' },
            { label: 'Customer Satisfaction', value: '99%' },
            { label: 'Time Saved', value: '40hrs/mo' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-y-2">
              <dt className="text-sm leading-6 text-gray-600">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
            </div>
          ))}
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div style={{ position: 'relative', boxSizing: 'content-box', maxWidth: '100%', width: '100%', aspectRatio: '1.65625', padding: '21px 0' }}>
            <iframe 
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}
              src="https://productdemo.app/embed/077187a7-cda5-43f2-b216-d735c03b9797"
              title="Product Demo"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
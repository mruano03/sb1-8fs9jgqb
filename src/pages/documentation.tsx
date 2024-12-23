import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Users,
  Settings,
  Bell,
  BarChart2,
  Shield,
  Zap,
  Mail,
  CheckCircle,
  Clock,
} from 'lucide-react';

export function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            How WaitlistPro Works
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            A comprehensive guide to managing your waitlists effectively
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Create a Waitlist</h3>
              <p className="text-gray-600">
                Set up your waitlist with custom fields, capacity limits, and launch dates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Customize Settings</h3>
              <p className="text-gray-600">
                Configure notifications, priority rules, and automation preferences.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Share & Monitor</h3>
              <p className="text-gray-600">
                Share your waitlist link and track signups in real-time.
              </p>
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <BarChart2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Real-time Analytics</h3>
              </div>
              <p className="text-gray-600">
                Track signups, conversion rates, and engagement metrics in real-time. Make
                data-driven decisions with comprehensive analytics dashboards.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">Priority Management</h3>
              </div>
              <p className="text-gray-600">
                Set up VIP access, referral programs, and custom priority rules to manage
                your waitlist effectively.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold">Automated Workflows</h3>
              </div>
              <p className="text-gray-600">
                Automate notifications, reminders, and status updates. Save time with
                smart automation rules.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Communication Tools</h3>
              </div>
              <p className="text-gray-600">
                Send personalized emails, notifications, and updates to your waitlist
                members automatically.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-4">1. Set Up Your Waitlist</h3>
                <p className="text-gray-600 mb-4">
                  Create a customized waitlist for your product or service. Configure
                  capacity limits, custom fields, and branding options to match your needs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Customize registration forms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Set capacity limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Brand your waitlist page</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                  alt="Setup"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 order-2 md:order-1">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Management"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1 order-1 md:order-2">
                <h3 className="text-2xl font-semibold mb-4">2. Manage Entries</h3>
                <p className="text-gray-600 mb-4">
                  Efficiently manage waitlist entries with our powerful tools. Approve or
                  reject entries, set priority levels, and manage communication all in one
                  place.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Real-time entry management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Priority queue system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Automated notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your first waitlist in minutes and start managing signups effectively.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" to="/register">
              Create Account
            </Button>
            <Button variant="outline" size="lg" to="/contact">
              Contact Sales
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
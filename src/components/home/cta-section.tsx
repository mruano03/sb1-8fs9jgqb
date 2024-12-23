import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <div className="bg-blue-600">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your waitlist management?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Start managing your waitlists effectively today. No credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              to="/register"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Get started for free
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-blue-500"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
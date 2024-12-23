import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  email: string;
  className?: string;
}

export function SuccessMessage({ email, className }: SuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg bg-blue-50 p-8 text-center max-w-md mx-auto",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <CheckCircle className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">
        Check your email
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        We've sent a magic link to <span className="font-medium">{email}</span>. Click the
        link to sign in to your account.
      </p>
      <p className="mt-4 text-xs text-gray-500">
        Didn't receive the email? Check your spam folder or{' '}
        <button className="font-medium text-blue-600 hover:text-blue-500">
          try another method
        </button>
      </p>
    </motion.div>
  );
}
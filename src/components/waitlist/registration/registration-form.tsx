import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SuccessMessage } from './success-message';
import { waitlistEntryService } from '@/lib/services/waitlist/entry-service';
import { Mountain, Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'Please enter your first name'),
  lastName: z.string().min(2, 'Please enter your last name'),
  email: z.string().email('Please enter a valid email'),
});

type FormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  waitlistId: string;
  waitlistName: string;
}

export function RegistrationForm({ waitlistId, waitlistName }: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      
      await waitlistEntryService.create(waitlistId, {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
      });
      
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to join waitlist. Please try again.');
    }
  };

  if (isSubmitted) {
    return <SuccessMessage email={submittedEmail} />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Mountain className="h-6 w-6" />
          <span className="text-sm font-medium px-2 py-1 bg-blue-50 rounded-full">
            Join Waitlist
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Get early access!
        </h1>
        <p className="text-lg text-gray-600">
          Join the waitlist for {waitlistName} and be one of the first to get access.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <Input
              id="firstName"
              {...register('firstName')}
              className="w-full"
              placeholder="First name"
              error={errors.firstName?.message}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <Input
              id="lastName"
              {...register('lastName')}
              className="w-full"
              placeholder="Last name"
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="w-full"
            placeholder="Enter your email"
            error={errors.email?.message}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </form>
    </div>
  );
}
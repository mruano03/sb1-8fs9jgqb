import { Button } from '@/components/ui/button';
import { googleAuth } from '@/lib/services/auth/google-auth';
import { Chrome } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function GoogleLogin() {
  const location = useLocation();
  const isSignUp = location.pathname === '/register';

  const handleGoogleLogin = async () => {
    try {
      await googleAuth.signIn();
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full"
    >
      <Chrome className="h-5 w-5 mr-2" />
      Continue with Google {isSignUp ? 'Sign Up' : 'Sign In'}
    </Button>
  );
}
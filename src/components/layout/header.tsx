import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { MobileMenu } from './mobile-menu';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" to="/" className="text-xl font-bold p-0">
            WaitlistPro
          </Button>
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" to="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Button>
            <Button variant="ghost" to="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Button>
            <Button variant="ghost" to="/docs" className="text-gray-600 hover:text-gray-900">
              Documentation
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button to="/dashboard">Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button to="/register">Sign up</Button>
              </>
            )}
          </div>
          <MobileMenu isAuthenticated={!!user} />
        </div>
      </div>
    </header>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isAuthenticated?: boolean;
}

export function MobileMenu({ isAuthenticated }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={toggleMenu} aria-label="Toggle menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          'fixed inset-0 z-50 bg-gray-900/80 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white px-6 py-6 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
            WaitlistPro
          </Link>
          <Button variant="ghost" size="sm" onClick={closeMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link
            to="/features"
            className="text-gray-600 hover:text-gray-900 py-2"
            onClick={closeMenu}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 hover:text-gray-900 py-2"
            onClick={closeMenu}
          >
            Pricing
          </Link>
          <Link
            to="/docs"
            className="text-gray-600 hover:text-gray-900 py-2"
            onClick={closeMenu}
          >
            Documentation
          </Link>

          <div className="pt-4 border-t">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
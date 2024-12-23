import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  CreditCard,
  Bell,
  Shield,
  Star,
  Mountain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { useProfile } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { status } = useSubscriptionStatus();
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  const menuItems = [
    {
      type: 'profile',
      content: (
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Profile'}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {user.email}
              </p>
            </div>
          </div>
          {status.plan && (
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-xs font-medium text-gray-600">
                {status.plan} Plan
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      type: 'links',
      items: [
        {
          icon: Settings,
          label: 'Account Settings',
          to: '/dashboard/settings',
        },
        {
          icon: Bell,
          label: 'Notifications',
          to: '/dashboard/notifications',
        },
        {
          icon: CreditCard,
          label: 'Billing & Plans',
          to: '/dashboard/subscription',
        },
        {
          icon: Shield,
          label: 'Security',
          to: '/dashboard/security',
        },
      ],
    },
    {
      type: 'links',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          to: '/docs',
        },
      ],
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Mountain className="h-4 w-4 text-blue-600" />
            </div>
          )}
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {menuItems.map((section, index) => (
                <div key={index}>
                  {section.type === 'profile' ? (
                    section.content
                  ) : (
                    <div className="p-2 border-b last:border-0">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.to}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="h-4 w-4 text-gray-500" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="p-2 border-t">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
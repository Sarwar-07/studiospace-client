'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, LogOut, LayoutDashboard, Bookmark, PlusCircle, Compass } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      setIsDropdownOpen(false);
    } catch {
      toast.error('Failed to log out. Try again.');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Studios', href: '/studios' },
  ];

  const authLinks = [
    { name: 'Add Studio', href: '/studios/add', icon: PlusCircle },
    { name: 'My Listings', href: '/dashboard/my-listings', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/my-bookings', icon: Compass },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 hover:opacity-90 transition-opacity">
            <Image
              src="/studio-space-logo.png"
              alt="StudioSpace Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded-md"
              priority
            />
            <span>Studio<span className="text-indigo-600 dark:text-indigo-400">Space</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Auth Profile */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:ring-2 hover:ring-indigo-500 transition"
                  aria-label="User menu"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=6366f1&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">
                        {user.displayName || 'Creator'}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Analytics
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.name}
            </Link>
          ))}

          {user && authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { User, Image as ImageIcon, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('redirect') || searchParams.get('from') || '/';
  const { user, createUser, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    photoURL: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated (e.g. returning from signInWithRedirect), route to target destination
  useEffect(() => {
    if (user) {
      router.push(from);
    }
  }, [user, from, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (pass) => {
    if (pass.length < 6) return 'Password must be at least 6 characters.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(formData.email, formData.password);
      await updateUserProfile(formData.name, formData.photoURL);
      toast.success('Registration successful! Welcome to StudioSpace.');
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error('Registration failed:', {
        code: err?.code,
        message: err?.message,
        customData: err?.customData,
        response: err?.customData?._tokenResponse,
        error: err
      });
      toast.error(err.message?.replace('Firebase: ', '') || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // Must execute immediately to preserve the physical browser click gesture
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Issue JWT and sync session with backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/jwt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || '',
          photoURL: user.photoURL || '',
        }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.token && typeof window !== 'undefined') {
          localStorage.setItem('access-token', data.token);
        }
      }

      toast.success('Signed in successfully!');
      router.push(from || '/');
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      if (error?.code === 'auth/popup-blocked') {
        toast.error('Pop-up blocked by browser. Please enable pop-ups in your address bar.');
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        toast.error(error?.message || 'Authentication failed');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-500/5">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/studio-space-logo.png"
              alt="StudioSpace Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create an Account</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Join our community of hosts and creative producers
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleGoogleSignIn();
          }}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition font-medium text-zinc-700 dark:text-zinc-200 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign up with Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
          <span className="px-3 text-xs uppercase tracking-wider text-zinc-400">or registration form</span>
          <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Turner"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@studio.io"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 chars, uppercase & lowercase"
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-md shadow-indigo-600/20 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-sm text-zinc-500">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

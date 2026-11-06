'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Star,
  Users,
  Shield,
  Calendar,
  DollarSign,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudioDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState(10); // 10 AM default
  const [endTime, setEndTime] = useState(14); // 2 PM default
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function loadStudio() {
      try {
        const res = await fetch(`${API_URL}/api/studios/${id}`);
        if (res.status === 404) {
          setStudio(null);
          return;
        }
        if (!res.ok) throw new Error('Studio not found');
        const data = await res.json();
        setStudio(data);
      } catch (err) {
        console.error('Error loading studio:', err);
        setStudio(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadStudio();
    }
  }, [id, API_URL]);

  // Check initial wishlist state for authenticated user
  useEffect(() => {
    async function checkWishlist() {
      if (!user || !id) return;
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
        const res = await fetch(`${API_URL}/api/wishlist`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include'
        });
        if (res.ok) {
          const list = await res.json();
          const exists = list.some((item) => item.studioId === id || item.studio?._id === id);
          setIsWishlisted(exists);
        }
      } catch (err) {
        console.warn('Could not check wishlist status:', err);
      }
    }
    checkWishlist();
  }, [user, id, API_URL]);

  // Wishlist Toggle
  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to save studios to your wishlist');
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }

    setWishlistLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      if (!isWishlisted) {
        const res = await fetch(`${API_URL}/api/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ studioId: id }),
          credentials: 'include'
        });

        if (res.status === 409) {
          setIsWishlisted(true);
          toast.info('Already in your wishlist');
        } else if (res.ok) {
          setIsWishlisted(true);
          toast.success('Saved to your wishlist!');
        } else {
          toast.error('Could not save studio');
        }
      } else {
        const res = await fetch(`${API_URL}/api/wishlist/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include'
        });

        if (res.ok) {
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        }
      }
    } catch {
      toast.error('Failed to update wishlist state');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Duration & Pricing Calculation
  const totalHours = Math.max(0, endTime - startTime);
  const hourlyRate = studio?.hourlyRate || 0;
  const totalPrice = totalHours * hourlyRate;

  // Booking Submit with Collision Handling
  const handleBooking = async (e) => {
    e.preventDefault();
    setConflictError('');

    if (!user) {
      toast.error('Please sign in to book this studio space');
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be later than start time.');
      return;
    }

    setBookingSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          studioId: id,
          bookingDate,
          startTime,
          endTime,
          hourlyRate,
          studioTitle: studio.title,
          studioImage: studio.images?.[0] || studio.image || ''
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.status === 409) {
        setConflictError(data.message || 'Double Booking Conflict: This time slot is already booked.');
        toast.error('Time slot collision! Please choose an alternative hour.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Booking reservation could not be completed.');
      }

      toast.success('Reservation submitted successfully!');
      router.push('/dashboard/my-bookings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Loading studio specifications...</p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">Studio Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">The requested studio workspace listing may have been unlisted by the host.</p>
        <Link href="/studios" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
          Browse All Studios
        </Link>
      </div>
    );
  }

  const images = studio.images?.length > 0 ? studio.images : [studio.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
              isWishlisted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
          </button>
        </div>
      </div>

      {/* Title & Location Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {studio.category}
          </span>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{Number(studio.rating || 5).toFixed(1)}</span>
            <span className="text-neutral-400 font-normal">({studio.reviewsCount || 0} reviews)</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
          {studio.title}
        </h1>
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm mt-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <span>{studio.location}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 rounded-3xl overflow-hidden">
        <div className="md:col-span-2 aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={images[0]}
            alt={studio.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex-1 aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
            <img
              src={images[1] || images[0]}
              alt={studio.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
            <img
              src={images[2] || images[0]}
              alt={studio.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Specifications, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">About this Workspace</h2>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {studio.description || 'Dedicated creative production workspace fully prepared for photography, sound tracking, commercial shoots, and private rehearsals.'}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Max Capacity</span>
              <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mt-1">
                <Users className="w-4 h-4 text-indigo-500" /> Up to {studio.maxCapacity || 10}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Security Deposit</span>
              <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mt-1">
                <Shield className="w-4 h-4 text-indigo-500" /> ${studio.securityDeposit || 0}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Hourly Base</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mt-1">
                <DollarSign className="w-4 h-4" /> ${studio.hourlyRate}/hr
              </span>
            </div>
          </div>

          {/* Included Amenities */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Included Amenities & Gear</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(studio.amenities || [
                'High-Speed Wi-Fi',
                'Sound Dampening',
                'Continuous LED Softboxes',
                'Power Extension Rigs',
                'Lounge & Green Room',
                'Freight Elevator Access'
              ]).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Double-Booking Prevention Reservation Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-500/5">
            <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">${studio.hourlyRate}</span>
                <span className="text-xs text-neutral-500 ml-1">/ hour</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                Instant Confirmation
              </span>
            </div>

            {/* Collision Error Notice */}
            {conflictError && (
              <div className="mb-5 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{conflictError}</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      setConflictError('');
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(parseInt(e.target.value));
                      setConflictError('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h) => (
                      <option key={h} value={h}>{formatHour(h)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(parseInt(e.target.value));
                      setConflictError('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((h) => (
                      <option key={h} value={h}>{formatHour(h)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>${studio.hourlyRate} × {totalHours} hour(s)</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">${studio.securityDeposit || 0}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-sm text-neutral-900 dark:text-neutral-50">
                  <span>Total Amount</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${totalPrice + (studio.securityDeposit || 0)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingSubmitting || totalHours <= 0 || !bookingDate}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookingSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying slot availability...
                  </>
                ) : (
                  'Confirm & Reserve Space'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

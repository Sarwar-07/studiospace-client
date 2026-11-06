'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  CheckSquare,
  FileText,
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Photo Studio',
  'Recording Booth',
  'Film Stage',
  'Podcast Suite',
  'Art Loft'
];

const AVAILABLE_AMENITIES = [
  'High-Speed Wi-Fi',
  'Acoustic Soundproofing',
  'Continuous LED Softboxes',
  'C-Stands & Sandbags',
  'Air Conditioning',
  'Freight Elevator',
  'Private Restroom',
  'Makeup & Dressing Vanity',
  'Lounge & Green Room'
];

export default function EditStudioPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Photo Studio',
    location: '',
    hourlyRate: '',
    securityDeposit: '',
    maxCapacity: '',
    description: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    amenities: []
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to edit your studio listing');
      router.push(`/login?redirect=${encodeURIComponent(`/studios/edit/${id}`)}`);
      return;
    }

    async function loadStudio() {
      try {
        const res = await fetch(`${API_URL}/api/studios/${id}`);
        if (!res.ok) throw new Error('Studio not found');
        const data = await res.json();

        const images = data.images || (data.image ? [data.image] : []);
        setFormData({
          title: data.title || '',
          category: data.category || 'Photo Studio',
          location: data.location || '',
          hourlyRate: data.hourlyRate || '',
          securityDeposit: data.securityDeposit || 0,
          maxCapacity: data.maxCapacity || '',
          description: data.description || '',
          imageUrl1: images[0] || '',
          imageUrl2: images[1] || '',
          imageUrl3: images[2] || '',
          amenities: data.amenities || []
        });
      } catch (err) {
        console.error(err);
        toast.error('Unable to retrieve studio specifications');
      } finally {
        setLoading(false);
      }
    }

    if (id && user) {
      loadStudio();
    }
  }, [id, user, authLoading, router, API_URL]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const images = [formData.imageUrl1, formData.imageUrl2, formData.imageUrl3].filter(Boolean);

    const payload = {
      title: formData.title,
      category: formData.category,
      location: formData.location,
      hourlyRate: parseFloat(formData.hourlyRate),
      securityDeposit: parseFloat(formData.securityDeposit || 0),
      maxCapacity: parseInt(formData.maxCapacity),
      description: formData.description,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'],
      amenities: formData.amenities
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      const res = await fetch(`${API_URL}/api/studios/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update studio listing');
      }

      toast.success('Studio listing updated successfully!');
      router.push('/dashboard/my-listings');
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Loading studio specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/my-listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Listings
        </Link>
      </div>

      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Listing Editor
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
          Edit Studio Workspace
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Update hourly rates, space specifications, and amenities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Core Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" /> Basic Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Studio Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Production Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
              Full Physical Location / Address *
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" /> Rates & Capacity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Hourly Rate ($) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                required
                min="10"
                step="0.01"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Security Deposit ($)
              </label>
              <input
                type="number"
                name="securityDeposit"
                min="0"
                step="0.01"
                value={formData.securityDeposit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Max Occupancy *
              </label>
              <input
                type="number"
                name="maxCapacity"
                required
                min="1"
                value={formData.maxCapacity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Media Imagery */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" /> Space Photography URLs
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Primary Showcase Photo URL *
              </label>
              <input
                type="url"
                name="imageUrl1"
                required
                value={formData.imageUrl1}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Secondary Photo URL
              </label>
              <input
                type="url"
                name="imageUrl2"
                value={formData.imageUrl2}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Tertiary Photo URL
              </label>
              <input
                type="url"
                name="imageUrl3"
                value={formData.imageUrl3}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Space Description & Rules
          </h2>

          <textarea
            rows={5}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Included Amenities Checkbox Grid */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" /> Included Gear & Amenities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_AMENITIES.map((amenity) => {
              const checked = formData.amenities.includes(amenity);
              return (
                <label
                  key={amenity}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                    checked
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-medium'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs">{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/my-listings"
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

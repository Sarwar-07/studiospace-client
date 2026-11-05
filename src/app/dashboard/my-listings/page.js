'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Users,
  Loader2,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Photo Studio',
  'Recording Booth',
  'Film Stage',
  'Podcast Suite',
  'Art Loft'
];

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingStudio, setEditingStudio] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    location: '',
    hourlyRate: '',
    securityDeposit: '',
    maxCapacity: '',
    description: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchMyListings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/my-listings`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to load listings');
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load your studio listings');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/dashboard/my-listings');
      return;
    }
    if (user) {
      fetchMyListings();
    }
  }, [user, authLoading, router, fetchMyListings]);

  // Open Edit Modal
  const handleOpenEdit = (studio) => {
    setEditingStudio(studio);
    setEditFormData({
      title: studio.title || '',
      category: studio.category || 'Photo Studio',
      location: studio.location || '',
      hourlyRate: studio.hourlyRate || '',
      securityDeposit: studio.securityDeposit || 0,
      maxCapacity: studio.maxCapacity || '',
      description: studio.description || ''
    });
  };

  // Submit Update
  const handleUpdateListing = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await fetch(`${API_URL}/api/studios/${editingStudio._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update studio');
      }

      toast.success('Listing updated successfully!');
      setEditingStudio(null);
      fetchMyListings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Listing
  const handleDeleteListing = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/studios/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete listing');
      }

      toast.success('Studio listing deleted.');
      setListings((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Retrieving your workspace listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Host Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
            My Studio Listings
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your registered production stages, pricing tiers, and space availability
          </p>
        </div>

        <Link
          href="/studios/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Studio
        </Link>
      </div>

      {/* Listings Table / Cards */}
      {listings.length > 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-4 px-6">Space Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Rate</th>
                  <th className="py-4 px-6">Capacity</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {listings.map((studio) => {
                  const displayImg = studio.images?.[0] || studio.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80';
                  return (
                    <tr key={studio._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={displayImg}
                            alt={studio.title}
                            className="w-16 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                              {studio.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-xs">{studio.location}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          {studio.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-neutral-900 dark:text-neutral-100">
                        ${studio.hourlyRate}/hr
                      </td>
                      <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400">
                        {studio.maxCapacity} persons
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/studios/${studio._id}`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(studio)}
                            className="p-2 rounded-lg text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(studio._id, studio.title)}
                            disabled={deletingId === studio._id}
                            className="p-2 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-50"
                            title="Delete Listing"
                          >
                            {deletingId === studio._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            No studio spaces listed yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            You haven&apos;t published any workspaces. Monetize your sound booth, photo floor, or set today.
          </p>
          <Link
            href="/studios/add"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" /> Create Your First Listing
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      {editingStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" /> Edit Studio Listing
              </h2>
              <button
                onClick={() => setEditingStudio(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={editFormData.hourlyRate}
                    onChange={(e) => setEditFormData({ ...editFormData, hourlyRate: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Deposit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.securityDeposit}
                    onChange={(e) => setEditFormData({ ...editFormData, securityDeposit: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    required
                    value={editFormData.maxCapacity}
                    onChange={(e) => setEditFormData({ ...editFormData, maxCapacity: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStudio(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
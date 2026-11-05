'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Clock,
  Download,
  Ban,
  Building2,
  CheckCircle,
  AlertCircle,
  Clock4,
  Loader2,
  DollarSign
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/my-bookings`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to retrieve bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load your reservations');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/dashboard/my-bookings');
      return;
    }
    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router, fetchBookings]);

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this studio reservation?')) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: 'PATCH',
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cancellation failed');

      toast.success('Reservation cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  // Generate PDF Invoice / Reservation Slip
  const generateInvoicePDF = (booking) => {
    try {
      const doc = new jsPDF();

      // Brand Header
      doc.setFillColor(79, 70, 229); // Indigo #4F46E5
      doc.rect(0, 0, 210, 36, 'F');

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('StudioSpace Marketplace', 14, 22);

      doc.setFontSize(10);
      doc.text('Official Booking Confirmation & Receipt', 14, 29);

      // Meta Information
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.text(`Booking Reference ID: ${booking._id}`, 14, 48);
      doc.text(`Reserved By: ${booking.userEmail}`, 14, 55);
      doc.text(`Issued Date: ${new Date().toLocaleDateString()}`, 14, 62);
      doc.text(`Status: ${booking.status.toUpperCase()}`, 14, 69);

      // Invoice Table
      autoTable(doc, {
        startY: 76,
        head: [['Item Description', 'Date', 'Time Slot', 'Duration', 'Hourly Rate', 'Total']],
        body: [
          [
            booking.studioTitle || 'Creative Workspace',
            booking.bookingDate,
            `${formatHour(booking.startTime)} - ${formatHour(booking.endTime)}`,
            `${booking.totalHours} hr(s)`,
            `$${booking.hourlyRate}`,
            `$${booking.totalPrice}`
          ]
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 }
      });

      const finalY = doc.lastAutoTable.finalY + 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Amount Paid / Due: $${booking.totalPrice}`, 14, finalY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Thank you for booking with StudioSpace.', 14, finalY + 12);
      doc.text('Present this receipt to the studio host upon entry.', 14, finalY + 18);

      doc.save(`StudioSpace_Receipt_${booking._id.slice(-6)}.pdf`);
      toast.success('Invoice receipt downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Could not generate PDF receipt.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock4 className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm text-neutral-500">Retrieving your studio bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Creator Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
            My Studio Reservations
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Track booked production slots, download invoices, and manage schedules
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          Book Another Studio
        </Link>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-4 px-6">Studio Workspace</th>
                  <th className="py-4 px-6">Reservation Schedule</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:border-neutral-800">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.studioImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80'}
                          alt={booking.studioTitle}
                          className="w-16 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                            {booking.studioTitle}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            ID: {booking._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{booking.bookingDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{formatHour(booking.startTime)} - {formatHour(booking.endTime)} ({booking.totalHours} hrs)</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                          ${booking.totalPrice}
                        </span>
                        <p className="text-xs text-neutral-400">
                          ${booking.hourlyRate}/hr
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(booking.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download Receipt */}
                        <button
                          onClick={() => generateInvoicePDF(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Invoice</span>
                        </button>

                        {/* Cancel Button */}
                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition disabled:opacity-50"
                            title="Cancel Booking"
                          >
                            {cancellingId === booking._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Ban className="w-3.5 h-3.5" />
                            )}
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            No studio bookings found
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            You don&apos;t have any active or past studio space reservations. Explore available rooms and stages.
          </p>
          <Link
            href="/studios"
            className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition"
          >
            Find a Studio Space
          </Link>
        </div>
      )}
    </div>
  );
}
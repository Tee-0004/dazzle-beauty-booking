import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllBookings,
  cancelBooking,
} from '../services/api.js';

function MyReservations() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  // Load reservations from the Express backend.
  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllBookings();

      // The API returns an object containing a bookings array.
      setReservations(
        (data.bookings || []).map((booking) => ({
          ...booking,
          // The backend uses lowercase "confirmed".
          status: booking.status?.toLowerCase() || 'confirmed',
        }))
      );
    } catch (err) {
      setError(err.message || 'Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reservations when this page first opens.
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleBookAppointment = () => {
    navigate('/booking');
  };

  // Cancel the booking on the backend before updating the page.
  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) return;

    setCancellingId(bookingId);
    setError('');

    try {
      await cancelBooking(bookingId);

      // Remove the reservation only after the API confirms cancellation.
      setReservations((current) =>
        current.filter((reservation) => reservation.id !== bookingId)
      );
    } catch (err) {
      setError(err.message || 'Unable to cancel this reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  // Format dates consistently using the local calendar date.
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Compare ISO date strings to separate upcoming and past appointments.
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');


  
const upcomingReservations = reservations
  .filter(
    (reservation) =>
      reservation.status === 'confirmed' &&
      reservation.date >= todayString
  )
  .sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.time.localeCompare(b.time);
  });

const pastReservations = reservations
  .filter(
    (reservation) =>
      reservation.status !== 'confirmed' ||
      reservation.date < todayString
  )
  .sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return b.time.localeCompare(a.time);
  });

const filteredReservations =
  activeTab === 'upcoming'
    ? upcomingReservations
    : pastReservations;


  return (
    <main className="min-h-[70vh] bg-white px-5 py-12 text-neutral-950 sm:px-8 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-3xl font-normal tracking-tight sm:text-4xl lg:text-[40px]">
            My Reservations
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-700 sm:text-base">
            View and manage your makeup appointments at Dazzle Beauty Studio.
          </p>
        </header>

        {/* Tabs separate upcoming appointments from past reservations. */}
        <div
          className="mb-8 flex gap-8 border-b border-neutral-200"
          role="tablist"
          aria-label="Reservation categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
            className={`-mb-px cursor-pointer border-b-2 px-1 pb-4 text-sm ${
              activeTab === 'upcoming'
                ? 'border-neutral-950 font-medium text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-950'
            }`}
          >
            Upcoming ({upcomingReservations.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'past'}
            onClick={() => setActiveTab('past')}
            className={`-mb-px cursor-pointer border-b-2 px-1 pb-4 text-sm ${
              activeTab === 'past'
                ? 'border-neutral-950 font-medium text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-950'
            }`}
          >
            Past ({pastReservations.length})
          </button>
        </div>

        <section className="min-h-[300px]">
          {loading ? (
            <div className="py-16 text-center text-neutral-600">
              Loading your reservations...
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={loadReservations}
                className="mt-5 border border-neutral-950 px-6 py-3 text-sm hover:bg-neutral-100"
              >
                Try Again
              </button>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="h-11 w-11"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="1" />
                  <path
                    strokeLinecap="round"
                    d="M7 3v4M17 3v4M3 10h18"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-xl font-normal sm:text-2xl">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming reservations yet."
                  : "You don't have any past reservations yet."}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 sm:text-base">
                {activeTab === 'upcoming'
                  ? 'Book your next makeup appointment and let us take care of the rest.'
                  : 'Your past appointments will appear here.'}
              </p>

              {activeTab === 'upcoming' && (
                <button
                  type="button"
                  onClick={handleBookAppointment}
                  className="mt-8 w-full max-w-xs border border-neutral-950 bg-neutral-950 px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
                >
                  Book an Appointment
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredReservations.map((reservation) => {
                const isUpcoming =
                  reservation.status === 'confirmed' &&
                  reservation.date >= todayString;

                return (
                  <article
                    key={reservation.id}
                    className="grid grid-cols-1 border border-neutral-200 bg-white sm:grid-cols-[110px_minmax(0,1fr)]"
                  >
                    <div className="flex flex-row items-center gap-3 border-b border-neutral-200 px-5 py-4 sm:flex-col sm:justify-center sm:border-b-0 sm:border-r">
                      <span className="text-3xl font-normal">
                        {reservation.date
                          ? new Date(
                              `${reservation.date}T12:00:00`
                            ).getDate()
                          : '--'}
                      </span>

                      <span className="text-xs uppercase tracking-widest text-neutral-600">
                        {reservation.date
                          ? new Date(
                              `${reservation.date}T12:00:00`
                            ).toLocaleDateString('en-GB', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Date pending'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                      <div className="min-w-0">
                        <h2 className="text-lg font-normal">
                          {reservation.serviceName || reservation.service}
                          {' In-Studio'}
                        </h2>

                        <p className="mt-2 text-sm text-neutral-600">
                          {formatDate(reservation.date)}
                        </p>

                        <p className="mt-2 text-sm text-neutral-600">
                          {reservation.time || 'Time pending'}
                          {' · '}
                          {reservation.duration || '2 hr'}
                        </p>

                        <p className="mt-2 text-sm text-neutral-600">
                          Sandton, Johannesburg, South Africa
                        </p>

                        <p className="mt-2 text-sm text-neutral-600">
                          R{' '}
                          {Number(reservation.price || 0).toLocaleString('en-ZA')}
                        </p>

                        {reservation.reference && (
                          <p className="mt-2 text-xs text-neutral-500">
                            Reference: {reservation.reference}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                        <span className="inline-flex border border-neutral-300 px-3 py-2 text-xs">
                          {isUpcoming ? 'Confirmed' : 'Past'}
                        </span>

                        {isUpcoming && (
                          <button
                            type="button"
                            disabled={cancellingId === reservation.id}
                            onClick={() =>
                              handleCancelBooking(reservation.id)
                            }
                            className="cursor-pointer border border-neutral-400 bg-white px-4 py-2.5 text-sm hover:border-neutral-950 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === reservation.id
                              ? 'Cancelling...'
                              : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MyReservations;
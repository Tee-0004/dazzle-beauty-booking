import { useLocation, useNavigate } from 'react-router-dom';

// Displays the details of a successfully completed booking.
function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieves the booking details passed from the previous page.
  const booking = location.state?.booking || location.state || {};

  // Determines the service name, supporting different booking data formats.
  const serviceName =
    booking.serviceName ||
    (typeof booking.service === 'string'
      ? booking.service
      : booking.service?.name) ||
    'Natural Glam';

  // Retrieves the booking price or uses the default price for the selected service.
  const price = Number(booking.price ?? booking.service?.price ?? (serviceName.includes('Full Glam') ? 1250 : 1000));
  const date = booking.date || '';
  const time = booking.time || '';
  const duration = booking.duration || '2 hr';

  // Converts the appointment date into a readable date format.
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not provided';

    return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Retrieves the booking reference or displays a pending confirmation message.
  const bookingReference =
    booking.reference || booking.bookingReference || 'Pending confirmation';

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-neutral-950 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="text-center">
          {/* Displays the visual confirmation icon. */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-12 w-12"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4.5 4.5L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-normal tracking-tight text-neutral-950 sm:text-4xl lg:text-[40px]">
            Booking Confirmed!
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-700 sm:text-lg">
            Thank you for booking with Dazzle Beauty Studio.
            <br className="hidden sm:block" /> We look forward to making you
            look and feel your best.
          </p>
        </section>

        <div className="my-10 border-t border-neutral-300 sm:my-12" />

        {/* Presents a summary of the confirmed appointment. */}
        <section
          aria-label="Booking summary"
          className="bg-white px-5 py-5 sm:px-8 sm:py-7"
        >
          {/* Displays the booking's unique reference number. */}
          <div className="grid grid-cols-1 gap-2 border-b border-neutral-200 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Booking Reference
            </h2>
            <p className="text-sm sm:text-base">{bookingReference}</p>
          </div>

          {/* Displays the selected makeup service. */}
          <div className="grid grid-cols-1 gap-2 border-b border-neutral-200 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Service
            </h2>
            <p className="text-sm sm:text-base">{serviceName} In-Studio</p>
          </div>

          {/* Displays the appointment date and time. */}
          <div className="grid grid-cols-1 gap-2 border-b border-neutral-200 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Date &amp; Time
            </h2>
            <p className="text-sm sm:text-base">
              {date ? formatDate(date) : 'Date not provided'}
              {time ? ` at ${time}` : ''}
            </p>
          </div>

          {/* Shows the studio's location. */}
          <div className="grid grid-cols-1 gap-2 border-b border-neutral-200 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Location
            </h2>
            <p className="text-sm sm:text-base">
              Sandton, Johannesburg, South Africa
            </p>
          </div>

          {/* Displays the expected appointment duration. */}
          <div className="grid grid-cols-1 gap-2 border-b border-neutral-200 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Duration
            </h2>
            <p className="text-sm sm:text-base">{duration}</p>
          </div>

          {/* Displays the total price of the selected service. */}
          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
              Total
            </h2>
            <p className="text-sm sm:text-base">
              R {price.toLocaleString('en-ZA')}
            </p>
          </div>
        </section>

        {/* Provides navigation options after booking confirmation. */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
         type="button"
         onClick={() => navigate('/booking')}
         className="w-full cursor-pointer border border-neutral-950 bg-neutral-950 px-6 py-4 text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
        >
         Book Another Appointment
       </button>

       <button
        type="button"
        onClick={() => navigate('/my-reservations')}
        className="w-full cursor-pointer border border-neutral-950 bg-white px-6 py-4 text-sm text-neutral-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
       >
       View My Reservations
      </button>
      </div>
      </div>
    </main>
  );
}

export default BookingConfirmation;
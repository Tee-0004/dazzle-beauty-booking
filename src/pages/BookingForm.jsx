import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api.js';

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the selected appointment passed from the booking page.
  const booking = location.state || {};

  const serviceName =
    booking.serviceName ||
    (typeof booking.service === 'string'
      ? booking.service
      : booking.service?.name) ||
    '';

  const price = Number(booking.price ?? booking.service?.price ?? 0);
  const date = booking.date || '';
  const time = booking.time || '';
  const duration = booking.duration || '2 hr';

  // Store customer input and form status.
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format the selected date for the booking summary.
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not selected';

    return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Format the South African mobile number as the user types.
  const formatPhone = (digits) => {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) {
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  };

  // Update controlled form fields and clear their previous errors.
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 9);

      setFormData((previous) => ({
        ...previous,
        phone: digits,
      }));

      setErrors((previous) => ({
        ...previous,
        phone: '',
        form: '',
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      form: '',
    }));
  };

  // Validate the customer information before calling the API.
  const validateForm = () => {
    const newErrors = {};

    const namePattern = /^[\p{L}][\p{L}\p{M} '-]*$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();

    if (
      firstName.length < 2 ||
      firstName.length > 50 ||
      !namePattern.test(firstName)
    ) {
      newErrors.firstName = 'Please enter a valid first name.';
    }

    if (
      lastName.length < 2 ||
      lastName.length > 50 ||
      !namePattern.test(lastName)
    ) {
      newErrors.lastName = 'Please enter a valid last name.';
    }

    if (email.length > 254 || !emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // The +27 prefix is already displayed beside the phone field.
    if (!/^[6-8]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African mobile number.';
    }

    if (formData.message.length > 500) {
      newErrors.message = 'Your message must be 500 characters or fewer.';
    }

    if (
      !serviceName ||
      !['Natural Glam', 'Full Glam'].includes(serviceName) ||
      !date ||
      !time
    ) {
      newErrors.form =
        'Your appointment details are missing. Please return to the booking page and select a service, date and time.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the validated booking to the Express backend.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // The backend expects one full name, not separate name fields.
      const bookingDetails = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        date,
        time,
        service: serviceName,
      };

      // The API returns only after the server processes the booking.
      const response = await createBooking(bookingDetails);

      if (!response.booking) {
        throw new Error('The server did not return a booking confirmation.');
      }

      // Only navigate after the backend successfully creates the booking.
      navigate('/booking-confirmation', {
        state: {
          booking: response.booking,
          price,
          duration,
          phone: formData.phone,
          message: formData.message.trim(),
        },
      });
    } catch (error) {
      setErrors({
        form:
          error.message ||
          'We could not complete your booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-950';

  const labelClass = 'mb-2 block text-sm text-neutral-800';

  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Return to the calendar to change the appointment. */}
        <button
          type="button"
          onClick={() =>
            navigate('/booking', {
              state: {
                service: {
                  name: serviceName,
                  price,
                  duration,
                },
                date,
                time,
              },
            })
          }
          className="mb-12 inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-800 transition hover:text-neutral-500"
        >
          <span aria-hidden="true">‹</span>
          Back
        </button>

        <h1 className="mb-12 text-3xl font-normal text-neutral-950 sm:text-4xl">
          Booking Form
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.9fr)] lg:gap-16">
          {/* Customer details and validation. */}
          <section>
            <h2 className="mb-8 text-xl font-normal text-neutral-900">
              Client Details
            </h2>

            <form
              id="booking-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">
                    First name *
                  </label>
                  <input
                    className={inputClass}
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    maxLength={50}
                    required
                    aria-invalid={Boolean(errors.firstName)}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="lastName">
                    Last name *
                  </label>
                  <input
                    className={inputClass}
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    maxLength={50}
                    required
                    aria-invalid={Boolean(errors.lastName)}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email *
                  </label>
                  <input
                    className={inputClass}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={254}
                    required
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    Phone *
                  </label>
                  <div className="flex">
                    <span className="flex items-center border border-r-0 border-neutral-300 bg-white px-3 text-sm text-neutral-800">
                      +27
                    </span>
                    <input
                      className={`${inputClass} min-w-0`}
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      value={formatPhone(formData.phone)}
                      onChange={handleChange}
                      placeholder="82 123 4567"
                      maxLength={12}
                      required
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-700">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="message">
                  Add your message
                </label>
                <textarea
                  className={`${inputClass} min-h-32 resize-none`}
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={500}
                  value={formData.message}
                  onChange={handleChange}
                />
                <p className="mt-1 text-right text-xs text-neutral-500">
                  {formData.message.length}/500
                </p>
                {errors.message && (
                  <p className="mt-2 text-xs text-red-700">
                    {errors.message}
                  </p>
                )}
              </div>
            </form>
          </section>

          {/* Appointment summary and submission button. */}
          <aside className="h-fit">
            <h2 className="border-b border-neutral-300 pb-4 text-xl font-normal text-neutral-900">
              Booking Details
            </h2>

            <div className="border-b border-neutral-300 py-6">
              <p className="text-sm text-neutral-900">
                {serviceName
                  ? `${serviceName} In-Studio`
                  : 'No service selected'}
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {date
                  ? `${formatDate(date)}${time ? ` at ${time}` : ''}`
                  : 'Date and time not selected'}
              </p>
            </div>

            <div className="border-b border-neutral-300 py-5">
              <button
                type="button"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                aria-expanded={detailsExpanded}
                className="flex w-full cursor-pointer items-center justify-between text-left text-sm text-neutral-800"
              >
                <span>{detailsExpanded ? 'Less details' : 'More details'}</span>
                <span aria-hidden="true">
                  {detailsExpanded ? '⌃' : '⌄'}
                </span>
              </button>

              {detailsExpanded && (
                <div className="mt-4 space-y-2 text-sm text-neutral-700">
                  <p>Sandton, Johannesburg, South Africa</p>
                  <p>{duration}</p>
                </div>
              )}
            </div>

            <div className="border-b border-neutral-300 py-5">
              <h3 className="mb-4 text-base font-normal text-neutral-900">
                Payment Details
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-900">Total</span>
                <span className="text-sm text-neutral-900">
                  R {price.toLocaleString('en-ZA')}
                </span>
              </div>
            </div>

            <p className="py-5 text-sm leading-6 text-neutral-600">
              By completing your booking, you agree to receive related phone
              notifications about your appointment.
            </p>

            {errors.form && (
              <p
                role="alert"
                className="mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              form="booking-form"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-neutral-950 px-6 py-4 text-sm font-normal text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default BookingForm;
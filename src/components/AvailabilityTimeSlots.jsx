
import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../services/api.js';

function AvailabilityTimeSlots({
  selectedDate,
  selectedTime,
  onTimeSelect,
  resource,
}) {
  // Store the real time slots returned by the Express backend.
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format the selected date for the availability heading.
  const formatSelectedDate = (dateString) => {
    if (!dateString) {
      return 'Select a date to view availability';
    }

    // Midday avoids timezone-related date shifts.
    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  // The studio is closed on Sundays and Mondays.
  const isClosedDay = (dateString) => {
    if (!dateString) return false;

    const date = new Date(`${dateString}T12:00:00`);
    const weekday = date.getDay();

    return weekday === 0 || weekday === 1;
  };

  // Prevent customers from booking dates in the past.
  const selectedDateIsPast = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    const selected = new Date(`${dateString}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    return selected < today;
  };

  const dateIsUnavailable =
    !selectedDate ||
    isClosedDay(selectedDate) ||
    selectedDateIsPast(selectedDate);

  // Fetch availability whenever the date or service changes.
  useEffect(() => {
    let isCurrentRequest = true;

    async function fetchSlots() {
      // Do not request slots for missing or unavailable dates.
      if (
        !selectedDate ||
        !resource ||
        isClosedDay(selectedDate) ||
        selectedDateIsPast(selectedDate)
      ) {
        setTimeSlots([]);
        setLoading(false);
        setError('');
        return;
      }

      setLoading(true);
      setError('');
      setTimeSlots([]);

      try {
        // Call GET /api/slots with the selected date and service.
        const data = await getAvailableSlots(selectedDate, resource);

        if (isCurrentRequest) {
          setTimeSlots(data.slots || []);
        }
      } catch (err) {
        if (isCurrentRequest) {
          setError(
            err.message ||
              'Unable to load availability. Please try again.'
          );
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    fetchSlots();

    // Ignore outdated responses if the date or service changes.
    return () => {
      isCurrentRequest = false;
    };
  }, [selectedDate, resource]);

  return (
    <section className="w-full">
      {/* Availability heading */}
      <div className="mb-5 flex min-h-8 items-center">
        <h2 className="text-base font-normal text-neutral-900 sm:text-lg">
          Availability for{' '}
          {selectedDate
            ? formatSelectedDate(selectedDate)
            : 'your selected date'}
        </h2>
      </div>

      {/* Show a message when the selected date cannot be booked. */}
      {dateIsUnavailable ? (
        <div className="flex min-h-28 items-center justify-center border border-neutral-200 px-4 py-6 text-center">
          <p className="text-sm leading-6 text-neutral-500">
            {!selectedDate
              ? 'Please select a date on the calendar to view appointment times.'
              : isClosedDay(selectedDate)
                ? 'The studio is closed on Sundays and Mondays. Please choose another date.'
                : 'Past dates cannot be booked. Please select a future date.'}
          </p>
        </div>
      ) : loading ? (
        <div
          className="flex min-h-28 items-center justify-center border border-neutral-200 px-4 py-6 text-center"
          role="status"
        >
          <p className="text-sm text-neutral-500">
            Checking available appointment times...
          </p>
        </div>
      ) : error ? (
        <div
          className="flex min-h-28 items-center justify-center border border-neutral-200 px-4 py-6 text-center"
          role="alert"
        >
          <p className="text-sm leading-6 text-red-700">{error}</p>
        </div>
      ) : (
        <>
          {/* Render the slots returned by the backend API. */}
          <div className="grid grid-cols-2 gap-3">
            {timeSlots
  .filter((slot) => {
    const now = new Date();

    const todayString = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const isToday = selectedDate === todayString;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [hours, minutes] = slot.time.split(':').map(Number);
    const slotStartMinutes = hours * 60 + minutes;

    const isPastTime = isToday && slotStartMinutes <= currentMinutes;

    return slot.available && !isPastTime;
  })
  .map((slot) => {
              const isSelected = selectedTime === slot.time;
              const now = new Date();

              const isToday =
              selectedDate ===
              `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

              const currentMinutes = now.getHours() * 60 + now.getMinutes();

              const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
              const slotStartMinutes = slotHours * 60 + slotMinutes;

              const isPastTime = isToday && slotStartMinutes <= currentMinutes;

              const isAvailable = slot.available && !isPastTime;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onTimeSelect(slot.time)}
                  aria-pressed={isSelected}
                  title={
                    isAvailable
                      ? `${slot.time}–${slot.endTime}`
                      : `${slot.time} is already booked`
                  }
                  className={`flex min-h-12 items-center justify-center border px-3 py-3 text-sm transition duration-200 sm:min-h-14 sm:text-base ${
                    !isAvailable
                      ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through'
                      : isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'cursor-pointer border-neutral-400 bg-white text-neutral-900 hover:-translate-y-0.5 hover:border-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {slot.time}
                  {!isAvailable && (
                    <span className="ml-1 text-xs no-underline">
                      Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explain when all returned slots are unavailable. */}
          {timeSlots.length > 0 &&
            timeSlots.every((slot) => !slot.available) && (
              <p className="mt-4 text-sm text-neutral-500">
                All appointment times are booked for this date. Please choose another date.
              </p>
            )}

          {timeSlots.length === 0 && (
            <p className="border border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500">
              No appointment times were returned. Please choose another date or try again.
            </p>
          )}
        </>
      )}

      <p className="mt-4 text-xs text-neutral-500">
        South Africa Standard Time (SAST)
      </p>
    </section>
  );
}

export default AvailabilityTimeSlots;

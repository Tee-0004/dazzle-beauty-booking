import { Router } from 'express';
import bookings from '../data/bookings.js';
import {
  VALID_SERVICES,
  BUSINESS_OPEN_MINUTES,
  BUSINESS_CLOSE_MINUTES,
  SLOT_INTERVAL_MINUTES,
  BOOKING_DURATION_MINUTES,
  isValidDate,
  isFutureDate,
  isFutureAppointment,
} from '../utils/validation.js';

const router = Router();

function formatTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
}

// GET /api/slots - retrieve available appointment slots for a date and service
router.get('/', (req, res) => {
  const { date, resource } = req.query;

  if (!isValidDate(date)) {
    return res.status(400).json({
      error: 'Please provide a valid date using YYYY-MM-DD.',
    });
  }

  if (!isFutureDate(date)) {
    return res.status(400).json({
      error: 'Appointments cannot be booked in the past.',
    });
  }

  if (!VALID_SERVICES.includes(resource)) {
    return res.status(400).json({
      error: 'Please select Natural Glam or Full Glam.',
    });
  }

  // Store the appointment slots generated for the requested date.
  const availableSlots = [];

  // Generate appointment slots during business hours at the configured interval.
  for (
    let start = BUSINESS_OPEN_MINUTES;
    start + BOOKING_DURATION_MINUTES <= BUSINESS_CLOSE_MINUTES;
    start += SLOT_INTERVAL_MINUTES
  ) {
    const end = start + BOOKING_DURATION_MINUTES;

    // Check whether an existing booking overlaps with this appointment slot.
    const conflictingBooking = bookings.some((booking) => {
      if (booking.date !== date) return false;

      const bookingStart =
        Number(booking.time.split(':')[0]) * 60 +
        Number(booking.time.split(':')[1]);

      const bookingEnd = bookingStart + BOOKING_DURATION_MINUTES;

      return start < bookingEnd && end > bookingStart;
    });

    // Mark the slot as available only if it has no conflict and is in the future.
    availableSlots.push({
      time: formatTime(start),
      endTime: formatTime(end),
      available: !conflictingBooking && isFutureAppointment(date, formatTime(start)),
    });
  }

  return res.json({
    date,
    resource,
    durationMinutes: BOOKING_DURATION_MINUTES,
    slots: availableSlots,
  });
});

export default router;
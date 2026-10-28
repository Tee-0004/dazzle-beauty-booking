import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import bookings from '../data/bookings.js';
import {
  validateBooking,
  BOOKING_DURATION_MINUTES,
  isValidDate,
  VALID_SERVICES,
} from '../utils/validation.js';

const router = Router();

console.log('Bookings router loaded');

router.get('/test', (req, res) => {
  res.json({ message: 'Bookings router is working!' });
});

// GET /api/bookings — retrieve all reservations for the My Reservations page.
router.get('/', (req, res) => {
  const results = bookings
    .filter((booking) => booking.status === 'confirmed')
    .map((booking) => ({
      ...booking,
      serviceName: booking.service,
      duration: '2 hr',
      price: booking.service === 'Full Glam' ? 1250 : 1000,
    }));

  return res.json({ bookings: results });
});

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// POST /api/bookings — create a reservation
router.post('/', (req, res) => {
  const errors = validateBooking(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { name, email, date, time, service } = req.body;
  const requestedStart = toMinutes(time);
  const requestedEnd = requestedStart + BOOKING_DURATION_MINUTES;

  // A single makeup artist means both services share one calendar.
  const conflict = bookings.some((booking) => {
    if (booking.date !== date) return false;

    const existingStart = toMinutes(booking.time);
    const existingEnd = existingStart + BOOKING_DURATION_MINUTES;

    return requestedStart < existingEnd && requestedEnd > existingStart;
  });

  if (conflict) {
    return res.status(409).json({
      error: 'This appointment time is no longer available. Please choose another slot.',
    });
  }

  const booking = {
    id: randomUUID(),
    reference: `DAZ-${randomUUID().slice(0, 8).toUpperCase()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    date,
    time,
    service,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  return res.status(201).json({
    message: 'Your appointment has been booked successfully.',
    booking,
  });
});

// GET /api/bookings/:date/:resource — retrieve reservations
router.get('/:date/:resource', (req, res) => {
  const { date, resource } = req.params;

  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Please provide a valid date.' });
  }

  if (!VALID_SERVICES.includes(resource)) {
    return res.status(400).json({ error: 'Please select a valid service.' });
  }

  const results = bookings
    .filter(
      (booking) =>
        booking.date === date &&
        booking.service === resource &&
        booking.status === 'confirmed'
    )
    .map(({ id, reference, name, email, date, time, service, status }) => ({
      id,
      reference,
      name,
      email,
      date,
      time,
      service,
      status,
    }));

  return res.json({ date, resource, bookings: results });
});

// DELETE /api/bookings/:id — cancel a reservation
router.delete('/:id', (req, res) => {
  const index = bookings.findIndex(
    (booking) => booking.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  bookings.splice(index, 1);

  return res.json({ message: 'Booking cancelled successfully.' });
});

export default router;
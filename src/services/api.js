// Base URL for the Dazzle Beauty Studio Express backend.
const API_BASE_URL = 'https://dazzle-beauty-booking.onrender.com/api';

// Shared helper for sending requests to the backend API.
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // Convert the backend response into JavaScript data.
  const data = await response.json();

  // Show the backend's error message if a request fails.
  if (!response.ok) {
  const errorMessage = Array.isArray(data.errors)
    ? data.errors.join(' ')
    : data.error || 'Something went wrong. Please try again.';

  throw new Error(errorMessage);
}

  return data;
}

// GET: Retrieve available time slots for a selected date and service.
export async function getAvailableSlots(date, resource) {
  const params = new URLSearchParams({ date, resource });

  return apiRequest(`/slots?${params.toString()}`);
}

// POST: Create a new booking.
export async function createBooking(bookingDetails) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingDetails),
  });
}

// GET: Retrieve bookings for a particular date and resource.
export async function getBookings(date, resource) {
  return apiRequest(
    `/bookings/${encodeURIComponent(date)}/${encodeURIComponent(resource)}`
  );
}

// DELETE: Cancel a booking using its unique ID.
export async function cancelBooking(id) {
  return apiRequest(`/bookings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// GET: Retrieve all reservations for the My Reservations page.
export async function getAllBookings() {
  return apiRequest('/bookings');
}
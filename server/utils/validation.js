// Available makeup services offered by Dazzle Beauty Studio.
const VALID_SERVICES = ['Natural Glam', 'Full Glam'];

// Business opening and closing times, expressed in minutes after midnight.
const BUSINESS_OPEN_MINUTES = 9 * 60;
const BUSINESS_CLOSE_MINUTES = 17 * 60;

// Appointment slots are spaced two hours apart, and each booking lasts two hours.
const SLOT_INTERVAL_MINUTES = 120;
const BOOKING_DURATION_MINUTES = 120;

// Check that the date is a valid date in YYYY-MM-DD format.
function isValidDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  // Parse the date in UTC and check that it matches the original date string.
  const parsedDate = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

// Check that the time is valid and matches the available two-hour appointment slots.
function isValidTime(time) {
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return false;
  }

  // Convert the selected time into minutes after midnight.
  const [hours, minutes] = time.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;

  // Ensure the appointment starts during business hours and finishes by closing time.
  return (
    (startMinutes - BUSINESS_OPEN_MINUTES) % SLOT_INTERVAL_MINUTES === 0 &&
    startMinutes >= BUSINESS_OPEN_MINUTES &&
    startMinutes + BOOKING_DURATION_MINUTES <= BUSINESS_CLOSE_MINUTES
  );
}

// Check that the appointment date is today or a future date.
function isFutureDate(date) {
  const today = new Date();

  // Format today's date as YYYY-MM-DD for comparison.
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  return date >= todayString;
}

// Check that the selected appointment date and time have not passed.
function isFutureAppointment(date, time) {
  const appointment = new Date(`${date}T${time}:00`);
  const now = new Date();

  return appointment > now;
}

// Check that the customer has provided an email address in a valid format.
function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

// Validate the booking details before allowing a reservation to be created.
function validateBooking(booking) {
  const errors = [];

  // Ensure that the request contains a valid booking object.
  if (!booking || typeof booking !== 'object' || Array.isArray(booking)) {
    return ['A valid booking object is required.'];
  }

  // Extract the customer's details and selected appointment information.
  const { name, email, date, time, service } = booking;

  // Validate the customer's name.
  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Please provide your full name.');
  } else if (name.trim().length > 100) {
    errors.push('Your name must be 100 characters or fewer.');
  }

  // Validate the customer's email address.
  if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  // Validate the appointment date and check whether it is in the past.
  if (!isValidDate(date)) {
    errors.push('Please provide a valid appointment date.');
  } else if (!isFutureDate(date)) {
    errors.push('Appointments cannot be booked in the past.');
  } else if (
    typeof time === 'string' &&
    isValidTime(time) &&
    !isFutureAppointment(date, time)
  ) {
    // Reject appointment times that have already passed.
    errors.push('Please select an appointment time that has not passed.');
  }

  // Ensure that the selected service is offered by the studio.
  if (!VALID_SERVICES.includes(service)) {
    errors.push('Please select Natural Glam or Full Glam.');
  }

  // Ensure that the selected time follows the studio's booking rules.
  if (!isValidTime(time)) {
    errors.push(
      'Please select a valid two-hour appointment slot between 09:00 and 17:00.'
    );
  }

  // Return any validation errors found; an empty array means validation passed.
  return errors;
}

// Export the constants and functions so other backend files can use them.
export {
  VALID_SERVICES,
  BUSINESS_OPEN_MINUTES,
  BUSINESS_CLOSE_MINUTES,
  SLOT_INTERVAL_MINUTES,
  BOOKING_DURATION_MINUTES,
  isValidDate,
  isValidTime,
  isValidEmail,
  isFutureDate,
  isFutureAppointment,
  validateBooking,
};
import express from 'express';
import cors from 'cors';

import slotsRouter from './routes/slots.js';
import bookingsRouter from './routes/bookings.js';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.json({
    message: 'Dazzle Beauty Studio Booking API is running.',
  });
});

console.log('Starting the updated Dazzle booking server');

// Required API routes
app.use('/api/slots', slotsRouter);
app.use('/api/bookings', bookingsRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Handle unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Dazzle Beauty Studio API running at http://localhost:${PORT}`);
});
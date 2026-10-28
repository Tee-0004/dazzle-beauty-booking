import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AvailabilityCalendar from '../components/AvailabilityCalendar.jsx';
import AvailabilityTimeSlots from '../components/AvailabilityTimeSlots.jsx';

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read a service passed from the Services page, if available.
  const incomingService = location.state?.service;

  const initialService =
    typeof incomingService === 'string'
      ? incomingService
      : incomingService?.name || 'Natural Glam';

  const initialPrice =
    typeof incomingService === 'object' && incomingService !== null
      ? incomingService.price
      : initialService === 'Full Glam'
        ? 1250
        : 1000;

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedPrice, setSelectedPrice] = useState(initialPrice);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [error, setError] = useState('');

  const services = [
    { name: 'Natural Glam', price: 1000, duration: '2 hr' },
    { name: 'Full Glam', price: 1250, duration: '2 hr' },
  ];

  const currentService = services.find(
    (service) => service.name === selectedService
  );

  const handleServiceChange = (event) => {
    const serviceName = event.target.value;
    const service = services.find((item) => item.name === serviceName);

    setSelectedService(service.name);
    setSelectedPrice(service.price);
    setSelectedTime('');
    setError('');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    // A time selected for a different date must not remain selected.
    setSelectedTime('');
    setError('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError('');
  };

  const formatSelectedDate = (dateString) => {
    if (!dateString) return 'Select a date';

    return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleNext = () => {
    if (!selectedDate) {
      setError('Please select an appointment date.');
      return;
    }

    if (!selectedTime) {
      setError('Please select an available appointment time.');
      return;
    }

    navigate('/booking-form', {
      state: {
        service: selectedService,
        serviceName: selectedService,
        price: selectedPrice,
        date: selectedDate,
        time: selectedTime,
        duration: currentService.duration,
      },
    });
  };

  return (
    <main className="min-h-[70vh] bg-white px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Page heading */}
        <header className="mb-14">
          <h1 className="text-3xl font-normal tracking-tight text-neutral-950 sm:text-4xl lg:text-[40px]">
            Schedule your service
          </h1>

          <p className="mt-5 text-sm leading-6 text-neutral-800 sm:text-base">
            Check out our availability and book the date and time that works
            for you
          </p>
        </header>

        {/* Booking layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px] xl:gap-10">
          {/* Calendar */}
          <div>
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Available times */}
          <div className="pt-0 lg:pt-0">
            <AvailabilityTimeSlots
             selectedDate={selectedDate}
             selectedTime={selectedTime}
             onTimeSelect={handleTimeSelect}
             resource={selectedService}
            />
          </div>

          {/* Service details */}
          <aside className="h-fit border-t border-neutral-300 pt-1 lg:border-l-0 lg:border-t-0 lg:pt-0">
            <h2 className="border-b border-neutral-300 pb-3 text-lg font-normal text-neutral-950 sm:text-xl">
              Service Details
            </h2>

        
            <div className="mt-5">
             <p className="text-base font-normal text-neutral-900">
               {selectedService} In-Studio
             </p>
            </div>

            <button
              type="button"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              aria-expanded={detailsExpanded}
              className="mt-5 flex w-full cursor-pointer items-center justify-between text-left text-sm text-neutral-800"
            >
              <span>{detailsExpanded ? 'Less details' : 'More details'}</span>

              <span
                className={`inline-block text-lg transition-transform duration-200 ${
                  detailsExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                ⌄
              </span>
            </button>

            {detailsExpanded && (
            <div className="mt-4 space-y-4 text-base text-neutral-700">
             <p>R {selectedPrice.toLocaleString('en-ZA')}</p>
             <p>{formatSelectedDate(selectedDate)}</p>
             <p>{selectedTime || 'Select a time'}</p>
             <p>Sandton, Johannesburg, South Africa</p>
             <p>{currentService.duration}</p>
            </div>
             )}

            {error && (
              <p
                role="alert"
                className="mt-5 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="mt-8 w-full cursor-pointer bg-neutral-950 px-6 py-4 text-sm font-normal text-white transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              Next
            </button>

          </aside>
        </div>
      </div>
    </main>
  );
}

export default Booking;

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useEffect } from 'react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';

import Booking from './pages/Booking.jsx';
import BookingForm from './pages/BookingForm.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import MyReservations from './pages/MyReservations.jsx';

// Navigation helper:
// When a URL contains a section hash, scroll to that section.
// This supports navigation from booking and reservations pages too.
function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      // When opening a new page without a section hash,
      // start at the top of the page.
      window.scrollTo(0, 0);
      return;
    }

    // Wait briefly for the homepage section to render
    // before trying to scroll to it.
    const sectionId = location.hash.substring(1);

    const timer = window.setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}

// Homepage content
function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Contact />
    </main>
  );
}

// Shared layout: Navbar and Footer appear on every page
function Layout() {
  return (
    <>
      <ScrollToSection />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Homepage */}
          <Route index element={<Home />} />

          {/* Service availability and time-slot selection */}
          <Route path="booking" element={<Booking />} />

          {/* Customer details and booking summary */}
          <Route path="booking-form" element={<BookingForm />} />

          {/* Booking confirmation */}
          <Route
            path="booking-confirmation"
            element={<BookingConfirmation />}
          />

          {/* My Reservations */}
          <Route
            path="my-reservations"
            element={<MyReservations />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

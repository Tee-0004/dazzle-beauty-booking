import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      setSubscribed(false);
      return;
    }

    setError('');
    setSubscribed(true);
    setEmail('');
  };

  const closeToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full bg-neutral-950 px-6 py-12 text-neutral-200 sm:px-10 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 md:items-start md:gap-20">

        {/* Newsletter subscription */}
        <div className="w-full max-w-xl">
          <h2 className="mb-6 font-sans text-sm font-medium uppercase tracking-wider text-neutral-300">
            Join the Family
          </h2>

          <form onSubmit={handleSubscribe} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Enter your email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
                setSubscribed(false);
              }}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full border-0 border-b border-neutral-500 bg-transparent px-3 py-3 text-base text-neutral-100 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-200 focus:ring-0"
            />

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex max-w-xs items-start gap-3 text-sm leading-6 text-neutral-300">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-neutral-300"
                />

                <span>
                  Yes, subscribe me to your newsletter.
                  <span className="ml-1">*</span>
                </span>
              </label>

              <button
                type="submit"
                className="min-h-12 w-full cursor-pointer bg-neutral-200 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-300 sm:w-auto sm:min-w-48"
              >
                Subscribe Now
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {error}
              </p>
            )}

            {subscribed && (
              <p role="status" className="mt-4 text-sm text-neutral-200">
                Thank you! Your email has passed validation.
              </p>
            )}

          </form>
        </div>

        {/* Footer navigation */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-10 md:justify-self-end md:gap-20"
        >
          <div className="flex flex-col items-start gap-4">
            <a
              href="/#home"
              onClick={closeToTop}
              className="text-base text-neutral-200 underline underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              Home
            </a>

            <a
              href="/#services"
              className="text-base text-neutral-200 underline underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              Services
            </a>

            <a
              href="/my-reservations"
              className="text-base text-neutral-200 underline underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              My Reservations
            </a>

            <a
              href="/#contact"
              className="text-base text-neutral-200 underline underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              Contact
            </a>
          </div>
        </nav>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-neutral-800 pt-6">
        <p className="text-xs tracking-wide text-neutral-500">
          © {new Date().getFullYear()} Dazzle Beauty Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
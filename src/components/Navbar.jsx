import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation links used on desktop and mobile.
  // React Router Link keeps navigation within the booking application.
  const links = [
    { label: 'HOME', to: '/#home' },
    { label: 'SERVICES', to: '/#services' },
    { label: 'MY RESERVATIONS', to: '/my-reservations' },
    { label: 'CONTACT', to: '/#contact' },
  ];

  const closeMenu = () => setMenuOpen(false);

  // Larger, bolder navigation text on desktop, smaller and lighter on mobile.
  const linkStyle =
    'whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.12em] text-neutral-950 transition-colors duration-200 hover:text-neutral-500 sm:text-sm sm:tracking-[0.13em]';

  return (
    <header className="w-full bg-white">
      {/* Brand: thinner typography and reduced spacing. */}
      <div className="relative flex w-full flex-col items-center px-4 pt-5 sm:pt-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex flex-col items-center text-center no-underline"
          aria-label="Dazzle Beauty Studio home"
        >
            <span className="font-['Cormorant_Garamond'] text-[17px] font-light uppercase tracking-[0.12em] text-neutral-950 sm:text-lg sm:tracking-[0.16em] md:text-xl">
             DAZZLE BEAUTY STUDIO
            </span>
          <span className="mt-0.5 text-[8px] font-normal uppercase tracking-[0.35em] text-neutral-600 sm:text-[9px] sm:tracking-[0.4em]">
            MAKEUP ARTISTRY
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="absolute right-4 top-6 flex h-9 w-9 flex-col items-center justify-center gap-[5px] border-0 bg-transparent md:hidden"
        >
          <span
            className={`h-px w-6 bg-neutral-950 transition-transform duration-300 ${
              menuOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-neutral-950 transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-px w-6 bg-neutral-950 transition-transform duration-300 ${
              menuOpen ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>

        {/* Desktop navigation: positioned closer to the brand. */}
        <nav
          aria-label="Main navigation"
          className="mt-5 hidden w-full max-w-[1050px] items-center justify-between px-6 pb-5 md:flex lg:px-10"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={closeMenu}
              className={linkStyle}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="mt-6 flex w-full flex-col items-center gap-6 pb-6 md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMenu}
                className={linkStyle}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
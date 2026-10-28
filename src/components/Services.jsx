import ServiceCard from './ServiceCard.jsx';

const services = [
  {
    id: 'natural-glam',
    name: 'Natural Glam',
    description:
      'A soft, radiant makeup look perfect for daytime events, birthdays, graduations, baby showers, and elegant celebrations.',
    price: 1000,
    duration: '1 Hour 30 Minutes',
    image: '/images/IMG_9802.jpeg',
  },
  {
    id: 'full-glam',
    name: 'Full Glam',
    description:
      'A bold, flawless makeup application featuring sculpted contour and a luxurious finish, perfect for weddings, evening events, matric dances, and formal occasions.',
    price: 1250,
    duration: '2 Hours',
    image: '/images/IMG_9800.jpeg',
  },
];

function Services() {
  return (
    <section
      id="services"
      className="w-full scroll-mt-6 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Main heading */}
        <h2 className="mb-16 text-center font-serif text-4xl font-normal text-neutral-800 sm:mb-20 sm:text-5xl lg:text-6xl">
          Signature Services
        </h2>

        {/* Makeup category */}
        <div className="mb-8 border-b border-neutral-300 pb-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-800 sm:text-base">
            Makeup
          </h3>
        </div>

        {/* Individual service cards */}
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
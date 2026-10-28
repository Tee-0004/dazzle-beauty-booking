import { useNavigate } from 'react-router-dom';

function ServiceCard({ service, reverse = false }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking', {
      state: {
        service: {
          name: service.name,
          price: service.price,
          duration: service.duration,
        },
      },
    });
  };

  return (
    <article
      className={`group grid grid-cols-1 items-center gap-6 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl sm:p-7 md:grid-cols-2 md:gap-10 md:p-8 lg:gap-14 lg:p-10 ${
        reverse ? 'md:[&>img]:order-2' : ''
      }`}
    >
      {/* Service image */}
      <img
        src={service.image}
        alt={`${service.name} makeup look`}
        className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01] sm:h-[380px] md:h-[400px] lg:h-[440px]"
      />

      {/* Service details */}
      <div className="flex flex-col items-start py-2 text-neutral-700 md:py-6">
        <h3 className="mb-4 font-serif text-3xl font-normal text-neutral-800 sm:text-4xl lg:text-[42px]">
          {service.name}
        </h3>

        <p className="mb-6 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
          {service.description}
        </p>

        <p className="mb-4 text-sm sm:text-base">
          <strong className="font-semibold">Price:</strong>{' '}
          R{service.price}
        </p>

        <p className="mb-7 text-sm sm:text-base">
          <strong className="font-semibold">Duration:</strong>{' '}
          {service.duration}
        </p>

        <button
          type="button"
          onClick={handleBookNow}
          className="inline-flex min-h-12 min-w-44 cursor-pointer items-center justify-center bg-black px-8 py-3 text-sm font-normal tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 active:translate-y-0 sm:text-base"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;
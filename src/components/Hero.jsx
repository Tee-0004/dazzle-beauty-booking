function Hero() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section id="home" className="w-full bg-white">
      {/* Full-width banner video */}
      <div className="relative w-full overflow-hidden">
        <video
          className="block h-[300px] w-full object-cover sm:h-[420px] md:h-[520px] lg:h-[620px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Dazzle Beauty Studio makeup artistry video"
        >
          <source src="/images/Intro.mp4" type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </div>

      {/* Introduction and booking button */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16 md:py-20">
        <p className="max-w-4xl font-sans text-base font-normal leading-8 text-neutral-600 sm:text-lg sm:leading-9 md:text-xl">
          Experience our signature collection of luxury makeup, expertly
          crafted to enhance your natural beauty and leave you feeling
          confident, radiant, and unforgettable for every occasion.
        </p>

        <button
          type="button"
          onClick={scrollToServices}
          className="mt-9 inline-flex min-h-14 min-w-56 cursor-pointer items-center justify-center bg-black px-12 py-4 font-sans text-base font-normal tracking-wide text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-neutral-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:mt-11 sm:min-w-64 sm:text-lg"
        >
          Book Now
        </button>
      </div>
    </section>
  );
}

export default Hero;

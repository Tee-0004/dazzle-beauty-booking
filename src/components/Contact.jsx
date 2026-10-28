function Contact() {
  return (
    <section
      id="contact"
      className="w-full bg-white px-6 py-12 text-neutral-700 sm:px-10 sm:py-16 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-12 text-center font-sans text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Contact Us
        </h2>

        {/* Contact information */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
          {/* Address */}
          <div>
            <h3 className="mb-5 font-sans text-2xl font-normal text-neutral-700 sm:text-3xl">
              Address
            </h3>

            <p className="font-sans text-base leading-7 text-neutral-600">
              Sandton, Johannesburg
              <br />
              Gauteng, South Africa
            </p>
          </div>

          {/* Contact number */}
          <div>
            <h3 className="mb-5 font-sans text-2xl font-normal text-neutral-700 sm:text-3xl">
              Contact
            </h3>

            <p className="font-sans text-base leading-7 text-neutral-600">
              <a
                href="tel:+27000000000"
                className="transition-colors duration-300 hover:text-neutral-900"
              >
                +27 63 428 0100
              </a>
            </p>
          </div>

          {/* Email address */}
          <div>
            <h3 className="mb-5 font-sans text-2xl font-normal text-neutral-700 sm:text-3xl">
              Email
            </h3>

            <p className="break-words font-sans text-base leading-7 text-neutral-600">
              <a
                href="mailto:info@dazzlebeautystudios.com"
                className="transition-colors duration-300 hover:text-neutral-900"
              >
                info@dazzlebeautystudios.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
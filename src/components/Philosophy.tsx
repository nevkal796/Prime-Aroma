export default function Philosophy() {
  const stats = [
    { value: "50+", label: "Rare Ingredients" },
    { value: "12", label: "Master Perfumers" },
    { value: "2019", label: "Year Founded" },
    { value: "100%", label: "Natural Essences" },
  ] as const;

  return (
    <section className="bg-[#0a1628] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a84c] sm:text-xs">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-[#EDE8D0] sm:text-4xl md:text-5xl">
              Crafted with
              <br />
              <span className="italic">Intention</span>
            </h2>
            <p className="mt-6 font-sans text-sm leading-relaxed text-[#EDE8D0]/70">
            Every cologne in this collection has been personally 
            <br />handpicked — chosen for its quality, scent profile, and staying power. 
            <br />No filler, no compromises.
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-[#EDE8D0]/70">
              Whether you&apos;re looking for your everyday signature or something
              for a special occasion, there&apos;s a scent here for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="border border-[#EDE8D0]/20 p-6 sm:p-8"
              >
                <p className="font-serif text-4xl font-medium text-[#c9a84c] sm:text-5xl">
                  {value}
                </p>
                <p className="mt-2 font-sans text-[10px] font-medium uppercase tracking-widest text-[#EDE8D0] sm:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

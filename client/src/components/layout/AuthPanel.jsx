export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
      <div className="mx-auto hidden w-full max-w-xs overflow-hidden rounded-lg border-2 border-ink/15 bg-card shadow-book lg:block" style={{ aspectRatio: '741 / 1026' }}>
        <img
          src="/art/shiva-ascetic.jpg"
          alt="Raja Ravi Varma, Shiva as an Ascetic"
          className="size-full object-cover"
        />
      </div>

      <section className="mx-auto w-full max-w-md lg:mx-0">
        <p lang="hi" className="font-devanagari text-lg font-bold text-gold">
          कथा
        </p>
        <h1 className="mt-2 font-epic text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-ink-soft">{subtitle}</p>

        <div className="clip-hud mt-8 border-2 border-ink/15 bg-card p-6 shadow-book sm:p-8">{children}</div>
        <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
      </section>
    </div>
  );
}

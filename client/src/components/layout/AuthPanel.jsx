import { Mandala } from '../common/Icons';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
      <aside className="relative hidden overflow-hidden rounded-3xl bg-navy bg-jali-light p-10 text-cream lg:flex lg:flex-col lg:justify-between">
        <Mandala className="pointer-events-none absolute -bottom-24 -right-24 size-[26rem] animate-drift text-gold/30 motion-reduce:animate-none" />
        <div className="relative">
          <span lang="hi" className="font-devanagari text-lg text-gold">
            कथा
          </span>
          <p className="mt-6 font-display text-3xl leading-snug text-cream">
            Every festival, fort and folk tale is a story waiting to be told.
          </p>
        </div>
        <p className="relative text-sm text-cream/80">
          Preserving the past, inspiring the future &mdash; one katha at a time.
        </p>
      </aside>

      <section className="mx-auto w-full max-w-md self-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-charcoal-soft">{subtitle}</p>
        <div className="mt-8 rounded-2xl border border-gold/25 bg-white p-6 shadow-card sm:p-8">{children}</div>
        <p className="mt-6 text-center text-sm text-charcoal-soft">{footer}</p>
      </section>
    </div>
  );
}

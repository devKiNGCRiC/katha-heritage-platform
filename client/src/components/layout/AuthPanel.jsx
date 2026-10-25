import { Manuscript } from '../common/Icons';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
      <aside className="relative hidden overflow-hidden rounded-md bg-indigo bg-ink-grain p-10 text-parchment-light lg:flex lg:flex-col lg:justify-between">
        <Manuscript className="pointer-events-none absolute -bottom-16 -right-16 size-80 text-gold-leaf/25" />
        <div className="relative">
          <span lang="hi" className="font-devanagari text-lg text-gold-leaf">
            कथा
          </span>
          <p className="mt-6 font-display text-3xl leading-snug text-parchment-light">
            Every festival, fort and folk tale is a story waiting to be told.
          </p>
        </div>
        <p className="relative text-sm text-parchment-light/80">
          Preserving the past, inspiring the future &mdash; one katha at a time.
        </p>
      </aside>

      <section className="mx-auto w-full max-w-md self-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-ink-soft">{subtitle}</p>
        <div className="mt-8 rounded-md border border-ink/15 border-t-4 border-t-vermillion bg-parchment-light p-6 shadow-card sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
      </section>
    </div>
  );
}

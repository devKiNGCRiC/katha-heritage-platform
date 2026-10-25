import { Chakra } from '../common/Icons';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
      <aside className="relative hidden overflow-hidden rounded-lg border-[3px] border-ink bg-navy bg-halftone-light p-10 text-paper shadow-card lg:flex lg:flex-col lg:justify-between">
        <Chakra className="pointer-events-none absolute -bottom-20 -right-20 size-80 animate-spin-slow text-marigold/20 motion-reduce:animate-none" />
        <div className="relative">
          <span lang="hi" className="font-devanagari text-lg font-bold text-marigold">
            कथा
          </span>
          <p className="mt-6 font-display text-3xl font-semibold leading-snug text-paper">
            Every festival, fort and folk tale is a legend waiting to be told.
          </p>
        </div>
        <p className="relative text-sm text-paper/80">
          Preserving the past, inspiring the future &mdash; one katha at a time.
        </p>
      </aside>

      <section className="mx-auto w-full max-w-md self-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-ink/70">{subtitle}</p>
        <div className="mt-8 rounded-lg border-[3px] border-ink bg-paper-white p-6 shadow-card sm:p-8">{children}</div>
        <p className="mt-6 text-center text-sm text-ink/70">{footer}</p>
      </section>
    </div>
  );
}

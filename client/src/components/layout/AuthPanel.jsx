import { Chakra } from '../common/Icons';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <Chakra className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-astra/10 motion-reduce:animate-none" />

      <p lang="hi" className="font-devanagari text-3xl font-bold text-gold text-glow">
        कथा
      </p>
      <h1 className="mt-3 font-epic text-3xl font-bold text-mist sm:text-4xl">{title}</h1>
      <p className="mt-2 text-mist/70">{subtitle}</p>

      <div className="glass relative mt-8 w-full rounded-3xl p-6 text-left sm:p-8">{children}</div>
      <p className="relative mt-6 text-sm text-mist/70">{footer}</p>
    </div>
  );
}

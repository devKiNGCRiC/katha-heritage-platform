import { Chakra } from '../common/Icons';
import HudCorners from '../common/HudCorners';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <Chakra className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-teal/10 motion-reduce:animate-none" />

      <p lang="hi" className="font-devanagari text-3xl font-bold text-gold">
        कथा
      </p>
      <h1 className="mt-3 font-epic text-3xl font-bold text-fire sm:text-4xl">{title}</h1>
      <p className="mt-2 text-mist/70">{subtitle}</p>

      <div className="relative mt-8 w-full">
        <HudCorners color="text-teal" />
        <div className="clip-hud w-full border border-teal/25 bg-void/80 p-6 text-left backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
      <p className="relative mt-6 text-sm text-mist/70">{footer}</p>
    </div>
  );
}

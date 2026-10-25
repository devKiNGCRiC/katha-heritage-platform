import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Sunburst } from '../common/Icons';

const CHAPTERS = [
  {
    title: 'Stories',
    status: 'Coming first',
    bg: 'bg-saffron',
    text: 'text-ink',
    rotate: '-rotate-2',
    body: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    title: 'Community',
    status: 'Planned',
    bg: 'bg-crimson-deep',
    text: 'text-paper',
    rotate: 'rotate-2',
    body: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    title: 'Cultural Maps',
    status: 'Planned',
    bg: 'bg-navy',
    text: 'text-paper',
    rotate: '-rotate-2',
    body: 'Travel India on an interactive map of temples, forts and heritage sites, each with its own stories.',
  },
];

const PANEL_STYLES = [
  { bg: 'bg-saffron', text: 'text-ink', accent: 'text-navy' },
  { bg: 'bg-navy', text: 'text-paper', accent: 'text-marigold' },
  { bg: 'bg-crimson-deep', text: 'text-paper', accent: 'text-marigold' },
  { bg: 'bg-marigold', text: 'text-ink', accent: 'text-crimson-deep' },
];

const ROTATIONS = ['-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];

const CATEGORIES = [
  { name: 'Mythology', native: 'पुराण', text: 'Epics, deities and the tales that shaped belief.' },
  { name: 'History', native: 'इतिहास', text: 'Dynasties, movements and the people between the dates.' },
  { name: 'Folk Tales', native: 'लोक कथा', text: 'Regional stories carried by voice across generations.' },
  { name: 'Geography', native: 'भूगोल', text: 'Rivers, mountains and the meaning of place.' },
  { name: 'Architecture', native: 'वास्तुकला', text: 'Temples, forts and the craft behind them.' },
  { name: 'Festivals', native: 'उत्सव', text: 'Rituals, seasons and celebrations across the year.' },
  { name: 'Philosophy', native: 'दर्शन', text: 'Schools of thought and everyday wisdom.' },
];

function Hero({ user }) {
  return (
    <section className="relative overflow-hidden bg-navy bg-halftone-light text-paper">
      <Sunburst className="pointer-events-none absolute -right-32 top-1/2 size-[46rem] -translate-y-1/2 animate-spin-slow text-saffron/25 motion-reduce:animate-none lg:-right-16" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="max-w-2xl animate-rise">
          <p lang="hi" className="font-devanagari text-7xl font-bold leading-none text-marigold sm:text-8xl">
            कथा
          </p>

          <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-paper sm:text-5xl lg:text-6xl">
            Gods. Kings. Legends.
            <br />
            Every tale India has ever told.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85">
            KATHA gathers the myths, the empires and the folk legends whispered for centuries into one home for
            every story India has ever told.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {user ? (
              <>
                <p className="text-paper/90">
                  Welcome back, <strong className="font-bold text-marigold">{user.name}</strong>.
                </p>
                <Button as={Link} to={{ pathname: '/', hash: '#features' }} variant="light" size="large">
                  See what&rsquo;s coming
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" size="large">
                  Join KATHA
                </Button>
                <Button as={Link} to="/login" variant="light" size="large">
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
        The sagas begin
      </h2>
      <p className="mt-4 max-w-xl text-lg text-ink/70">
        Every great epic unfolds one chapter at a time. Here is what is opening first.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {CHAPTERS.map(({ title, status, bg, text, rotate, body }) => (
          <div
            key={title}
            className={`${rotate} ${bg} ${text} rounded-lg border-[3px] border-ink p-6 shadow-card transition-transform duration-300 hover:rotate-0`}
          >
            <span className="inline-block rounded border-2 border-ink bg-paper-white px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">
              {status}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
            <p className="mt-2 leading-relaxed opacity-90">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThemeIndex() {
  return (
    <section id="categories" className="bg-paper-white bg-halftone py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          Worlds within KATHA
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink/70">
          From the Ramayana to the republic &mdash; pick a world and step in.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ name, native, text }, index) => {
            const style = PANEL_STYLES[index % PANEL_STYLES.length];
            const rotate = ROTATIONS[index % ROTATIONS.length];
            return (
              <div
                key={name}
                className={`${rotate} ${style.bg} ${style.text} flex h-full flex-col rounded-lg border-[3px] border-ink p-5 shadow-card transition-transform duration-300 hover:rotate-0`}
              >
                <span lang="hi" className={`font-devanagari text-2xl font-bold ${style.accent}`}>
                  {native}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed opacity-90">{text}</p>
              </div>
            );
          })}
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-[3px] border-dashed border-ink/40 p-5 text-center">
            <p className="font-display text-lg font-bold text-ink">And more</p>
            <p className="mt-1.5 text-sm text-ink/60">New worlds open as the community grows.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-crimson-deep bg-halftone-light px-4 py-24 text-center text-paper sm:px-6">
      <Sunburst className="pointer-events-none absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-marigold/10 motion-reduce:animate-none" />
      <div className="relative">
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-paper sm:text-4xl">
          Become part of the legend
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-paper/85">
          Create a free account and help write the next chapter of India&rsquo;s story.
        </p>
        <div className="mt-8 flex justify-center">
          <Button as={Link} to="/register" variant="light" size="large">
            Join KATHA
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <title>KATHA — Indian Heritage Platform</title>
      <Hero user={user} />
      <Chapters />
      <ThemeIndex />
      {!user && <ClosingCta />}
    </>
  );
}

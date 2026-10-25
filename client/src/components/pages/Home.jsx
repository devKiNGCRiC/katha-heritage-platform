import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Manuscript } from '../common/Icons';

const FEATURES = [
  {
    title: 'Stories',
    status: 'Coming first',
    text: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    title: 'Community',
    status: 'Planned',
    text: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    title: 'Cultural Maps',
    status: 'Planned',
    text: 'Travel India on an interactive map of temples, forts and heritage sites, each with its own stories.',
  },
];

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
    <section className="relative overflow-hidden bg-indigo bg-ink-grain text-parchment-light">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
        <div className="animate-rise">
          <span lang="hi" className="font-devanagari text-lg text-gold-leaf">
            कथा
          </span>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.08] text-parchment-light sm:text-6xl lg:text-[3.6rem]">
            Before it was written, it was told.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-parchment-light/80">
            KATHA gathers India&rsquo;s myths, histories and folk tales &mdash; the ones once carried only by a
            storyteller&rsquo;s voice &mdash; into a home readers can return to.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {user ? (
              <>
                <p className="text-parchment-light/90">
                  Welcome back, <strong className="font-semibold text-gold-leaf">{user.name}</strong>.
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

        <div className="hidden justify-center lg:flex animate-rise [animation-delay:150ms]">
          <Manuscript className="h-auto w-72 text-gold-leaf/60" />
        </div>
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section id="features" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">Three chapters, opening in order</h2>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        KATHA is being written in the open. Each chapter opens once the one before it is ready.
      </p>

      <ul className="mt-12 divide-y divide-ink/15 border-y border-ink/15">
        {FEATURES.map(({ title, status, text }) => (
          <li
            key={title}
            className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <div className="sm:w-2/5">
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-0.5 text-sm font-medium text-vermillion">{status}</p>
            </div>
            <p className="max-w-md leading-relaxed text-ink-soft sm:w-3/5">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ThemeIndex() {
  return (
    <section id="categories" className="bg-parchment-deep bg-paper-grain">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">An index of themes</h2>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          From the epics to the everyday &mdash; every story finds its place here.
        </p>

        <ul className="mt-12 divide-y divide-ink/15 border-y border-ink/15">
          {CATEGORIES.map(({ name, native, text }) => (
            <li key={name} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="flex items-baseline gap-3 sm:w-2/5">
                <span lang="hi" className="font-devanagari text-xl font-semibold text-vermillion">
                  {native}
                </span>
                <span className="font-display text-lg font-semibold">{name}</span>
              </div>
              <p className="text-sm text-ink-soft sm:w-3/5">{text}</p>
            </li>
          ))}
          <li className="py-5 text-sm italic text-ink-soft">And more, as the community grows.</li>
        </ul>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-indigo-deep bg-ink-grain px-4 py-24 text-center text-parchment-light sm:px-6">
      <h2 className="font-display text-3xl font-semibold text-parchment-light sm:text-4xl">
        Be one of the first storytellers.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-lg text-parchment-light/80">
        Create a free account and help shape a home for India&rsquo;s stories.
      </p>
      <div className="mt-8 flex justify-center">
        <Button as={Link} to="/register" size="large">
          Join KATHA
        </Button>
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

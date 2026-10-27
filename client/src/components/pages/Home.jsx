import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import HudCorners from '../common/HudCorners';
import { Chakra, SpeedLines } from '../common/Icons';

const DEVANAGARI_NUMERALS = ['१', '२', '३'];

const CHAPTERS = [
  {
    title: 'Stories',
    status: 'Coming first',
    ring: 'text-ember',
    body: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    title: 'Community',
    status: 'Planned',
    ring: 'text-teal',
    body: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    title: 'Cultural Maps',
    status: 'Planned',
    ring: 'text-holo-violet',
    body: 'Travel India on an interactive map of temples, forts and heritage sites, each with its own stories.',
  },
];

const ACCENTS = ['text-ember', 'text-teal', 'text-holo-violet', 'text-gold'];

const CATEGORIES = [
  { name: 'Mythology', native: 'पुराण', text: 'Epics, deities and the tales that shaped belief.', feature: true },
  { name: 'History', native: 'इतिहास', text: 'Dynasties, movements and the people between the dates.' },
  { name: 'Folk Tales', native: 'लोक कथा', text: 'Regional stories carried by voice across generations.' },
  { name: 'Geography', native: 'भूगोल', text: 'Rivers, mountains and the meaning of place.' },
  { name: 'Architecture', native: 'वास्तुकला', text: 'Temples, forts and the craft behind them.' },
  { name: 'Festivals', native: 'उत्सव', text: 'Rituals, seasons and celebrations across the year.' },
  { name: 'Philosophy', native: 'दर्शन', text: 'Schools of thought and everyday wisdom.' },
];

function Hero({ user }) {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-24 sm:px-6">
      <SpeedLines className="pointer-events-none absolute left-1/2 top-1/2 size-[56rem] -translate-x-1/2 -translate-y-[58%] text-ember/25" />
      <div className="pointer-events-none absolute left-1/2 top-[40%] size-[28rem] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-ember/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center animate-rise">
        <div className="inline-block rounded-full bg-holo p-[2px] animate-holo">
          <span lang="hi" className="block rounded-full bg-void px-5 py-1.5 font-devanagari text-base font-bold text-gold">
            कथा
          </span>
        </div>

        <h1 className="mt-7 font-epic text-5xl font-bold leading-[1.08] text-fire sm:text-6xl lg:text-7xl">
          Step into a world where legends live.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist/75">
          KATHA is a portal into the Ramayana, the Mahabharata and a thousand forgotten tales &mdash; reborn for a
          new generation.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {user ? (
            <>
              <p className="text-mist/85">
                Welcome back, <strong className="font-bold text-gold">{user.name}</strong>.
              </p>
              <Button as={Link} to={{ pathname: '/', hash: '#features' }} variant="outline" size="large">
                See what&rsquo;s coming
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/register" size="large">
                Enter KATHA
              </Button>
              <Button as={Link} to="/login" variant="outline" size="large">
                Sign in
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="font-epic text-3xl font-bold text-mist sm:text-4xl">The sagas begin</h2>
      <p className="mt-4 max-w-xl text-lg text-mist/70">
        Every great epic unfolds one chapter at a time. Here is what is opening first.
      </p>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {CHAPTERS.map(({ title, status, ring, body }, index) => (
          <Card key={title} className="relative p-7">
            <HudCorners color={ring} />
            <div className={`clip-hud-sm flex size-11 items-center justify-center border border-current bg-void font-devanagari text-lg font-bold ${ring}`}>
              {DEVANAGARI_NUMERALS[index]}
            </div>
            <p className={`mt-5 text-xs font-bold uppercase tracking-[0.2em] ${ring}`}>{status}</p>
            <h3 className="mt-3 font-epic text-2xl font-bold text-mist">{title}</h3>
            <p className="mt-2 leading-relaxed text-mist/65">{body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ThemeIndex() {
  return (
    <section id="categories" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="font-epic text-3xl font-bold text-mist sm:text-4xl">Worlds within KATHA</h2>
      <p className="mt-4 max-w-xl text-lg text-mist/70">
        From the Ramayana to the republic &mdash; pick a world and step in.
      </p>

      <div className="mt-14 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map(({ name, native, text, feature }, index) => {
          const ring = ACCENTS[index % ACCENTS.length];
          return (
            <Card
              key={name}
              className={`flex flex-col p-6 transition-colors duration-300 hover:border-current ${ring} ${
                feature ? 'sm:col-span-2' : ''
              }`}
            >
              <span lang="hi" className={`font-devanagari text-2xl font-bold ${ring}`}>
                {native}
              </span>
              <h3 className="mt-1 font-epic text-lg font-bold text-mist">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist/60">{text}</p>
            </Card>
          );
        })}
        <div className="clip-hud flex flex-col items-center justify-center border border-dashed border-mist/25 p-6 text-center">
          <p className="font-epic text-lg font-bold text-mist/75">And more</p>
          <p className="mt-1.5 text-sm text-mist/50">New worlds open as the community grows.</p>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <Chakra className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-teal/10" />
      <div className="relative bg-holo p-[2px] animate-holo clip-hud">
        <div className="clip-hud border border-void bg-void/95 px-6 py-16 text-center sm:px-12">
          <h2 className="font-epic text-3xl font-bold text-fire sm:text-4xl">Become part of the legend</h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-mist/75">
            Create a free account and help write the next chapter of India&rsquo;s story.
          </p>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/register" size="large">
              Enter KATHA
            </Button>
          </div>
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

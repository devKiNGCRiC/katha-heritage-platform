import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { ArrowRightIcon, BookIcon, MapPinIcon, Mandala, UsersIcon } from '../common/Icons';

const FEATURES = [
  {
    title: 'Stories',
    status: 'Coming first',
    Icon: BookIcon,
    text: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    title: 'Community',
    status: 'Planned',
    Icon: UsersIcon,
    text: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    title: 'Cultural Maps',
    status: 'Planned',
    Icon: MapPinIcon,
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

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-deep">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-charcoal-soft">{intro}</p>}
    </div>
  );
}

function Hero({ user }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy bg-jali-light text-cream">
      <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 -translate-y-1/2 lg:right-0"
        aria-hidden="true"
      >
        <Mandala className="size-[42rem] animate-drift text-gold/25 motion-reduce:animate-none lg:text-gold/40" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="max-w-2xl animate-rise">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span lang="hi" className="font-devanagari text-base normal-case tracking-normal">
              कथा
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
            Indian Heritage Platform
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            Every heritage begins with a <em className="text-gradient-saffron pr-1 font-semibold">katha</em>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
            KATHA is a home for India&rsquo;s stories &mdash; mythology, history, folk tales and the places that hold
            them &mdash; told by people who love them.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {user ? (
              <>
                <p className="text-cream/90">
                  Welcome back, <strong className="font-semibold text-gold">{user.name}</strong>.
                </p>
                <Button as={Link} to={{ pathname: '/', hash: '#features' }} size="large">
                  See what&rsquo;s coming
                  <ArrowRightIcon className="size-5" />
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" size="large">
                  Join KATHA
                  <ArrowRightIcon className="size-5" />
                </Button>
                <Button as={Link} to="/login" variant="light" size="large">
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-linear-to-r from-saffron via-gold to-leaf" aria-hidden="true" />
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Explore"
        title="Three doors into a living heritage"
        intro="KATHA is being built in the open, one door at a time. Here is what is opening, in order."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ title, status, Icon, text }) => (
          <Card key={title} className="p-7 transition-shadow duration-300 hover:shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
                <Icon className="size-6" />
              </span>
              <span className="rounded-full bg-gold/30 px-2.5 py-0.5 text-xs font-semibold text-navy-dark">
                {status}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
            <p className="mt-2 leading-relaxed text-charcoal-soft">{text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="bg-parchment bg-jali">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Themes"
          title="Explore India by theme"
          intro="From the epics to the everyday, every story finds its place."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ name, native, text }) => (
            <li key={name}>
              <Card className="h-full p-6">
                <p lang="hi" className="font-devanagari text-2xl font-bold text-saffron-deep">
                  {native}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{text}</p>
              </Card>
            </li>
          ))}
          <li>
            <div className="flex h-full flex-col justify-center rounded-2xl border-2 border-dashed border-navy/30 p-6 text-center">
              <p className="font-display text-lg font-bold text-navy">And many more</p>
              <p className="mt-1.5 text-sm text-charcoal-soft">New themes will appear as the community grows.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-navy bg-jali-light px-6 py-14 text-center text-cream sm:px-12">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">Be among the first storytellers</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/85">
            Create your free account today and help shape a home for India&rsquo;s stories.
          </p>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/register" size="large">
              Join KATHA
              <ArrowRightIcon className="size-5" />
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
      <Hero user={user} />
      <Features />
      <Categories />
      {!user && <ClosingCta />}
    </>
  );
}

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Chakra } from '../common/Icons';

const CHAPTERS = [
  {
    number: '1',
    title: 'Stories',
    status: 'Coming first',
    accent: 'text-terracotta',
    badge: 'bg-terracotta',
    image: '/art/arjuna-subhadra.jpg',
    ratio: '497 / 754',
    caption: 'Arjuna and Subhadra',
    body: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    number: '2',
    title: 'Community',
    status: 'Planned',
    accent: 'text-forest',
    badge: 'bg-forest',
    image: '/art/draupadi-pandavas.jpg',
    ratio: '904 / 1231',
    caption: 'Draupadi and the Pandavas',
    body: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    number: '3',
    title: 'Cultural Maps',
    status: 'Planned',
    accent: 'text-gold-deep',
    badge: 'bg-gold',
    image: '/art/shiva-ascetic.jpg',
    ratio: '741 / 1026',
    caption: 'Shiva as an Ascetic',
    body: 'Travel India on an interactive map of temples, forts and heritage sites, each with its own stories.',
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
    <section className="bg-paper bg-paper-grain">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="animate-rise">
          <span lang="hi" className="inline-block rounded-md bg-gold/20 px-4 py-1.5 font-devanagari text-base font-bold text-gold-deep">
            कथा
          </span>

          <h1 className="mt-6 font-epic text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Step into a world where <span className="text-fire">legends</span> live.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            KATHA is a home for readers and writers of India&rsquo;s stories &mdash; the Ramayana, the Mahabharata
            and a thousand folk tales, gathered in one place and reborn for a new generation.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {user ? (
              <>
                <p className="text-ink">
                  Welcome back, <strong className="font-bold text-terracotta">{user.name}</strong>.
                </p>
                <Button as={Link} to={{ pathname: '/', hash: '#features' }} variant="outline" size="large">
                  See what&rsquo;s coming
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" size="large">
                  Start reading
                </Button>
                <Button as={Link} to="/login" variant="outline" size="large">
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div
            className="overflow-hidden rounded-lg border-2 border-ink/15 bg-card shadow-book"
            style={{ aspectRatio: '1200 / 1600' }}
          >
            <img
              src="/art/krishna-envoy.jpg"
              alt="Raja Ravi Varma, Krishna as Envoy &mdash; Krishna pleading for peace before the Kurukshetra war"
              className="size-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">
            Raja Ravi Varma, &ldquo;Krishna as Envoy&rdquo; &mdash; public domain
          </p>
        </div>
      </div>
    </section>
  );
}

function Chapters() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="font-epic text-3xl font-bold sm:text-4xl">The sagas begin</h2>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Every great epic unfolds one chapter at a time. Here is what is opening first.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {CHAPTERS.map(({ number, title, status, accent, badge, image, ratio, caption, body }) => (
          <article key={title} className="overflow-hidden rounded-lg border-2 border-ink/15 bg-card shadow-book">
            <div className="relative" style={{ aspectRatio: ratio }}>
              <img src={image} alt={`Raja Ravi Varma, ${caption}`} className="size-full object-cover" />
              <span
                className={`absolute left-3 top-3 flex size-9 items-center justify-center rounded-md border-2 border-ink/15 font-epic text-base font-bold text-paper ${badge}`}
              >
                {number}
              </span>
            </div>
            <div className="p-6">
              <p className={`text-xs font-bold uppercase tracking-[0.18em] ${accent}`}>{status}</p>
              <h3 className="mt-2 font-epic text-xl font-bold">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ThemeIndex() {
  return (
    <section id="categories" className="bg-paper-deep bg-paper-grain">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-epic text-3xl font-bold sm:text-4xl">Worlds within KATHA</h2>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          From the Ramayana to the republic &mdash; pick a world and step in.
        </p>

        <ul className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
          {CATEGORIES.map(({ name, native, text }) => (
            <li key={name} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="flex items-baseline gap-3 sm:w-2/5">
                <span lang="hi" className="font-devanagari text-2xl font-bold text-terracotta">
                  {native}
                </span>
                <span className="font-epic text-lg font-bold">{name}</span>
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
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="grid overflow-hidden rounded-lg border-2 border-ink/15 bg-card shadow-book md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative hidden md:block" style={{ aspectRatio: '420 / 621' }}>
          <img
            src="/art/hero-kiratarjuniya.jpg"
            alt="Raja Ravi Varma, Kiratarjuniya &mdash; Arjuna in combat with Shiva disguised as a hunter"
            className="size-full object-cover"
          />
        </div>
        <div className="relative flex flex-col justify-center overflow-hidden bg-leather bg-leather-glow px-6 py-14 text-center sm:px-10">
          <Chakra className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 text-paper/[0.07]" />
          <div className="relative">
            <h2 className="font-epic text-2xl font-bold text-paper sm:text-3xl">Become part of the legend</h2>
            <p className="mx-auto mt-4 max-w-sm text-paper/80">
              Create a free account and help write the next chapter of India&rsquo;s story.
            </p>
            <div className="mt-7 flex justify-center">
              <Button as={Link} to="/register" size="large">
                Start reading
              </Button>
            </div>
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

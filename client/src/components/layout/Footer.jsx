import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Chakra, GithubIcon, InstagramIcon, LinkedinIcon } from '../common/Icons';
import Logo from '../common/Logo';

const YEAR = new Date().getFullYear();

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/devKiNGCRiC', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajroy28/', Icon: LinkedinIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/devkingcric', Icon: InstagramIcon },
];

const LINK = 'underline-offset-4 transition-colors hover:text-gold hover:underline';

export default function Footer() {
  const user = useSelector((state) => state.auth.user);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 pt-14">
      <Chakra className="pointer-events-none absolute -right-20 -top-20 size-64 animate-spin-slow text-astra/10" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="size-10 drop-shadow-[0_0_10px_rgb(255_211_110_/_0.5)]" />
            <span className="font-epic text-xl font-bold tracking-wide text-mist">KATHA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist/70">
            Gods, kings and storytellers &mdash; a portal into India&rsquo;s greatest legends.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold text-gold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-mist/75">
            <li>
              <Link to={{ pathname: '/', hash: '#features' }} className={LINK}>
                The sagas
              </Link>
            </li>
            <li>
              <Link to={{ pathname: '/', hash: '#categories' }} className={LINK}>
                Themes
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link to="/login" className={LINK}>
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={LINK}>
                    Join KATHA
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-gold">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-mist/75">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${LINK}`}>
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:kingraj28roy@gmail.com" className={LINK}>
                kingraj28roy@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-mist/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {YEAR} KATHA, built by Raj Roy (KiNG) for the RKC_BHARAT Initiative.</p>
          <p className="font-devanagari text-sm font-semibold text-gold" lang="hi">
            जय हिन्द
          </p>
        </div>
      </div>
    </footer>
  );
}

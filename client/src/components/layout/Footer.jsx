import { Link } from 'react-router-dom';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../common/Icons';
import Logo from '../common/Logo';

const YEAR = new Date().getFullYear();

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/devKiNGCRiC', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajroy28/', Icon: LinkedinIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/devkingcric', Icon: InstagramIcon },
];

const LINK = 'underline-offset-4 transition-colors hover:text-gold hover:underline';

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream/85">
      <div className="h-1 bg-linear-to-r from-saffron via-gold to-leaf" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="size-10" />
            <span className="font-display text-2xl font-bold tracking-wide text-cream">KATHA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Preserving the past, inspiring the future — one katha at a time.
          </p>
        </div>

        <nav aria-label="Footer explore">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to={{ pathname: '/', hash: '#features' }} className={LINK}>
                What we&rsquo;re building
              </Link>
            </li>
            <li>
              <Link to={{ pathname: '/', hash: '#categories' }} className={LINK}>
                Themes
              </Link>
            </li>
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
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
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

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            &copy; {YEAR} KATHA. Built with care by Raj Roy (KiNG) &middot; RKC_BHARAT Initiative.
          </p>
          <p className="font-devanagari text-sm text-gold" lang="hi">
            जय हिन्द
          </p>
        </div>
      </div>
    </footer>
  );
}

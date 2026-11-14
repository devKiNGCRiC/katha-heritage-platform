import { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function readHashTarget(hash) {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

export default function Layout() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduceMotion ? 'auto' : 'smooth';

    if (hash) {
      const target = readHashTarget(hash);
      if (target) {
        target.scrollIntoView({ behavior });
        return;
      }
    }
    // Back/Forward: let the browser restore the previous scroll position.
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key, navigationType]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md border-2 border-ink bg-card focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

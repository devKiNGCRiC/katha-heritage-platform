import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from '../common/Button';
import { CloseIcon, MenuIcon } from '../common/Icons';
import Logo from '../common/Logo';

const NAV_BASE = 'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:text-gold';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
  };

  const links = (
    <>
      <NavLink
        to="/"
        end
        onClick={closeMenu}
        className={({ isActive }) => `${NAV_BASE} ${isActive ? 'text-gold' : 'text-mist/80'}`}
      >
        Home
      </NavLink>
      <Link to={{ pathname: '/', hash: '#features' }} onClick={closeMenu} className={`${NAV_BASE} text-mist/80`}>
        Chapters
      </Link>
      <Link to={{ pathname: '/', hash: '#categories' }} onClick={closeMenu} className={`${NAV_BASE} text-mist/80`}>
        Themes
      </Link>
    </>
  );

  const authActions = user ? (
    <>
      <span className="max-w-[9rem] truncate text-sm font-semibold text-mist" title={user.name}>
        {user.name}
      </span>
      <Button variant="outline" size="small" onClick={handleLogout}>
        Log out
      </Button>
    </>
  ) : (
    <>
      <Button as={Link} to="/login" variant="ghost" size="small" onClick={closeMenu}>
        Sign in
      </Button>
      <Button as={Link} to="/register" size="small" onClick={closeMenu}>
        Join KATHA
      </Button>
    </>
  );

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="glass relative flex h-16 items-center justify-between gap-4 rounded-full px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="KATHA home">
          <Logo className="size-9 drop-shadow-[0_0_10px_rgb(255_211_110_/_0.55)]" />
          <span className="font-epic text-xl font-bold tracking-wide text-mist">KATHA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links}
        </nav>

        <div className="hidden items-center gap-3 md:flex">{authActions}</div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-mist hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>

        {open && (
          <div id="mobile-menu" className="glass absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl p-4 md:hidden">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links}
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white/15 pt-3">{authActions}</div>
          </div>
        )}
      </div>
    </header>
  );
}

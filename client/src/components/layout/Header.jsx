import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from '../common/Button';
import { CloseIcon, MenuIcon } from '../common/Icons';
import Logo from '../common/Logo';

const NAV_BASE = 'rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-saffron-deep';

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
        className={({ isActive }) => `${NAV_BASE} ${isActive ? 'text-saffron-deep' : 'text-navy'}`}
      >
        Home
      </NavLink>
      <Link to={{ pathname: '/', hash: '#features' }} onClick={closeMenu} className={`${NAV_BASE} text-navy`}>
        Explore
      </Link>
      <Link to={{ pathname: '/', hash: '#categories' }} onClick={closeMenu} className={`${NAV_BASE} text-navy`}>
        Themes
      </Link>
    </>
  );

  const authActions = user ? (
    <>
      <span className="max-w-[9rem] truncate text-sm font-semibold text-charcoal" title={user.name}>
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
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="KATHA home">
          <Logo className="size-9" />
          <span className="font-display text-2xl font-bold tracking-wide text-navy">KATHA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links}
        </nav>

        <div className="hidden items-center gap-3 md:flex">{authActions}</div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg text-navy hover:bg-navy/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-navy/10 bg-cream md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 border-t border-navy/10 px-4 py-4 sm:px-6">
            {authActions}
          </div>
        </div>
      )}
    </header>
  );
}

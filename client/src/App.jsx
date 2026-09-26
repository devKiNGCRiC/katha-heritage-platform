import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from './components/common/Logo';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import NotFound from './components/pages/NotFound';
import Register from './components/pages/Register';

function FullPageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-14 animate-pulse motion-reduce:animate-none" />
        <p className="text-sm font-medium text-charcoal-soft">Loading KATHA&hellip;</p>
      </div>
    </div>
  );
}

export default function App() {
  const initializing = useSelector((state) => state.auth.initializing);

  if (initializing) return <FullPageLoader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

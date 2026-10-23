import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'login' | 'signup';

function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (pathname === '/login' || hash === '#login') {
    return 'login';
  }
  if (pathname === '/signup' || hash === '#signup') {
    return 'signup';
  }

  return 'home';
}

export function useAppRouter() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // Support both pathnames (/login, /signup, /) and hashes (#login, #signup, #home)
    const normalized = to.toLowerCase();

    if (normalized === '/login' || normalized === '#login') {
      window.history.pushState({}, '', '/login');
      setRoute('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/signup' || normalized === '#signup') {
      window.history.pushState({}, '', '/signup');
      setRoute('signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/' || normalized === '#home') {
      window.history.pushState({}, '', '/');
      setRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (to.startsWith('#')) {
      // Anchor link on home page
      window.history.pushState({}, '', '/' + to);
      setRoute('home');
      const el = document.querySelector(to);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.history.pushState({}, '', to);
      setRoute(getCurrentRoute());
    }
  }, []);

  return { route, navigate };
}

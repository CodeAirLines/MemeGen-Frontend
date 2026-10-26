import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | 'home'
  | 'login'
  | 'signup'
  | 'editor'
  | 'profile'
  | 'drafts'
  | 'gif-generator';

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
  if (pathname === '/editor' || hash === '#editor' || pathname.startsWith('/editor')) {
    return 'editor';
  }
  if (pathname === '/profile' || hash === '#profile' || pathname.startsWith('/profile')) {
    return 'profile';
  }
  if (pathname === '/drafts' || hash === '#drafts' || pathname.startsWith('/drafts')) {
    return 'drafts';
  }
  if (
    pathname === '/gif-maker' ||
    hash === '#gif-maker' ||
    pathname === '/gif-generator' ||
    hash === '#gif-generator' ||
    pathname.startsWith('/gif-')
  ) {
    return 'gif-generator';
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

  const navigate = useCallback((to: string, options?: { preserveScroll?: boolean }) => {
    if (typeof window === 'undefined') return;

    // Support pathnames (/login, /signup, /editor, /profile, /drafts, /) and hashes (#login, #signup, #editor, #profile, #drafts, #home)
    const normalized = to.toLowerCase();
    const shouldScroll = !options?.preserveScroll;

    if (normalized === '/login' || normalized === '#login') {
      window.history.pushState({}, '', '/login');
      setRoute('login');
      // Do not scroll to top when opening authentication modal over the page
    } else if (normalized === '/signup' || normalized === '#signup') {
      window.history.pushState({}, '', '/signup');
      setRoute('signup');
      // Do not scroll to top when opening authentication modal over the page
    } else if (normalized === '/editor' || normalized === '#editor' || normalized.startsWith('/editor')) {
      window.history.pushState({}, '', '/editor');
      setRoute('editor');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/profile' || normalized === '#profile' || normalized.startsWith('/profile')) {
      window.history.pushState({}, '', '/profile');
      setRoute('profile');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/drafts' || normalized === '#drafts' || normalized.startsWith('/drafts')) {
      window.history.pushState({}, '', '/drafts');
      setRoute('drafts');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/gif-maker' ||
      normalized === '#gif-maker' ||
      normalized === '/gif-generator' ||
      normalized === '#gif-generator' ||
      normalized.startsWith('/gif-')
    ) {
      window.history.pushState({}, '', '/gif-maker');
      setRoute('gif-generator');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/' || normalized === '#home') {
      window.history.pushState({}, '', '/');
      setRoute('home');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
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

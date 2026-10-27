import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Menu, X, User, Bookmark, LogOut, ChevronDown } from 'lucide-react';
import { MAIN_NAV_LINKS } from '../../constants/navigation';
import { SearchInput } from '../ui/SearchInput';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { useProfileStore } from '../../stores/useProfileStore';
import { useAuthStore } from '../../stores/useAuthStore';

export interface HeaderProps {
  onNavigate?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchQuery = useTemplateStore((state) => state.searchQuery);
  const setSearchQuery = useTemplateStore((state) => state.setSearchQuery);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUser = useAuthStore((state) => state.user);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);
  const logout = useAuthStore((state) => state.logout);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const templatesElem = document.getElementById('templates');
      if (templatesElem) {
        templatesElem.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeHash, setActiveHash] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash;
    }
    return '#home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  const handleHomeNavigation = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.preventDefault();
      setActiveHash('#home');
      closeMobileMenu();
      if (onNavigate) {
        onNavigate('#home');
      } else {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
          const homeEl = document.getElementById('home');
          if (homeEl) {
            homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [closeMobileMenu, onNavigate]
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Keyboard accessibility & body scroll lock for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);


  return (
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 w-full px-2.5 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      {/* Floating Island Container */}
      <div
        className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl lg:rounded-full bg-[#071330]/85 backdrop-blur-xl border transition-all duration-300 px-3 sm:px-6 ${
          isScrolled
            ? 'py-2 sm:py-2.5 border-blue-500/30 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.25)] bg-[#071330]/90'
            : 'py-2 sm:py-3.5 border-white/15 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(37,99,235,0.15)] hover:border-blue-400/35 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(6,182,212,0.2)]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 xl:gap-4 min-w-0">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-2.5 xl:gap-6 min-w-0 shrink-0">
            {/* Logo - logo.png only */}
            <a
              href="#home"
              onClick={handleHomeNavigation}
              className="flex items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 select-none py-0.5 shrink-0"
              aria-label="MemeHub Home"
            >
              <img
                src="/logo.png"
                alt="MemeHub"
                className="h-7 sm:h-9 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(37,99,235,0.45)] group-hover:drop-shadow-[0_4px_22px_rgba(6,182,212,0.7)] transition-all duration-300"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0" aria-label="Main navigation">
              {MAIN_NAV_LINKS.map((link) => {
                const isActive = (activeHash === link.href) || (!activeHash && link.href === '#home');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '#home' || link.label === 'Home') {
                        handleHomeNavigation(e);
                        return;
                      }
                      setActiveHash(link.href);
                      if (link.href === '#gif-maker' && onNavigate) {
                        e.preventDefault();
                        onNavigate('/gif-maker');
                      } else if (onNavigate && link.href.startsWith('#')) {
                        e.preventDefault();
                        onNavigate(link.href);
                      }
                    }}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/15 shadow-xs font-semibold'
                        : 'text-slate-200 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Notifications, Auth */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Search Input Component */}
            <div className={isAuthenticated ? 'w-32 lg:w-40 xl:w-56 2xl:w-64 transition-all duration-200' : 'w-44 lg:w-56 xl:w-64 2xl:w-72 transition-all duration-200'}>
              <SearchInput
                variant="dark"
                shape="pill"
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                onKeyDown={handleSearchSubmit}
                placeholder="Search memes, templates..."
                aria-label="Search memes and templates"
              />
            </div>

            {/* Notification Bell */}
            <IconButton
              variant="dark"
              size="sm"
              aria-label="View notifications"
              className="hover:text-cyan-300 text-slate-300 shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
            </IconButton>

            {/* Authenticated Controls: My Drafts & Instagram-style Profile Menu */}
            {isAuthenticated ? (
              <>
                {/* My Drafts Link */}
                <a
                  href="#drafts"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/drafts');
                    }
                  }}
                  className="text-xs font-semibold text-slate-200 hover:text-white px-2 xl:px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                  title="My Saved Drafts"
                >
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">Drafts</span>
                </a>

                {/* Profile Avatar Dropdown Entry */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 cursor-pointer group shrink-0 select-none"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User profile menu"
                  >
                    <div className="w-6.5 h-6.5 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-xs flex items-center justify-center bg-slate-800">
                      <img
                        src={profile?.avatarUrl || authUser?.avatarUrl || '/Profille/no-dp_16.webp'}
                        alt={profile?.displayName || authUser?.fullName || 'User'}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
                        }}
                      />
                    </div>
                    <span className="hidden lg:inline text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[80px] xl:max-w-[110px] whitespace-nowrap">
                      {profile?.displayName?.split(' ')[0] ||
                        authUser?.fullName?.split(' ')[0] ||
                        'Profile'}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                        profileDropdownOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileDropdownOpen(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#071330]/95 backdrop-blur-xl border border-white/15 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        {/* User Header */}
                        <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/15 flex items-center justify-center bg-slate-800">
                            <img
                              src={profile?.avatarUrl || authUser?.avatarUrl || '/Profille/no-dp_16.webp'}
                              alt=""
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-white truncate">
                              {profile?.displayName || authUser?.fullName || 'Meme Creator'}
                            </div>
                            <div className="text-xs text-cyan-400 truncate">
                              @{profile?.username || authUser?.email.split('@')[0] || 'creator'}
                            </div>
                            {isDemoMode && (
                              <span className="inline-block mt-0.5 text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-md">
                                Demo Creator Account
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Navigation items */}
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              if (onNavigate) onNavigate('/profile');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                          >
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>My Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              if (onNavigate) onNavigate('/drafts');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                          >
                            <Bookmark className="w-4 h-4 text-cyan-400" />
                            <span>My Saved Drafts</span>
                          </button>
                        </div>

                        {/* Logout item */}
                        <div className="pt-1 border-t border-white/10">
                          <button
                            type="button"
                            onClick={async () => {
                              setProfileDropdownOpen(false);
                              await logout();
                              if (onNavigate) onNavigate('/');
                              useTemplateStore.getState().setNotification({
                                type: 'info',
                                message: 'You have been logged out.',
                              });
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4 text-rose-400" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated: Log In */}
                <a
                  href="#login"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/login');
                    }
                  }}
                  className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  Log In
                </a>

                {/* Unauthenticated: Sign Up */}
                <a
                  href="#signup"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/signup');
                    }
                  }}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-md shadow-blue-600/30 hover:shadow-cyan-500/30 font-semibold"
                  >
                    Sign Up
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <IconButton
              variant="dark"
              size="md"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Floating Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="pointer-events-auto fixed inset-0 bg-slate-950/60 backdrop-blur-xs lg:hidden z-40 transition-opacity animate-in fade-in duration-200"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            id="mobile-navigation-drawer"
            role="navigation"
            aria-label="Mobile navigation"
            className="pointer-events-auto relative z-50 lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-[#071330]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain pb-safe"
          >
            {/* Mobile Brand Row */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <a
                href="#home"
                onClick={handleHomeNavigation}
                className="inline-block py-0.5 cursor-pointer"
                aria-label="MemeHub Home"
              >
                <img src="/logo.png" alt="MemeHub" className="h-7.5 w-auto object-contain" />
              </a>
              <IconButton
                variant="dark"
                size="sm"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="rounded-lg text-slate-400 hover:text-white min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Mobile Search */}
            <div>
              <SearchInput
                variant="dark"
                shape="rounded"
                size="md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                onKeyDown={handleSearchSubmit}
                placeholder="Search memes, templates..."
                aria-label="Mobile search memes and templates"
              />
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-1">
              {MAIN_NAV_LINKS.map((link) => {
                const isActive = (activeHash === link.href) || (!activeHash && link.href === '#home');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '#home' || link.label === 'Home') {
                        handleHomeNavigation(e);
                        return;
                      }
                      setActiveHash(link.href);
                      closeMobileMenu();
                      if (link.href === '#gif-maker' && onNavigate) {
                        e.preventDefault();
                        onNavigate('/gif-maker');
                      } else if (onNavigate && link.href.startsWith('#')) {
                        e.preventDefault();
                        onNavigate(link.href);
                      }
                    }}
                    className={`px-3.5 py-3 text-sm font-medium rounded-xl transition-colors min-h-[44px] flex items-center ${
                      isActive
                        ? 'bg-blue-600/25 text-cyan-300 font-semibold border-l-3 border-cyan-400 pl-3'
                        : 'text-slate-200 hover:text-cyan-300 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              {/* Authenticated User in Mobile Drawer */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="px-3.5 py-2.5 flex items-center gap-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/15 flex items-center justify-center bg-slate-800 shadow-xs">
                      <img
                        src={profile?.avatarUrl || authUser?.avatarUrl || '/Profille/no-dp_16.webp'}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/Profille/no-dp_16.webp';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">
                        {profile?.displayName || authUser?.fullName || 'Meme Creator'}
                      </p>
                      <p className="text-xs text-cyan-400 truncate">
                        @{profile?.username || authUser?.email.split('@')[0] || 'creator'}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#profile"
                    onClick={(e) => {
                      closeMobileMenu();
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('/profile');
                      }
                    }}
                    className="px-3.5 py-3 text-sm font-medium rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-white/10 flex items-center gap-2.5 min-h-[44px]"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </a>
                  <a
                    href="#drafts"
                    onClick={(e) => {
                      closeMobileMenu();
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('/drafts');
                      }
                    }}
                    className="px-3.5 py-3 text-sm font-medium rounded-xl text-slate-200 hover:text-cyan-300 hover:bg-white/10 flex items-center gap-2.5 min-h-[44px]"
                  >
                    <Bookmark className="w-4 h-4 text-cyan-400" />
                    <span>My Drafts</span>
                  </a>

                  <button
                    type="button"
                    onClick={async () => {
                      closeMobileMenu();
                      await logout();
                      if (onNavigate) onNavigate('/');
                      useTemplateStore.getState().setNotification({
                        type: 'info',
                        message: 'You have been logged out.',
                      });
                    }}
                    className="w-full px-3.5 py-3 text-sm font-medium rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 flex items-center gap-2.5 min-h-[44px] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated Mobile Auth Buttons */
                <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                  <a
                    href="#login"
                    onClick={(e) => {
                      closeMobileMenu();
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('/login');
                      }
                    }}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-slate-200 border border-white/15 rounded-xl hover:bg-white/10 transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Log In
                  </a>
                  <a
                    href="#signup"
                    onClick={(e) => {
                      closeMobileMenu();
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('/signup');
                      }
                    }}
                    className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-600/30 min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

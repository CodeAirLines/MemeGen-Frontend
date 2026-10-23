import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { MAIN_NAV_LINKS } from '../../constants/navigation';
import { SearchInput } from '../ui/SearchInput';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { useTemplateStore } from '../../stores/useTemplateStore';

export interface HeaderProps {
  onNavigate?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchQuery = useTemplateStore((state) => state.searchQuery);
  const setSearchQuery = useTemplateStore((state) => state.setSearchQuery);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

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

  return (
    <header className="fixed top-2.5 sm:top-4 inset-x-0 z-50 w-full px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      {/* Floating Island Container */}
      <div
        className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl lg:rounded-full bg-[#071330]/85 backdrop-blur-xl border transition-all duration-300 px-3.5 sm:px-6 ${
          isScrolled
            ? 'py-2 sm:py-2.5 border-blue-500/30 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.25)] bg-[#071330]/90'
            : 'py-2.5 sm:py-3.5 border-white/15 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(37,99,235,0.15)] hover:border-blue-400/35 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(6,182,212,0.2)]'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-4 xl:gap-7">
            {/* Logo - logo.png only */}
            <a
              href="#home"
              onClick={() => setActiveHash('#home')}
              className="flex items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 select-none py-0.5"
              aria-label="MemeHub Home"
            >
              <img
                src="/logo.png"
                alt="MemeHub"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(37,99,235,0.45)] group-hover:drop-shadow-[0_4px_22px_rgba(6,182,212,0.7)] transition-all duration-300"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main navigation">
              {MAIN_NAV_LINKS.map((link) => {
                const isActive = (activeHash === link.href) || (!activeHash && link.href === '#home');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setActiveHash(link.href)}
                    className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 ${
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
          <div className="hidden md:flex items-center gap-3">
            {/* Search Input Component */}
            <div className="w-52 lg:w-64 xl:w-72">
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
              className="hover:text-cyan-300 text-slate-300"
            >
              <Bell className="w-3.5 h-3.5" />
            </IconButton>

            {/* Log In */}
            <a
              href="#login"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/login');
                }
              }}
              className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Log In
            </a>

            {/* Sign Up */}
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
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <IconButton
              variant="dark"
              size="md"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded-xl"
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
            className="pointer-events-auto fixed inset-0 bg-slate-950/60 backdrop-blur-xs md:hidden z-40 transition-opacity animate-in fade-in duration-200"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            id="mobile-navigation-drawer"
            role="navigation"
            aria-label="Mobile navigation"
            className="pointer-events-auto relative z-50 md:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-[#071330]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-200"
          >
            {/* Mobile Brand Row */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <a
                href="#home"
                onClick={() => {
                  setActiveHash('#home');
                  closeMobileMenu();
                }}
                className="inline-block py-0.5"
              >
                <img src="/logo.png" alt="MemeHub" className="h-7.5 w-auto object-contain" />
              </a>
              <IconButton
                variant="dark"
                size="sm"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="rounded-lg text-slate-400 hover:text-white"
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
                    onClick={() => {
                      setActiveHash(link.href);
                      closeMobileMenu();
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
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="pt-2 flex items-center gap-3">
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
          </div>
        </>
      )}
    </header>
  );
};

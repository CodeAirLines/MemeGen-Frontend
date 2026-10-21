import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { MAIN_NAV_LINKS } from '../../constants/navigation';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2.5 group cursor-pointer hover:scale-102 active:scale-95 transition-transform duration-200"
              aria-label="MemeHub Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 text-white font-extrabold text-xl tracking-tighter group-hover:rotate-6 group-hover:scale-105 group-hover:bg-blue-500 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path d="M4 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v7.5l2.5-3 2.5 3V5a1 1 0 0 1 1-1H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1v-6l-2.5 3-2.5-3v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                MemeHub
              </span>
            </a>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main navigation">
              {MAIN_NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Search, Notifications, Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Input Pill */}
            <div className="relative w-56 lg:w-64 xl:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search memes, templates..."
                className="w-full bg-white/5 hover:bg-white/10 text-white placeholder-slate-400 text-xs rounded-full pl-8 pr-8 py-2 border border-white/10 hover:border-blue-400/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <kbd className="text-[10px] text-slate-400 bg-blue-950/60 px-1.5 py-0.5 rounded-md border border-blue-700/40 font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* Log In */}
            <a
              href="#login"
              className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Log In
            </a>

            {/* Sign Up */}
            <a href="#signup">
              <button
                type="button"
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 hover:scale-105 active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-all duration-200 shadow-md shadow-blue-600/40 hover:shadow-lg hover:shadow-cyan-500/40 cursor-pointer"
              >
                Sign Up
              </button>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-[#071330]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search memes, templates..."
              className="w-full bg-[#0f245c] text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-blue-800/60"
            />
          </div>

          <nav className="flex flex-col space-y-1">
            {MAIN_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-white/10 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="#login"
              onClick={closeMobileMenu}
              className="flex-1 text-center py-2.5 text-sm font-medium text-slate-200 border border-white/15 rounded-xl hover:bg-white/10 transition-colors"
            >
              Log In
            </a>
            <a
              href="#signup"
              onClick={closeMobileMenu}
              className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-600/30"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

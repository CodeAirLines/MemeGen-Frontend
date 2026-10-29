import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import {
  FOOTER_PRODUCT_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_RESOURCES_LINKS,
} from '../../constants/navigation';
import { Container } from '../ui/Container';
import { IconButton } from '../ui/IconButton';

export interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12 mt-auto">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-14 border-b border-slate-100">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center">
              <a
                href="#home"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('#home');
                  }
                }}
                className="inline-block group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
                aria-label="MemeHub Home"
              >
                <img
                  src="/logo.png"
                  alt="MemeHub"
                  className="h-9 sm:h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(37,99,235,0.2)] group-hover:drop-shadow-[0_4px_16px_rgba(6,182,212,0.45)] transition-all duration-200"
                />
              </a>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Make memes. Share happiness. The easiest and most powerful visual meme engine for creators everywhere.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8.5 h-8.5 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="#twitter"
                aria-label="X Twitter"
                className="w-8.5 h-8.5 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8.5 h-8.5 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8.5 h-8.5 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-600 hover:border-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Product</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (onNavigate) {
                        if (link.href === '#create') {
                          e.preventDefault();
                          onNavigate('/editor');
                        } else if (link.href === '#drafts') {
                          e.preventDefault();
                          onNavigate('/drafts');
                        } else if (link.href === '#profile') {
                          e.preventDefault();
                          onNavigate('/profile');
                        } else if (link.href === '#gif-maker') {
                          e.preventDefault();
                          onNavigate('/gif-maker');
                        } else if (link.href === '#community' || link.href === '#explore') {
                          e.preventDefault();
                          onNavigate('/community');
                        } else if (link.href === '#pricing') {
                          e.preventDefault();
                          onNavigate('/pricing');
                        } else if (link.href.startsWith('#')) {
                          e.preventDefault();
                          onNavigate(link.href);
                        }
                      }
                    }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Company</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (onNavigate && link.href.startsWith('#')) {
                        e.preventDefault();
                        onNavigate(link.href);
                      }
                    }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Resources</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_RESOURCES_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (onNavigate) {
                        if (link.href === '#community' || link.href === '#explore') {
                          e.preventDefault();
                          onNavigate('/community');
                        } else if (link.href.startsWith('#')) {
                          e.preventDefault();
                          onNavigate(link.href);
                        }
                      }
                    }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Stay Updated</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get the latest viral templates and platform updates directly in your inbox.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold py-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address for updates"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base sm:text-xs rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <IconButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  aria-label="Submit newsletter subscription"
                  className="absolute right-1 w-8 h-8 rounded-lg"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </IconButton>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2024 MemeHub. All rights reserved.</p>
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <a
              href="#terms"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('#terms');
                }
              }}
              className="hover:text-slate-600 transition-colors"
            >
              Terms
            </a>
            <a
              href="#privacy"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('#privacy');
                }
              }}
              className="hover:text-slate-600 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#cookies"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('#cookies');
                }
              }}
              className="hover:text-slate-600 transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

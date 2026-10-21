import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  FOOTER_PRODUCT_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_RESOURCES_LINKS,
} from '../../constants/navigation';

export const Footer: React.FC = () => {
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
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-14 border-b border-slate-100">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-600/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M4 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v7.5l2.5-3 2.5 3V5a1 1 0 0 1 1-1H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1v-6l-2.5 3-2.5-3v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MemeHub</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Make memes. Share happiness.</p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="#twitter"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:border-pink-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-600 hover:border-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#tiktok"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-1-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.19 8.19 0 0 0 4.93 1.62v-3.45c-.34 0-.68-.06-1.02-.19z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Product</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Company</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Resources</h3>
            <ul className="space-y-2 text-xs font-medium">
              {FOOTER_RESOURCES_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Stay Updated</h3>
            <p className="text-xs text-slate-500">Get the latest templates and features.</p>
            {subscribed ? (
              <p className="text-xs text-emerald-600 font-semibold py-2">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2024 MemeHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <a href="#terms" className="hover:text-slate-600">
              Terms
            </a>
            <a href="#privacy" className="hover:text-slate-600">
              Privacy
            </a>
            <a href="#cookies" className="hover:text-slate-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { Auth3DScene } from './features/auth/Auth3DScene';
import { useTemplateStore } from './stores/useTemplateStore';
import { IconButton } from './components/ui/IconButton';
import { useAppRouter } from './hooks/useAppRouter';

export const App: React.FC = () => {
  const { route, navigate } = useAppRouter();
  const notification = useTemplateStore((state) => state.notification);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Auto-dismiss notification toast after 4 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  // Dedicated cinematic 3D authentication scene for Login & Sign Up
  if (route === 'login' || route === 'signup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <Auth3DScene initialMode={route} onNavigate={navigate} />
      </div>
    );
  }

  // Standard Main Application Layout
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white relative">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>

      {/* Sticky Navigation Header */}
      <Header onNavigate={navigate} />

      {/* Floating Feedback Notification Toast */}
      {notification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#071330]/95 text-white p-3.5 rounded-2xl border border-blue-500/30 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="line-clamp-2">{notification.message}</span>
          </div>

          <IconButton
            variant="ghost"
            size="xs"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </aside>
      )}

      {/* Main Page Content */}
      <main id="main-content" className="flex-1 w-full">
        <HomePage />
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;

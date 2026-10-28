import React from 'react';
import { Home, Sparkles, Search, HelpCircle } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export interface NotFoundPageProps {
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/70 pt-24 sm:pt-28 pb-20">
      <Container size="sm" className="text-center space-y-6">
        {/* Floating 404 Graphic Badge */}
        <div className="relative inline-block mx-auto">
          <div className="text-7xl sm:text-9xl font-black tracking-tight text-slate-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-600/30">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>MEME NOT FOUND</span>
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost in the Meme Cosmos?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page or meme route you requested does not exist or may have been moved.
            Don&apos;t worry, the viral meme templates are safe and waiting for you!
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto shadow-md shadow-blue-600/30"
          >
            Back to Home
          </Button>

          <Button
            variant="outline"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4 text-cyan-600" />}
            onClick={() => onNavigate('/editor')}
            className="w-full sm:w-auto"
          >
            Open Meme Studio
          </Button>

          <Button
            variant="ghost"
            size="md"
            leftIcon={<Search className="w-4 h-4" />}
            onClick={() => onNavigate('#templates')}
            className="w-full sm:w-auto text-slate-600"
          >
            Explore Templates
          </Button>
        </div>

        {/* Helpful Tip */}
        <div className="pt-6 border-t border-slate-200/80 max-w-sm mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Double check the URL or use the navigation header above.</span>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;

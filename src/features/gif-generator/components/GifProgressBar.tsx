import React from 'react';
import { Loader2, X } from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';
import { Button } from '../../../components/ui/Button';

export const GifProgressBar: React.FC = () => {
  const progress = useGifStore((state) => state.progress);
  const cancelGeneration = useGifStore((state) => state.cancelGeneration);

  const isGenerating =
    progress.phase === 'extracting' ||
    progress.phase === 'quantizing' ||
    progress.phase === 'encoding';

  if (!isGenerating) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="p-5 rounded-3xl bg-[#071330]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl space-y-3.5 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          <span className="text-sm font-bold text-white tracking-tight">
            {progress.phase === 'extracting' ? 'Extracting Frames' : 'Encoding GIF89a'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-extrabold text-cyan-400">
            {progress.percent}%
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={cancelGeneration}
            leftIcon={<X className="w-3.5 h-3.5" />}
            className="text-slate-400 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full transition-all duration-200 shadow-sm shadow-cyan-500/50"
          style={{ width: `${Math.max(3, progress.percent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="truncate max-w-[280px] sm:max-w-md">{progress.statusText}</span>
        {progress.totalFrames > 0 && (
          <span className="shrink-0 font-mono text-[11px] text-slate-400">
            {progress.currentFrame}/{progress.totalFrames}
          </span>
        )}
      </div>
    </div>
  );
};

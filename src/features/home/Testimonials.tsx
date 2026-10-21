import React from 'react';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  metric: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Head of Social @ ViralLoop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    quote: 'MemeHub is our agency’s unfair advantage. Whenever cultural news breaks, we can compose, format, and post high-res topical memes in under 90 seconds. Engagement is up 340%.',
    metric: 'Over 4.5M monthly organic impressions',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Content Creator (520K Followers)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    quote: 'The AI meme prompt generator is wild. When I have creator block, typing a one-sentence scenario gives me 10 hilarious visual variations. It saves me hours every single week.',
    metric: 'Daily active creator since 2023',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    role: 'Reddit r/memes Moderator & Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    quote: 'Finally a tool that doesn’t compress files into potato quality or plaster ugly giant watermarks. The custom layers, font controls, and clean UI make this the gold standard.',
    metric: 'Top 1% Community Contributor',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="space-y-10" aria-label="Customer Reviews">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Wall of Love</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Loved by 2M+ Meme Creators Worldwide
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          From viral TikTok creators to full-time marketing agencies, see how our community makes content fly.
        </p>
      </div>

      {/* 3 Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-left relative cursor-default"
          >
            <div className="space-y-4">
              {/* Star Rating & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400 group-hover:scale-105 transition-transform duration-200">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200 group-hover:text-amber-200 group-hover:scale-110 transition-all duration-300" />
              </div>

              {/* Quote Text */}
              <p className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed italic transition-colors">
                "{t.quote}"
              </p>
            </div>

            {/* Author Info */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                    {t.role}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md text-right shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                {t.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

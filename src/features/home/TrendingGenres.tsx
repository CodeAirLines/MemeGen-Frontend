import React from 'react';
import { Terminal, Gamepad2, Briefcase, Film, ArrowRight, Flame } from 'lucide-react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { POPULAR_TEMPLATES } from '../../constants/templates';

interface GenreCard {
  id: string;
  title: string;
  description: string;
  count: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  tags: string[];
  sampleImage: string;
  sampleCaption: string;
}

const GENRE_CARDS: GenreCard[] = [
  {
    id: 'tech',
    title: 'Code & Tech Humor',
    description: 'Bugs, merge conflicts, AI takes, and Friday afternoon production deployments.',
    count: '1,420+ Templates',
    icon: <Terminal className="w-5 h-5 text-blue-600" />,
    gradient: 'from-blue-600/10 via-sky-500/5 to-transparent',
    accentColor: 'border-blue-200 group-hover:border-blue-400',
    tags: ['#developer', '#javascript', '#git', '#chatgpt'],
    sampleImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    sampleCaption: 'When it worked on localhost',
  },
  {
    id: 'gaming',
    title: 'Gaming & Esports',
    description: 'Clutch moments, rage quits, lag excuses, and steam sale regret.',
    count: '980+ Templates',
    icon: <Gamepad2 className="w-5 h-5 text-purple-600" />,
    gradient: 'from-purple-600/10 via-indigo-500/5 to-transparent',
    accentColor: 'border-purple-200 group-hover:border-purple-400',
    tags: ['#ranked', '#fps', '#steam', '#speedrun'],
    sampleImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
    sampleCaption: 'Just one more game before sleep',
  },
  {
    id: 'work',
    title: 'Office & Remote Work',
    description: 'Emails that should be meetings, Zoom fatigue, and corporate buzzwords.',
    count: '2,150+ Templates',
    icon: <Briefcase className="w-5 h-5 text-amber-600" />,
    gradient: 'from-amber-600/10 via-orange-500/5 to-transparent',
    accentColor: 'border-amber-200 group-hover:border-amber-400',
    tags: ['#wfh', '#slack', '#deadlines', '#coffee'],
    sampleImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80',
    sampleCaption: 'This meeting could have been an email',
  },
  {
    id: 'cinema',
    title: 'Movies & Pop Culture',
    description: 'Cinematic drama, reality TV reactions, anime frames, and viral celebrity quotes.',
    count: '3,600+ Templates',
    icon: <Film className="w-5 h-5 text-rose-600" />,
    gradient: 'from-rose-600/10 via-pink-500/5 to-transparent',
    accentColor: 'border-rose-200 group-hover:border-rose-400',
    tags: ['#hollywood', '#anime', '#reaction', '#marvel'],
    sampleImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80',
    sampleCaption: 'Plot twist nobody saw coming',
  },
];

export const TrendingGenres: React.FC = () => {
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);

  const handleExploreGenre = (genreId: string) => {
    const match = POPULAR_TEMPLATES.find((t) => t.category.toLowerCase().includes(genreId)) || POPULAR_TEMPLATES[0];
    setSelectedTemplate(match);
    openPreview(match);
  };

  return (
    <section className="space-y-10" aria-label="Curated Meme Universes">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1.5 flex flex-col items-center sm:items-start">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center sm:text-left">
            Explore by Vibe & Universe
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal text-center sm:text-left">
            Find the perfect punchline for your specific niche, audience, and community.
          </p>
        </div>

        <a
          href="#templates"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center justify-center gap-1 group self-center sm:self-auto"
        >
          <span>View All 500K+ Templates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* 4 Themed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {GENRE_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => handleExploreGenre(card.id)}
            className={`group bg-white rounded-2xl border ${card.accentColor} p-5 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:-translate-y-2.5 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer relative overflow-hidden`}
          >
            {/* Ambient subtle card gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity`} />

            <div className="relative z-10 space-y-4">
              {/* Top row: icon + count badge */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {card.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {card.count}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Sample Visual Mockup */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-100 shadow-inner">
                <img
                  src={card.sampleImage}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white uppercase drop-shadow leading-tight">
                    {card.sampleCaption}
                  </span>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-slate-600 bg-slate-100/90 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded-md transition-colors duration-150"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom link */}
            <div className="relative z-10 pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <span>Browse Templates</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

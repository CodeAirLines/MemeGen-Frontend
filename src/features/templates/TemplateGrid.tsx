import React, { useState, useMemo } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { POPULAR_TEMPLATES, TEMPLATE_CATEGORIES } from '../../constants/templates';
import { TemplateCard } from './TemplateCard';

export const TemplateGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') return POPULAR_TEMPLATES;
    const catLower = activeCategory.toLowerCase();
    return POPULAR_TEMPLATES.filter(
      (t) =>
        t.category.toLowerCase().includes(catLower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(catLower))
    );
  }, [activeCategory]);

  return (
    <section id="templates" className="scroll-mt-24 space-y-5" aria-label="Popular Meme Templates">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Popular Meme Templates
        </h2>
        <a
          href="#templates"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
        >
          <span>View All Templates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* More ▾ Dropdown Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>More</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMoreMenu && (
            <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20 space-y-1">
              {['Tech & Dev', 'News', 'Anime', 'Wholesome'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveCategory(item);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1 text-xs rounded-lg text-slate-700 hover:bg-slate-100 hover:text-blue-600 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Grid: 2 rows of 6 cards = 12 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
};

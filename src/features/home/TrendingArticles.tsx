import React from 'react';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Why the Stressed Cat Meme Conquered the Internet This Year',
    excerpt: 'An analysis of relatability, remote work burnout culture, and why feline panic resonates with millions of digital workers.',
    category: 'Trend Analysis',
    categoryColor: 'bg-blue-100 text-blue-700',
    readTime: '4 min read',
    date: 'Yesterday',
    author: 'Marcus Webb',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-2',
    title: 'The Anatomy of a Viral Meme: 5 Punchline Formulas That Never Fail',
    excerpt: 'From unexpected juxtaposition to ironic exaggeration, master the core linguistic structures behind top-voted Reddit memes.',
    category: 'Creator Playbook',
    categoryColor: 'bg-purple-100 text-purple-700',
    readTime: '6 min read',
    date: '3 days ago',
    author: 'Chloe Bennett',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-3',
    title: 'Brand Humor in 2026: How Fast-Moving Companies Win Organic Reach',
    excerpt: 'Why high-production corporate ads are losing out to authentic, self-deprecating memes created in under two minutes.',
    category: 'Brand Strategy',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    readTime: '5 min read',
    date: '1 week ago',
    author: 'Devin Vance',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
  },
];

export const TrendingArticles: React.FC = () => {
  return (
    <section className="space-y-10" aria-label="Meme Culture and Guides">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Meme Culture & Strategy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Latest Guides & Viral Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Learn the science of viral humor and keep up with what's blowing up across social feeds.
          </p>
        </div>

        <a
          href="#blog"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* 3 Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 active:scale-[0.99] transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left"
          >
            <div>
              {/* Image thumbnail */}
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs group-hover:scale-105 transition-transform ${article.categoryColor}`}>
                  {article.category}
                </span>
              </div>

              {/* Text content */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* Author Footer */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100">
              <span>By {article.author}</span>
              <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1.5 transition-transform duration-200">
                Read ↗
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

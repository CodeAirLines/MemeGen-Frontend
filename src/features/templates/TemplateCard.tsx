import React, { useState } from 'react';
import { Sparkles, Edit3 } from 'lucide-react';
import type { MemeTemplate } from '../../types/template';
import { useTemplateStore } from '../../stores/useTemplateStore';

export interface TemplateCardProps {
  template: MemeTemplate;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const [imageError, setImageError] = useState(false);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);

  const isSelected = selectedTemplate?.id === template.id;

  const handleClick = () => {
    setSelectedTemplate(template);
    openPreview(template);
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer flex flex-col bg-white rounded-xl border transition-all duration-300 ease-out overflow-hidden ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-lg -translate-y-1'
          : 'border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-2'
      }`}
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-[16/11] w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={template.imageUrl}
            alt={template.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
            <span className="text-xs font-semibold">{template.name}</span>
          </div>
        )}

        {/* Quick action overlay on hover */}
        <div className="absolute inset-0 bg-blue-950/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-2xs">
          <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Edit3 className="w-3.5 h-3.5" />
            Use Template
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="px-2.5 py-2 flex items-center justify-between gap-1 bg-white">
        <h3 className="font-semibold text-slate-800 text-xs sm:text-[13px] truncate group-hover:text-blue-600 transition-colors">
          {template.name}
        </h3>
        {isSelected && <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />}
      </div>
    </div>
  );
};

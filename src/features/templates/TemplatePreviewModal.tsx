import React from 'react';
import { Edit3, Layers, Maximize2, Tag, CheckCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCompactNumber } from '../../lib/utils';
import { useTemplateStore } from '../../stores/useTemplateStore';

export const TemplatePreviewModal: React.FC = () => {
  const isPreviewOpen = useTemplateStore((state) => state.isPreviewOpen);
  const previewTemplate = useTemplateStore((state) => state.previewTemplate);
  const closePreview = useTemplateStore((state) => state.closePreview);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);

  if (!previewTemplate) return null;

  const isAlreadySelected = selectedTemplate?.id === previewTemplate.id;

  const handleUseAndClose = () => {
    setSelectedTemplate(previewTemplate);
    closePreview();
    const editorElem = document.getElementById('create');
    if (editorElem) {
      editorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Modal
      isOpen={isPreviewOpen}
      onClose={closePreview}
      title={previewTemplate.name}
      description={`Category: ${previewTemplate.category.toUpperCase()} • ${formatCompactNumber(previewTemplate.usageCount)} community creations`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Template Image Display */}
        <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-center min-h-[260px] max-h-[380px]">
          <img
            src={previewTemplate.imageUrl}
            alt={previewTemplate.name}
            className="w-auto h-auto max-w-full max-h-[350px] object-contain rounded-lg shadow-2xs"
          />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
              {previewTemplate.width} × {previewTemplate.height} px
            </span>
          </div>
        </div>

        {/* Template Details & Text Layout Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Text Slots Configuration</span>
            </div>
            <p className="text-xs text-slate-600">
              Configured for <strong className="text-slate-900">{previewTemplate.boxCount} text layers</strong> (Top / Bottom / Custom coordinates supported).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Canvas Aspect Ratio</span>
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {(previewTemplate.width / previewTemplate.height).toFixed(2)} : 1 ({previewTemplate.width}w / {previewTemplate.height}h)
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {previewTemplate.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors cursor-pointer select-none shadow-2xs"
              >
                <span className="text-blue-400 font-bold mr-1">#</span>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={closePreview} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleUseAndClose}
            leftIcon={isAlreadySelected ? <CheckCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
          >
            {isAlreadySelected ? 'Continue with This Template' : 'Use Template in Editor'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import React, { useEffect } from 'react';
import { EditorStudio } from '../features/editor/EditorStudio';
import { useTemplateStore } from '../stores/useTemplateStore';
import { useEditorStore } from '../stores/useEditorStore';
import { POPULAR_TEMPLATES } from '../constants/templates';

interface EditorPageProps {
  onNavigate: (route: string) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ onNavigate }) => {
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const loadTemplate = useEditorStore((state) => state.loadTemplate);

  const lastSyncedTemplateIdRef = React.useRef<string | null>(null);

  // Sync selectedTemplate from Template Gallery into the Editor Store
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id !== lastSyncedTemplateIdRef.current) {
      lastSyncedTemplateIdRef.current = selectedTemplate.id;
      loadTemplate(selectedTemplate, false);
    } else if (!activeTemplate && POPULAR_TEMPLATES.length > 0) {
      loadTemplate(POPULAR_TEMPLATES[0], false);
    }
  }, [selectedTemplate, activeTemplate, loadTemplate]);

  const handleBack = () => {
    onNavigate('/');
  };

  return <EditorStudio onBack={handleBack} />;
};

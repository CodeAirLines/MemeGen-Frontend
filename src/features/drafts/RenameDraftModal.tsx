import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDraftStore } from '../../stores/useDraftStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Check } from 'lucide-react';
import type { MemeDraft } from '../../types/draft';

interface RenameDraftFormProps {
  draft: MemeDraft;
  onClose: () => void;
}

const RenameDraftForm: React.FC<RenameDraftFormProps> = ({ draft, onClose }) => {
  const renameDraft = useDraftStore((state) => state.renameDraft);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [title, setTitle] = useState(draft.title);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Draft title cannot be empty.');
      return;
    }

    if (trimmed.length > 60) {
      setError('Draft title cannot exceed 60 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await renameDraft(draft.id, trimmed);
      setNotification({
        type: 'success',
        message: `Draft renamed to "${trimmed}".`,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="draft-title" className="block text-xs font-semibold text-slate-700 mb-1.5">
          Draft Title
        </label>
        <Input
          id="draft-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Cat Stare Meme"
          maxLength={60}
          autoFocus
          error={error || undefined}
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Keep it memorable and concise</span>
          <span>{title.length}/60</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const RenameDraftModal: React.FC = () => {
  const activeDraft = useDraftStore((state) => state.activeDraftForRename);
  const setActiveDraftForRename = useDraftStore((state) => state.setActiveDraftForRename);

  if (!activeDraft) return null;

  return (
    <Modal
      isOpen={Boolean(activeDraft)}
      onClose={() => setActiveDraftForRename(null)}
      title="Rename Draft"
      description="Update the name of this meme draft for easier discovery."
      maxWidth="md"
    >
      <RenameDraftForm
        key={activeDraft.id}
        draft={activeDraft}
        onClose={() => setActiveDraftForRename(null)}
      />
    </Modal>
  );
};

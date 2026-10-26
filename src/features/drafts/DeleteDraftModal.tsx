import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useDraftStore } from '../../stores/useDraftStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteDraftModal: React.FC = () => {
  const activeDraft = useDraftStore((state) => state.activeDraftForDelete);
  const setActiveDraftForDelete = useDraftStore((state) => state.setActiveDraftForDelete);
  const deleteDraft = useDraftStore((state) => state.deleteDraft);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [isDeleting, setIsDeleting] = useState(false);

  if (!activeDraft) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDraft(activeDraft.id);
      setNotification({
        type: 'success',
        message: `Draft "${activeDraft.title}" deleted.`,
      });
      setActiveDraftForDelete(null);
    } catch {
      setNotification({
        type: 'info',
        message: 'Could not delete draft. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(activeDraft)}
      onClose={() => setActiveDraftForDelete(null)}
      title="Delete Meme Draft?"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 font-bold break-all">
                &ldquo;{activeDraft.title}&rdquo;
              </strong>
              ?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              All text layer positioning and customized styling in this draft will be removed from your browser storage.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveDraftForDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Draft
          </Button>
        </div>
      </div>
    </Modal>
  );
};

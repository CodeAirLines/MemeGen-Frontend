import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service & Community Guidelines"
      description="Please review our core platform rules before creating your account."
      maxWidth="lg"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs text-slate-600 leading-relaxed">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="font-semibold text-xs">Summary of Creator Rights & Responsibilities</span>
        </div>

        <section className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-xs">1. Creative Ownership & Attribution</h4>
          <p>
            You retain rights to all original text, captions, and creative modifications you generate using MemeHub. You grant MemeHub a non-exclusive license to host, render, and display your public meme creations.
          </p>
        </section>

        <section className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-xs">2. Community Content Standards</h4>
          <p>
            MemeHub is dedicated to humor, culture, and satire. Content promoting hate speech, harassment, violence, explicit non-consensual imagery, or illegal acts is strictly prohibited and subject to immediate removal and account termination.
          </p>
        </section>

        <section className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-xs">3. Privacy & Data Handling</h4>
          <p>
            We take creator privacy seriously. We do not sell your personal data. Authentication tokens and passwords will be encrypted using industry-standard hashing protocols upon backend integration.
          </p>
        </section>

        <section className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-xs">4. Service Availability</h4>
          <p>
            The service is provided on an &ldquo;as is&rdquo; basis during development and beta phases. Regular platform updates and improvements may occur without prior notice.
          </p>
        </section>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        {onAccept && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onAccept();
              onClose();
            }}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            I Understand & Agree
          </Button>
        )}
      </div>
    </Modal>
  );
};

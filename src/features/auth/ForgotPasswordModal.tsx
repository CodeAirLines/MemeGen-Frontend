import React, { useState } from 'react';
import { Mail, Info, KeyRound } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Reset Your Password"
      description="Enter your account email to receive recovery instructions."
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the email address associated with your MemeHub account. When our backend authentication service is connected, we will dispatch a secure password reset link.
            </p>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoFocus
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={handleReset} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={!email}>
                Request Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-blue-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Backend Integration Note</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                The password reset email service for <strong className="font-semibold">{email}</strong> is waiting for backend endpoint configuration. No actual emails will be dispatched until the email provider is connected.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

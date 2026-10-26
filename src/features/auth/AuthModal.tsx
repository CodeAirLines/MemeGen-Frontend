import { Auth3DScene, type AuthMode } from './Auth3DScene';

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onNavigate?: (route: string, options?: { preserveScroll?: boolean }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <Auth3DScene
      initialMode={initialMode}
      isModal={true}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  );
};

export default AuthModal;

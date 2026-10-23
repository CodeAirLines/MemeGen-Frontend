import React from 'react';
import { Auth3DScene } from '../features/auth/Auth3DScene';

interface LoginPageProps {
  onNavigate?: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return <Auth3DScene initialMode="login" onNavigate={onNavigate} />;
};

export default LoginPage;

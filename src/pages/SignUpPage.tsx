import React from 'react';
import { Auth3DScene } from '../features/auth/Auth3DScene';

interface SignUpPageProps {
  onNavigate?: (route: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  return <Auth3DScene initialMode="signup" onNavigate={onNavigate} />;
};

export default SignUpPage;

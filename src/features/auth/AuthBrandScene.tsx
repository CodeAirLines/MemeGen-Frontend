import React from 'react';

interface AuthBrandSceneProps {
  onBackHome?: () => void;
  className?: string;
}

export const AuthBrandScene: React.FC<AuthBrandSceneProps> = ({ onBackHome, className = '' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <a
        href="#home"
        onClick={(e) => {
          if (onBackHome) {
            e.preventDefault();
            onBackHome();
          }
        }}
        className="group cursor-pointer block hover:scale-105 active:scale-95 transition-all duration-300 select-none"
        aria-label="MemeHub Home"
      >
        <img
          src="/logo.png"
          alt="MemeHub"
          className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300"
        />
      </a>
    </div>
  );
};

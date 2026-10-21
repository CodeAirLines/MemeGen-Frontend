import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1">
        <HomePage />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;

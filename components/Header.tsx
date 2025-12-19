
import React from 'react';

interface HeaderProps {
  onRestart: () => void;
  showRestart: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRestart, showRestart }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onRestart}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M8 11h8m-4-4v8"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MindGuard
          </h1>
        </div>

        {showRestart && (
          <button 
            onClick={onRestart}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            New Check-in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

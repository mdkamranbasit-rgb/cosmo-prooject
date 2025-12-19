
import React from 'react';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  'Student', 'Working Professional', 'Entrepreneur', 'Couple', 
  'Single', 'Farmer', 'Homemaker', 'Content Creator', 'Other'
];

interface WelcomeProps {
  onSelectCategory: (category: Category) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSelectCategory }) => {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
          Hello. How are you <span className="text-indigo-600">truly</span> doing?
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          MindGuard is your private space to reflect, analyze your stress, and find 
          personalized ways to feel better. Let's start by understanding who you are.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
          >
            <span className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700">{cat}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-8 text-slate-400">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <span>Private & Secure</span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span>AI-Powered Insights</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

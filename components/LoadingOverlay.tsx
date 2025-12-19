
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "MindGuard is analyzing your inputs...",
  "Calibrating stress scoring based on your category...",
  "Gathering supportive coping suggestions...",
  "Searching for content to uplift your mood...",
  "Finalizing your personalized dashboard...",
];

const LoadingOverlay: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-12">
        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Deep Breath In...</h2>
      <p className="text-slate-500 animate-pulse text-lg h-8">{MESSAGES[msgIndex]}</p>
    </div>
  );
};

export default LoadingOverlay;

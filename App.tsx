
import React, { useState, useEffect } from 'react';
import { AssessmentData, Category, MindGuardResponse } from './types';
import { getMindGuardAnalysis } from './geminiService';
import Header from './components/Header';
import Welcome from './components/Welcome';
import AssessmentForm from './components/AssessmentForm';
import Dashboard from './components/Dashboard';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'assessment' | 'loading' | 'dashboard'>('welcome');
  const [category, setCategory] = useState<Category | null>(null);
  const [report, setReport] = useState<MindGuardResponse | null>(null);

  const startAssessment = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setStep('assessment');
  };

  const handleAssessmentComplete = async (data: Omit<AssessmentData, 'category'>) => {
    if (!category) return;
    setStep('loading');
    
    try {
      const fullData: AssessmentData = {
        category,
        ...data,
      };
      const result = await getMindGuardAnalysis(fullData);
      setReport(result);
      setStep('dashboard');
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Something went wrong with the AI analysis. Please try again.");
      setStep('assessment');
    }
  };

  const restart = () => {
    setCategory(null);
    setReport(null);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onRestart={restart} showRestart={step === 'dashboard'} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {step === 'welcome' && <Welcome onSelectCategory={startAssessment} />}
        {step === 'assessment' && category && (
          <AssessmentForm onComplete={handleAssessmentComplete} category={category} />
        )}
        {step === 'loading' && <LoadingOverlay />}
        {step === 'dashboard' && report && <Dashboard report={report} />}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        <p>© 2024 MindGuard. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;

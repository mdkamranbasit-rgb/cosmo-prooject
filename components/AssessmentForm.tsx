
import React, { useState } from 'react';
import { Category } from '../types';

interface AssessmentFormProps {
  category: Category;
  onComplete: (data: any) => void;
}

interface Question {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'range' | 'choice' | 'text';
  options?: string[];
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ category, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    onboarding: {
      lifePressure: '',
      sleepQuality: '',
      mood: '',
      motivation: '',
      biggestWorry: '',
      energyLevel: '',
      workLifeBalance: '',
    },
    dailyCheckin: {
      selfReportedStress: 5,
      moodTrigger: '',
      sleepLastNight: '',
      dayWord: '',
    }
  });

  const onboardingQuestions: Question[] = [
    { 
      key: 'lifePressure', 
      label: 'How would you describe your current life pressure?', 
      type: 'choice',
      options: ['Low / Minimal', 'Moderate / Manageable', 'High / Challenging', 'Overwhelming / Intense']
    },
    { 
      key: 'sleepQuality', 
      label: 'Generally, how has your sleep quality been lately?', 
      type: 'choice',
      options: ['Excellent (Deep & Restful)', 'Good (Steady)', 'Fair (Interrupted)', 'Poor (Restless)']
    },
    { 
      key: 'mood', 
      label: 'What is your primary mood most days?', 
      type: 'choice',
      options: ['Optimistic / Happy', 'Calm / Content', 'Anxious / Nervous', 'Irritable / Stressed', 'Low / Sad']
    },
    { 
      key: 'motivation', 
      label: 'How motivated do you feel right now?', 
      type: 'choice',
      options: ['Highly Driven', 'Steady & Focused', 'Struggling to Start', 'No Motivation']
    },
    { 
      key: 'biggestWorry', 
      label: 'What is your biggest worry at the moment?', 
      type: 'choice',
      options: ['Work / Career', 'Studies / Exams', 'Finances / Money', 'Relationships / Family', 'Health / Wellness', 'Personal Growth']
    },
    { 
      key: 'energyLevel', 
      label: 'Describe your physical energy levels throughout the day.', 
      type: 'choice',
      options: ['High Energy', 'Steady & Reliable', 'Mostly Sluggish', 'Unpredictable / Peaks & Valleys']
    },
    { 
      key: 'workLifeBalance', 
      label: 'How is your work-life (or study-life) balance?', 
      type: 'choice',
      options: ['Healthy & Balanced', 'Mostly Balanced', 'Needs Improvement', 'Completely Imbalanced']
    },
  ];

  const dailyQuestions: Question[] = [
    { key: 'selfReportedStress', label: 'How stressed do you feel right now? (1-10)', type: 'range' },
    { 
      key: 'moodTrigger', 
      label: 'What affected your mood the most today?', 
      type: 'choice',
      options: ['Social Interactions', 'Work / Tasks', 'Health / Fitness', 'Environment / News', 'Personal Thoughts', 'Sleep Quality']
    },
    { 
      key: 'sleepLastNight', 
      label: 'How was your sleep last night?', 
      type: 'choice',
      options: ['Great (8+ hours)', 'Good (6-7 hours)', 'Interrupted / Light', 'Very Poor / No Sleep']
    },
    { 
      key: 'dayWord', 
      label: 'One word to describe your today?', 
      type: 'choice',
      options: ['Productive', 'Peaceful', 'Tiring', 'Stressful', 'Joyful', 'Boring', 'Emotional']
    },
  ];

  const totalSteps = onboardingQuestions.length + dailyQuestions.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const isDaily = currentStep >= onboardingQuestions.length;
  const currentQuestion = isDaily 
    ? dailyQuestions[currentStep - onboardingQuestions.length] 
    : onboardingQuestions[currentStep];

  const value = isDaily 
    ? (formData.dailyCheckin as any)[currentQuestion.key] 
    : (formData.onboarding as any)[currentQuestion.key];

  const updateForm = (val: any) => {
    if (isDaily) {
      setFormData({
        ...formData,
        dailyCheckin: { ...formData.dailyCheckin, [currentQuestion.key]: val }
      });
    } else {
      setFormData({
        ...formData,
        onboarding: { ...formData.onboarding, [currentQuestion.key]: val }
      });
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
            {isDaily ? 'Daily Check-in' : 'Onboarding'}
          </span>
          <span className="text-sm text-slate-400">{currentStep + 1} of {totalSteps}</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center md:text-left">
          {currentQuestion.label}
        </h3>

        {currentQuestion.type === 'range' ? (
          <div className="space-y-6 py-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={value}
              onChange={(e) => updateForm(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-lg font-bold text-indigo-600 px-2">
              <span className="flex flex-col items-center">
                <span className="text-2xl">🧘</span>
                <span className="text-xs font-medium text-slate-400 mt-1">CALM</span>
              </span>
              <span className="text-4xl">{value}</span>
              <span className="flex flex-col items-center">
                <span className="text-2xl">🌋</span>
                <span className="text-xs font-medium text-slate-400 mt-1">EXTREME</span>
              </span>
            </div>
          </div>
        ) : currentQuestion.type === 'choice' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => updateForm(option)}
                className={`p-4 text-left rounded-2xl border-2 transition-all duration-200 font-medium ${
                  value === option 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-slate-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            autoFocus
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-32"
            placeholder={currentQuestion.placeholder}
            value={value}
            onChange={(e) => updateForm(e.target.value)}
          />
        )}

        <div className="mt-10 flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all ${currentStep === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            <span>Back</span>
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!value && currentQuestion.type !== 'range'}
            className="flex items-center space-x-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 group"
          >
            <span>{currentStep === totalSteps - 1 ? 'Analyze My State' : 'Next'}</span>
            {currentStep !== totalSteps - 1 && (
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            )}
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-slate-400 text-xs italic">
        "Self-awareness is the first step toward healing."
      </p>
    </div>
  );
};

export default AssessmentForm;

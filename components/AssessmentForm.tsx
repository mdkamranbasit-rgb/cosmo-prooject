
import React, { useState } from 'react';
import { Category } from '../types';

interface AssessmentFormProps {
  category: Category;
  onComplete: (data: any) => void;
}

// Define a common interface for questions to avoid TypeScript union errors when accessing properties like 'type'
interface Question {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
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

  // Explicitly typing the question arrays as Question[] ensures that all objects share the same interface
  const onboardingQuestions: Question[] = [
    { key: 'lifePressure', label: 'How would you describe your current life pressure?', placeholder: 'e.g., Heavy work deadlines, exams approaching, family issues...' },
    { key: 'sleepQuality', label: 'Generally, how has your sleep quality been lately?', placeholder: 'e.g., Restless, deep but short, 8 hours consistently...' },
    { key: 'mood', label: 'What is your primary mood most days?', placeholder: 'e.g., Anxious, content, irritable, optimistic...' },
    { key: 'motivation', label: 'How motivated do you feel right now?', placeholder: 'e.g., Hard to get out of bed, high energy, focused on goals...' },
    { key: 'biggestWorry', label: 'What is your biggest worry at the moment?', placeholder: 'Be as honest as you feel comfortable...' },
    { key: 'energyLevel', label: 'Describe your physical energy levels throughout the day.', placeholder: 'e.g., Sluggish in the morning, peak at night, steady...' },
    { key: 'workLifeBalance', label: 'How is your work-life (or study-life) balance?', placeholder: 'e.g., Non-existent, decent, working on it...' },
  ];

  const dailyQuestions: Question[] = [
    { key: 'selfReportedStress', label: 'How stressed do you feel right now? (1-10)', type: 'range' },
    { key: 'moodTrigger', label: 'What affected your mood the most today?', placeholder: 'e.g., A conversation, traffic, a task finished...' },
    { key: 'sleepLastNight', label: 'How was your sleep last night?', placeholder: 'e.g., Better than usual, interrupted, poor...' },
    { key: 'dayWord', label: 'One word to describe your today?', placeholder: 'e.g., Productive, exhausting, peaceful...' },
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
    <div className="max-w-2xl mx-auto py-12">
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
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {currentQuestion.label}
        </h3>

        {/* Accessing type property on Question interface safely */}
        {currentQuestion.type === 'range' ? (
          <div className="space-y-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={value}
              onChange={(e) => updateForm(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-lg font-bold text-indigo-600">
              <span>Calm</span>
              <span>{value}</span>
              <span>Extreme</span>
            </div>
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

        <div className="mt-8 flex justify-between">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 font-semibold rounded-xl transition-all ${currentStep === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            disabled={!value && currentQuestion.type !== 'range'}
            className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
          >
            {currentStep === totalSteps - 1 ? 'Analyze My State' : 'Next'}
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-slate-400 text-sm">
        Your answers help us create a personalized wellbeing plan.
      </p>
    </div>
  );
};

export default AssessmentForm;

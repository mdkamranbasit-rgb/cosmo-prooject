
export type Category = 
  | 'Student' 
  | 'Working Professional' 
  | 'Entrepreneur' 
  | 'Couple' 
  | 'Single' 
  | 'Farmer' 
  | 'Homemaker' 
  | 'Content Creator' 
  | 'Other';

export interface AssessmentData {
  category: Category;
  onboarding: {
    lifePressure: string;
    sleepQuality: string;
    mood: string;
    motivation: string;
    biggestWorry: string;
    energyLevel: string;
    workLifeBalance: string;
  };
  dailyCheckin: {
    selfReportedStress: number; // 1-10
    moodTrigger: string;
    sleepLastNight: string;
    dayWord: string;
  };
}

export interface CopingSuggestion {
  title: string;
  description: string;
  duration_minutes: number;
}

export interface HistoryPoint {
  date: string;
  stress_score: number;
}

export interface MindGuardResponse {
  app_name: string;
  category: string;
  daily_checkin: {
    date: string;
    self_reported_stress: number;
    mood_word: string;
    sleep_quality: string;
    main_trigger: string;
  };
  stress_analysis: {
    current_score: number;
    stress_level: 'Low' | 'Moderate' | 'High';
    trend: 'Increasing' | 'Stable' | 'Decreasing';
    primary_triggers: string[];
  };
  stress_graph: {
    history: HistoryPoint[];
    seven_day_average: number;
  };
  user_profile: {
    emotional_state: string;
    primary_intent: string;
    coping_readiness: 'Low' | 'Medium' | 'High';
  };
  coping_suggestions: CopingSuggestion[];
  calming_message: string;
  recommendations: {
    videos: string[];
    shorts_reels: string[];
    shayari: string[];
    quotes: string[];
    standup: string[];
  };
}

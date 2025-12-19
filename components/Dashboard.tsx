
import React, { useMemo } from 'react';
import { MindGuardResponse } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface DashboardProps {
  report: MindGuardResponse;
}

const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const { stress_analysis, stress_graph, coping_suggestions, calming_message, user_profile, recommendations } = report;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Moderate': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const trendColor = stress_analysis.trend === 'Increasing' ? 'text-rose-500' : stress_analysis.trend === 'Decreasing' ? 'text-emerald-500' : 'text-slate-400';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-1000">
      {/* Top Section: Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Calming Message Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Hi there, friend.</h2>
            <p className="text-lg opacity-90 leading-relaxed italic">
              "{calming_message}"
            </p>
          </div>

          {/* Graph Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Stress Trends</h3>
                <p className="text-slate-500 text-sm">Last 7 days behavior</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{stress_graph.seven_day_average.toFixed(0)}</div>
                <div className="text-xs text-slate-400 font-medium">AVG SCORE</div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stress_graph.history}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="stress_score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Score & Profile */}
        <div className="space-y-8">
          {/* Current Score Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="inline-flex items-center justify-center p-6 rounded-full border-8 border-slate-50 mb-4 bg-white shadow-inner">
              <span className={`text-5xl font-extrabold ${stress_analysis.stress_level === 'High' ? 'text-rose-500' : 'text-indigo-600'}`}>
                {stress_analysis.current_score}
              </span>
            </div>
            <div className="mb-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getLevelColor(stress_analysis.stress_level)}`}>
                {stress_analysis.stress_level} Stress
              </span>
            </div>
            <div className={`text-sm font-medium flex items-center justify-center ${trendColor}`}>
              {stress_analysis.trend === 'Increasing' ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"/></svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-9-9-4 4-6-6"/></svg>
              )}
              Trend is {stress_analysis.trend}
            </div>
          </div>

          {/* User Profile Analysis */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Analysis Profile</h4>
            <div>
              <p className="text-xs text-slate-400 font-medium">Emotional State</p>
              <p className="text-slate-800 font-semibold">{user_profile.emotional_state}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Coping Readiness</p>
              <p className="text-slate-800 font-semibold">{user_profile.coping_readiness}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Triggers Detected</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {stress_analysis.primary_triggers.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coping Suggestions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">Your Coping Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coping_suggestions.map((suggestion, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{suggestion.title}</h4>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{suggestion.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {suggestion.duration_minutes} MINS
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Content */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-slate-900">Stress-Aware Content</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Shayari & Quotes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              Words of Wisdom
            </h4>
            <div className="space-y-4">
              {recommendations.shayari.map((s, i) => (
                <div key={i} className="p-4 bg-pink-50 rounded-xl text-pink-900 text-sm italic border border-pink-100">
                  {s}
                </div>
              ))}
              {recommendations.quotes.map((q, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm border border-slate-100">
                  "{q}"
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Curated Videos
            </h4>
            <div className="space-y-4">
              {recommendations.videos.map((v, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="bg-slate-100 aspect-video rounded-xl mb-2 overflow-hidden flex items-center justify-center relative">
                    <img src={`https://picsum.photos/400/225?random=${i}`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Humor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Humor & Light Relief
            </h4>
            <div className="space-y-4">
              {recommendations.standup.map((s, i) => (
                <div key={i} className="p-4 border border-amber-100 bg-amber-50 rounded-xl flex items-start space-x-3">
                  <span className="text-xl">😂</span>
                  <p className="text-sm text-amber-900 font-medium">{s}</p>
                </div>
              ))}
              <div className="pt-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Reels</h5>
                <div className="grid grid-cols-2 gap-2">
                  {recommendations.shorts_reels.map((r, i) => (
                    <div key={i} className="h-24 bg-slate-50 rounded-lg flex items-center justify-center p-2 text-center text-[10px] font-bold text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Help Note (Safety First) */}
      {stress_analysis.stress_level === 'High' && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <h4 className="text-rose-900 font-bold">Please remember...</h4>
            <p className="text-rose-700 text-sm">Since your stress is currently high, it might be helpful to reach out to a trusted professional or counselor. MindGuard is a companion, but professional support is invaluable when things get heavy.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

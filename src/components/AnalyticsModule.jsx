import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  getAllTasks, getDailyStats, getWeeklyStats, 
  getMonthlyStats, getYearlyStats, getKPIs, generateInsights 
} from '../utils/analytics';

export default function AnalyticsModule({ records }) {
  const [timeframe, setTimeframe] = useState('Daily');

  const tasks = useMemo(() => getAllTasks(records), [records]);
  const kpis = useMemo(() => getKPIs(tasks), [tasks]);
  const insights = useMemo(() => generateInsights(tasks), [tasks]);

  const chartData = useMemo(() => {
    switch(timeframe) {
      case 'Daily': return getDailyStats(tasks);
      case 'Weekly': return getWeeklyStats(tasks);
      case 'Monthly': return getMonthlyStats(tasks);
      case 'Yearly': return getYearlyStats(tasks);
      default: return getDailyStats(tasks);
    }
  }, [timeframe, tasks]);

  return (
    <div className="flex-1 w-full h-full min-h-0 flex flex-col p-4 sm:p-6 bg-brand-pinklight/20 overflow-y-auto">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="font-pixel text-brand-plum text-2xl drop-shadow-sm">Analytics</h2>
        <div className="flex bg-brand-white/60 p-1 rounded-xl shadow-inner border-2 border-brand-plum/10">
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                timeframe === tf 
                  ? 'bg-brand-plum text-brand-white shadow-md scale-105' 
                  : 'text-brand-plum/70 hover:bg-brand-plum/10 hover:text-brand-plum'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-brand-white/80 p-4 rounded-xl shadow-sm border-2 border-brand-plum/10 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-1">✅</span>
          <span className="text-2xl font-bold text-brand-plum">{kpis.totalCompleted}</span>
          <span className="text-xs text-brand-plum/70 font-medium">Total Completed</span>
        </div>
        <div className="bg-brand-white/80 p-4 rounded-xl shadow-sm border-2 border-brand-plum/10 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-1">🎯</span>
          <span className="text-2xl font-bold text-brand-plum">{kpis.completionRate}%</span>
          <span className="text-xs text-brand-plum/70 font-medium">Completion Rate</span>
        </div>
        <div className="bg-brand-white/80 p-4 rounded-xl shadow-sm border-2 border-brand-plum/10 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-1">🔥</span>
          <span className="text-2xl font-bold text-brand-plum">{kpis.currentStreak}</span>
          <span className="text-xs text-brand-plum/70 font-medium">Current Streak (Days)</span>
        </div>
        <div className="bg-brand-white/80 p-4 rounded-xl shadow-sm border-2 border-brand-plum/10 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-1">⭐</span>
          <span className="text-lg font-bold text-brand-plum leading-tight truncate w-full">{kpis.peakDay}</span>
          <span className="text-xs text-brand-plum/70 font-medium mt-1">Peak Day</span>
        </div>
      </div>

      {/* Primary Chart Visualizer */}
      <div className="bg-brand-white/90 p-4 rounded-2xl shadow-sm border-2 border-brand-plum/10 flex-grow min-h-[300px] mb-8 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0d4d6" vertical={false} />
            <XAxis dataKey="label" stroke="#3E2312" tick={{ fill: '#3E2312', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis stroke="#3E2312" tick={{ fill: '#3E2312', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(62, 35, 18, 0.05)' }}
              contentStyle={{ backgroundColor: '#FFFBF5', borderRadius: '12px', border: '2px solid rgba(62,35,18,0.1)' }}
              labelStyle={{ color: '#3E2312', fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: '#3E2312' }}
              formatter={(value) => [`${value} tasks completed`, '']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
            />
            <Bar dataKey="completed" fill="#3E2312" radius={[6, 6, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Smart Insights & Encouragement Panel */}
      <div className="bg-gradient-to-r from-brand-pinklight/40 to-[#D2E4D6]/40 p-5 rounded-2xl border-2 border-brand-plum/10 flex items-center gap-4 shadow-sm mb-4">
        <div className="text-4xl animate-bounce-short">💡</div>
        <p className="text-brand-plum font-medium text-sm md:text-base leading-relaxed">
          {insights}
        </p>
      </div>

    </div>
  );
}

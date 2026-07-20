import React from 'react';
import { Send, CheckCircle2, Clock3 } from 'lucide-react';

interface TrackerStatsProps {
  totalJobs: number;
  totalTerkirim: number;
  totalDrafts: number;
}

export function TrackerStats({ totalJobs, totalTerkirim, totalDrafts }: TrackerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Total Email Sender</p>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalJobs}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Terkirim</p>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalTerkirim}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-amber-500">
          <Clock3 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Drafts</p>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalDrafts}</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Send, CheckCircle2, Clock3 } from 'lucide-react';

interface TrackerStatsProps {
  totalJobs: number;
  totalTerkirim: number;
  totalDrafts: number;
}

export function TrackerStats({ totalJobs, totalTerkirim, totalDrafts }: TrackerStatsProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Line 1: Draft | Terkirim */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Draft */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center space-x-3 sm:space-x-4">
          <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Clock3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 truncate">Draft</p>
            <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalDrafts}</p>
          </div>
        </div>

        {/* Terkirim */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center space-x-3 sm:space-x-4">
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 truncate">Terkirim</p>
            <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalTerkirim}</p>
          </div>
        </div>
      </div>

      {/* Line 2: Total (1 line kiri ke kanan) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center space-x-3 sm:space-x-4 w-full">
        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-500/10 text-[#02227E] dark:text-blue-400 shrink-0">
          <Send className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Total Email</p>
          <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white mt-0.5">{totalJobs}</p>
        </div>
      </div>
    </div>
  );
}

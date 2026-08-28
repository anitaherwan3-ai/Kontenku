import React, { useEffect } from 'react';
import {
  Trophy,
  Flame,
  ShoppingBag,
  TrendingUp,
  Zap,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EngagementMilestoneAlert } from '../../types';

interface EngagementAlertsToastProps {
  alert: EngagementMilestoneAlert | null;
  onDismiss: () => void;
  onViewDetails?: () => void;
}

export const EngagementAlertsToast: React.FC<EngagementAlertsToastProps> = ({
  alert,
  onDismiss,
  onViewDetails,
}) => {
  useEffect(() => {
    if (alert) {
      // Trigger milestone celebration confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.85 },
      });

      // Auto dismiss after 8 seconds if not clicked
      const timer = setTimeout(() => {
        onDismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!alert) return null;

  const getIcon = () => {
    switch (alert.iconType) {
      case 'trophy':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'zap':
      default:
        return <Zap className="w-5 h-5 text-purple-500" />;
    }
  };

  const getPlatformIcon = () => {
    switch (alert.platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📸';
      case 'facebook':
        return '👥';
      default:
        return '🌐';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 text-white shadow-2xl space-y-3 ring-1 ring-white/10">
        {/* Header Alert Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 text-white shadow-xs">
                  🎉 MILESTONE ALERT
                </span>
                <span className="text-[11px] text-slate-400">
                  {alert.timestamp || 'Baru Saja'}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                {alert.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message description */}
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          {alert.message}
        </p>

        {/* Metric Highlight Box */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{getPlatformIcon()}</span>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">
                {alert.accountHandle} • {alert.platform.toUpperCase()}
              </div>
              <div className="text-xs font-bold text-slate-100 truncate max-w-[180px]">
                {alert.postTitle}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
              {alert.metricLabel}
            </span>
            <span className="text-sm font-black text-amber-300">
              {alert.metricValue}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition bg-white/5 hover:bg-white/10"
          >
            Tutup
          </button>
          {onViewDetails && (
            <button
              onClick={() => {
                onViewDetails();
                onDismiss();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-sm shadow-indigo-400/30"
            >
              <span>Buka Analitik Milestone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

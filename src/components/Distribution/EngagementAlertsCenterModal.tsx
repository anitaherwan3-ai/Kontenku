import React, { useState } from 'react';
import {
  Bell,
  Trophy,
  Flame,
  ShoppingBag,
  TrendingUp,
  Zap,
  X,
  CheckCircle2,
  Play,
  Sliders,
  Sparkles,
  RefreshCw,
  Trash2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EngagementMilestoneAlert, PippitProject } from '../../types';

interface EngagementAlertsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: EngagementMilestoneAlert[];
  onTriggerSimulatedAlert: (sample?: Partial<EngagementMilestoneAlert>) => void;
  onClearAllAlerts: () => void;
  onMarkAllRead: () => void;
  project: PippitProject;
}

export const EngagementAlertsCenterModal: React.FC<EngagementAlertsCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onTriggerSimulatedAlert,
  onClearAllAlerts,
  onMarkAllRead,
  project,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'views' | 'cart_clicks' | 'roas'>('all');
  const [customViewThreshold, setCustomViewThreshold] = useState<number>(50000);
  const [customCartThreshold, setCustomCartThreshold] = useState<number>(1000);
  const [customRoasThreshold, setCustomRoasThreshold] = useState<number>(4.5);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleSimulateQuick = (type: 'views' | 'cart' | 'roas' | 'viral') => {
    setIsSimulating(true);
    const productName = project.inputData.productAnalysis?.productName || 'Barrier Glow Serum';

    if (type === 'views') {
      onTriggerSimulatedAlert({
        type: 'views',
        title: `🔥 Video Tembus 100.000 Views di TikTok FYP!`,
        message: `Video promosi "${productName}" baru saja melampaui milestone 100K tayangan organik dalam 6 jam pertama penayangan.`,
        metricLabel: 'Organik Views',
        metricValue: '108.450 Tayangan',
        platform: 'tiktok',
        accountHandle: '@glowluxe.official',
        postTitle: `Review Jujur ${productName}`,
        iconType: 'flame',
      });
    } else if (type === 'cart') {
      onTriggerSimulatedAlert({
        type: 'cart_clicks',
        title: `🛍️ Lonjakan 5.000 Klik Keranjang Kuning!`,
        message: `Tingkat konversi CTA melonjak drastis! Terjadi 5.240 klik pada keranjang kuning dengan checkout rate 14.8%.`,
        metricLabel: 'Keranjang Terklik',
        metricValue: '5.240 Klik',
        platform: 'tiktok',
        accountHandle: '@glowluxe.store',
        postTitle: `Flash Sale Disc 45% ${productName}`,
        iconType: 'shopping',
      });
    } else if (type === 'roas') {
      onTriggerSimulatedAlert({
        type: 'roas',
        title: `💰 Rekor ROAS Iklan Mencapai 6.2x!`,
        message: `Kampanye Meta Ads / Reels melampaui target efisiensi biaya. Biaya per akuisisi pelanggan (CAC) turun 38%.`,
        metricLabel: 'Efisiensi ROAS',
        metricValue: '6.2x Return',
        platform: 'instagram',
        accountHandle: '@glowluxe.id',
        postTitle: `Daily Glow Aesthetic Serum`,
        iconType: 'trophy',
      });
    } else {
      onTriggerSimulatedAlert({
        type: 'viral_rank',
        title: `🏆 Trending #1 di Kategori Skincare & Beauty!`,
        message: `Algoritma TikTok menetapkan video Anda sebagai Top Trending Sound & Hashtag di regional Indonesia.`,
        metricLabel: 'Trending Rank',
        metricValue: '#1 Beauty Rank',
        platform: 'tiktok',
        accountHandle: '@glowluxe.official',
        postTitle: `Viral Skincare Hacks`,
        iconType: 'zap',
      });
    }

    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const getAlertIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-indigo-500" />;
      case 'zap':
      default:
        return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Engagement Alerts & Milestone Notifier
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {unreadCount} Alert Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Memantau dan mengirimkan peringatan otomatis saat performa video mencapai target jumlah penonton & konversi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Testing & Simulator Bar */}
        <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              Uji Coba Notifikasi Milestone (Simulasi):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSimulateQuick('views')}
              disabled={isSimulating}
              className="px-2.5 py-1.5 bg-white hover:bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>+100K Views</span>
            </button>

            <button
              onClick={() => handleSimulateQuick('cart')}
              disabled={isSimulating}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              <span>5K Klik Keranjang</span>
            </button>

            <button
              onClick={() => handleSimulateQuick('roas')}
              disabled={isSimulating}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>6.2x ROAS</span>
            </button>

            <button
              onClick={() => handleSimulateQuick('viral')}
              disabled={isSimulating}
              className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>#1 Trending</span>
            </button>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: `Semua Alert (${alerts.length})` },
              { id: 'views', label: 'Milestone Views' },
              { id: 'cart_clicks', label: 'Klik Keranjang' },
              { id: 'roas', label: 'Target ROAS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeFilter === tab.id
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
            >
              Tandai Semua Dibaca
            </button>
            <button
              onClick={onClearAllAlerts}
              className="text-slate-400 hover:text-red-600 font-semibold px-2 py-1 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Kosongkan</span>
            </button>
          </div>
        </div>

        {/* Alert List Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Belum Ada Milestone Alert Tercatat
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Notifikasi akan muncul saat video yang dipublikasikan menembus batas ambang views atau penjualan. Coba klik tombol simulasi di atas.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !alert.isRead
                    ? 'bg-indigo-50/40 border-indigo-200 shadow-xs ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {getAlertIcon(alert.iconType)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900">
                        {alert.title}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                        {alert.platform}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {alert.message}
                    </p>

                    <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1.5 pt-0.5">
                      <span>{alert.accountHandle}</span>
                      <span>•</span>
                      <span className="text-slate-700 truncate max-w-[260px]">
                        "{alert.postTitle}"
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badge Metric */}
                <div className="sm:text-right shrink-0 bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-slate-200 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {alert.metricLabel}
                  </span>
                  <span className="text-sm font-black text-indigo-600">
                    {alert.metricValue}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            🔔 Notifikasi otomatis aktif untuk semua akun terhubung
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

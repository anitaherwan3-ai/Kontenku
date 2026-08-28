import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Tag,
  ShieldCheck,
  Truck,
  Star,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Zap,
  ShoppingBag,
  ArrowDownRight
} from 'lucide-react';
import { DynamicSticker, DynamicStickerType, PippitProject } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface DynamicStickersPanelProps {
  project: PippitProject;
  onChangeProject: (newProject: Partial<PippitProject>) => void;
}

export const DynamicStickersPanel: React.FC<DynamicStickersPanelProps> = ({
  project,
  onChangeProject,
}) => {
  const stickers = project.dynamicStickers || [];
  const [activeEditingId, setActiveEditingId] = useState<string>(stickers[0]?.id || '');

  const handleToggleSticker = (id: string, enabled: boolean) => {
    soundSynth.playSound('pop');
    const updated = stickers.map((st) => (st.id === id ? { ...st, enabled } : st));
    onChangeProject({ dynamicStickers: updated });
  };

  const handleUpdateSticker = (id: string, updates: Partial<DynamicSticker>) => {
    const updated = stickers.map((st) => (st.id === id ? { ...st, ...updates } : st));
    onChangeProject({ dynamicStickers: updated });
  };

  const handleAddCustomSticker = (type: DynamicStickerType) => {
    soundSynth.playSound('whoosh');
    let newSticker: DynamicSticker;

    if (type === 'countdown_timer') {
      newSticker = {
        id: `sticker-${Date.now()}`,
        type: 'countdown_timer',
        title: '⚡ FLASH SALE BERAKHIR DALAM',
        subTitle: 'Promo Terbatas',
        countdownMinutes: 60,
        positionX: 50,
        positionY: 10,
        scale: 100,
        animation: 'pulse',
        colorTheme: 'urgent_red',
        visibleScenes: 'all',
        enabled: true,
      };
    } else if (type === 'flash_discount') {
      newSticker = {
        id: `sticker-${Date.now()}`,
        type: 'flash_discount',
        title: 'DISKON 50% OFF',
        subTitle: 'Klaim Sekarang',
        discountPercent: 50,
        positionX: 80,
        positionY: 20,
        scale: 100,
        animation: 'bounce',
        colorTheme: 'tiktok_yellow',
        visibleScenes: 'all',
        enabled: true,
      };
    } else if (type === 'yellow_cart_arrow') {
      newSticker = {
        id: `sticker-${Date.now()}`,
        type: 'yellow_cart_arrow',
        title: '👇 KERANJANG KUNING DISINI',
        subTitle: 'Beli Sekarang Sebelum Habis',
        positionX: 20,
        positionY: 82,
        scale: 100,
        animation: 'bounce',
        colorTheme: 'tiktok_yellow',
        visibleScenes: 'cta_only',
        enabled: true,
      };
    } else if (type === 'free_shipping_cod') {
      newSticker = {
        id: `sticker-${Date.now()}`,
        type: 'free_shipping_cod',
        title: 'GRATIS ONGKIR + COD',
        subTitle: 'Bayar di Tempat Aman',
        positionX: 18,
        positionY: 24,
        scale: 95,
        animation: 'floating',
        colorTheme: 'emerald_trust',
        visibleScenes: 'all',
        enabled: true,
      };
    } else {
      newSticker = {
        id: `sticker-${Date.now()}`,
        type: 'guarantee_badge',
        title: '100% ORIGINAL & BPOM',
        subTitle: 'Garansi Uang Kembali',
        positionX: 16,
        positionY: 16,
        scale: 90,
        animation: 'floating',
        colorTheme: 'emerald_trust',
        visibleScenes: 'all',
        enabled: true,
      };
    }

    const updated = [...stickers, newSticker];
    onChangeProject({ dynamicStickers: updated });
    setActiveEditingId(newSticker.id);
  };

  const activeSticker = stickers.find((s) => s.id === activeEditingId) || stickers[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Dynamic Conversion Stickers & Flash Sale Countdown</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tingkatkan *urgency* pembelian dengan jam hitung mundur langsung, stiker diskon berkedip, dan panah animasi ke Keranjang Kuning.
          </p>
        </div>

        {/* Quick Add Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleAddCustomSticker('countdown_timer')}
            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-xl border border-rose-200 transition flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>+ Countdown</span>
          </button>
          <button
            onClick={() => handleAddCustomSticker('yellow_cart_arrow')}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-xl border border-amber-200 transition flex items-center gap-1"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>+ Keranjang Kuning</span>
          </button>
          <button
            onClick={() => handleAddCustomSticker('free_shipping_cod')}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-200 transition flex items-center gap-1"
          >
            <Truck className="w-3 h-3" />
            <span>+ COD / Ongkir</span>
          </button>
        </div>
      </div>

      {/* List of Active Stickers with Toggle Switches */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Stiker Aktif Pada Video:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stickers.map((sticker) => {
            const isEditing = activeEditingId === sticker.id;
            return (
              <div
                key={sticker.id}
                onClick={() => setActiveEditingId(sticker.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isEditing
                    ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
                    {sticker.type === 'countdown_timer' && '⏱️'}
                    {sticker.type === 'flash_discount' && '🏷️'}
                    {sticker.type === 'yellow_cart_arrow' && '🛍️'}
                    {sticker.type === 'guarantee_badge' && '🛡️'}
                    {sticker.type === 'free_shipping_cod' && '🚚'}
                    {sticker.type === 'rating_social_proof' && '⭐'}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {sticker.title}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {sticker.animation} • {sticker.visibleScenes.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Enable Switch */}
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sticker.enabled}
                      onChange={(e) => handleToggleSticker(sticker.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Customizer for Selected Sticker */}
      {activeSticker && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pengaturan Detail: {activeSticker.title}</span>
            </span>

            <button
              onClick={() => {
                const filtered = stickers.filter((s) => s.id !== activeSticker.id);
                onChangeProject({ dynamicStickers: filtered });
                if (filtered[0]) setActiveEditingId(filtered[0].id);
              }}
              className="text-slate-400 hover:text-rose-600 p-1 transition"
              title="Hapus Stiker Ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Title Text */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Teks Utama Stiker
              </label>
              <input
                type="text"
                value={activeSticker.title}
                onChange={(e) => handleUpdateSticker(activeSticker.id, { title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Subtitle / Note */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Teks Keterangan Tambahan
              </label>
              <input
                type="text"
                value={activeSticker.subTitle || ''}
                onChange={(e) => handleUpdateSticker(activeSticker.id, { subTitle: e.target.value })}
                placeholder="Contoh: Klaim voucher sekarang"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Animation & Color Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Tipe Animasi Gerak
              </label>
              <select
                value={activeSticker.animation}
                onChange={(e) =>
                  handleUpdateSticker(activeSticker.id, { animation: e.target.value as any })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="pulse">Pulse (Berkedip Cepat - Urgensi Tinggi)</option>
                <option value="bounce">Bounce (Melompat / Menarik Mata)</option>
                <option value="floating">Floating (Mengambang Halus)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Palet Warna
              </label>
              <select
                value={activeSticker.colorTheme}
                onChange={(e) =>
                  handleUpdateSticker(activeSticker.id, { colorTheme: e.target.value as any })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="urgent_red">Urgent Red (Flash Sale)</option>
                <option value="tiktok_yellow">TikTok Yellow (Keranjang Kuning)</option>
                <option value="emerald_trust">Emerald Green (BPOM & Garansi)</option>
                <option value="purple_vip">VIP Purple (Exclusive)</option>
                <option value="neon_cyan">Neon Cyan (Tech Cyber)</option>
              </select>
            </div>
          </div>

          {/* Position Sliders & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Posisi Horizontal ({activeSticker.positionX}%)
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={activeSticker.positionX}
                onChange={(e) =>
                  handleUpdateSticker(activeSticker.id, { positionX: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-600 mt-1.5"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Posisi Vertikal ({activeSticker.positionY}%)
              </label>
              <input
                type="range"
                min="5"
                max="90"
                value={activeSticker.positionY}
                onChange={(e) =>
                  handleUpdateSticker(activeSticker.id, { positionY: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-600 mt-1.5"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Tampilkan Pada Adegan
              </label>
              <select
                value={activeSticker.visibleScenes}
                onChange={(e) =>
                  handleUpdateSticker(activeSticker.id, { visibleScenes: e.target.value as any })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">Sepanjang Seluruh Video</option>
                <option value="hook_only">Hanya Detik 0-3 (Hook)</option>
                <option value="cta_only">Hanya Adegan Akhir (CTA)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Check,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Type,
  Eye,
  RefreshCw,
  Lock,
  Stamp,
  RotateCw
} from 'lucide-react';
import { AutoWatermarkConfig, PippitProject } from '../../types';
import { WatermarkOverlay } from './WatermarkOverlay';

interface AutoWatermarkSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AutoWatermarkConfig;
  onSaveConfig: (updated: AutoWatermarkConfig) => void;
  project: PippitProject;
}

export const AutoWatermarkSettingsModal: React.FC<AutoWatermarkSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  project,
}) => {
  const [localConfig, setLocalConfig] = useState<AutoWatermarkConfig>({
    enabled: config?.enabled ?? true,
    type: config?.type ?? 'handle',
    text: config?.text || '@glowluxe.official',
    logoUrl: config?.logoUrl || '',
    position: config?.position ?? 'top-right',
    opacity: config?.opacity ?? 0.75,
    scale: config?.scale ?? 100,
    style: config?.style ?? 'subtle_translucent',
    showTimestamp: config?.showTimestamp ?? false,
    showVerifiedIcon: config?.showVerifiedIcon ?? true,
  });

  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(localConfig);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const positions: { id: AutoWatermarkConfig['position']; label: string; icon: string }[] = [
    { id: 'top-left', label: 'Kiri Atas', icon: '↖️' },
    { id: 'top-right', label: 'Kanan Atas', icon: '↗️' },
    { id: 'center', label: 'Tengah Floating', icon: '⏺️' },
    { id: 'bottom-left', label: 'Kiri Bawah', icon: '↙️' },
    { id: 'bottom-right', label: 'Kanan Bawah', icon: '↘️' },
  ];

  const styles: { id: AutoWatermarkConfig['style']; label: string; desc: string; badge: string }[] = [
    {
      id: 'subtle_translucent',
      label: 'Subtle Frosted',
      desc: 'Transparan elegan, tidak mengganggu fokus visual utama.',
      badge: 'Direkomendasikan'
    },
    {
      id: 'pill_badge',
      label: 'Official Brand Pill',
      desc: 'Kapsul hitam pekat dengan border halus dan badge terverifikasi.',
      badge: 'High Trust'
    },
    {
      id: 'neon_glow',
      label: 'Viral Cyber Glow',
      desc: 'Aksen neon glow biru/cyan modern untuk video tren TikTok.',
      badge: 'Eye Catching'
    },
    {
      id: 'minimal_white',
      label: 'Minimal Clean Typography',
      desc: 'Teks putih clean dengan drop shadow tegas tanpa background.',
      badge: 'Clean Aesthetic'
    },
    {
      id: 'anti_theft_diagonal',
      label: 'Anti-Theft Grid Protection',
      desc: 'Watermark berulang diagonal untuk mencegah video dicuri dan di-repost.',
      badge: 'Anti Re-upload'
    },
  ];

  const productImg =
    project.storyboard[0]?.visualUrl ||
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Pengaturan Auto-Watermark & Brand Protection
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI Brand Shield
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Secara otomatis menempelkan watermark logo atau handle toko di setiap video yang diunggah ke TikTok & Reels.
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

        {/* Content Body (Grid 2 cols: Controls & Live Preview) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Master Toggle */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Aktifkan Auto-Watermark di Semua Unggahan
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Setiap video yang diekspor atau diposting otomatis memiliki identitas toko resmi.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.enabled}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Type Selector: Handle / Brand Name / Custom Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sumber Teks / Identitas Watermark
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'handle', label: 'Handle Akun Target', icon: '@' },
                  { id: 'brand_name', label: 'Nama Brand Toko', icon: '🏷️' },
                  { id: 'custom_text', label: 'Teks Kustom', icon: '✍️' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        type: t.id as any,
                        text:
                          t.id === 'handle'
                            ? '@glowluxe.official'
                            : t.id === 'brand_name'
                            ? project.inputData.productAnalysis?.brandName || 'GlowLuxe Store'
                            : prev.text,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      localConfig.type === t.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>

              {localConfig.type === 'custom_text' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={localConfig.text}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, text: e.target.value }))
                    }
                    placeholder="Contoh: @toko.resmi.id | Official Store"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Position Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Posisi Watermark di Layar Video
              </label>
              <div className="grid grid-cols-5 gap-2">
                {positions.map((p) => {
                  const isSelected = localConfig.position === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        setLocalConfig((prev) => ({ ...prev, position: p.id }))
                      }
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-1 ring-indigo-600/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">{p.icon}</span>
                      <span className="text-[10px] truncate w-full">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Watermark Preset Styles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Gaya Desain & Tampilan Visual
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {styles.map((s) => {
                  const isSelected = localConfig.style === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() =>
                        setLocalConfig((prev) => ({ ...prev, style: s.id }))
                      }
                      className={`p-3 rounded-2xl border cursor-pointer transition select-none flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-600 ring-1 ring-indigo-500/40 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {s.label}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sliders: Opacity & Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Transparansi (Opacity)</span>
                  <span className="text-indigo-600 font-bold">
                    {Math.round(localConfig.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={localConfig.opacity}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      opacity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Ukuran (Scale)</span>
                  <span className="text-indigo-600 font-bold">
                    {localConfig.scale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={localConfig.scale}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      scale: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Toggles: Verified Badge & Timestamp */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localConfig.showVerifiedIcon}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      showVerifiedIcon: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">
                  Sematkan Ikon Centang Verified Biru ✓
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localConfig.showTimestamp}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      showTimestamp: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">
                  Tampilkan Timestamp & Waktu Posting
                </span>
              </label>
            </div>
          </div>

          {/* Live Mobile Video Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 text-white relative shadow-inner">
            <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-400 font-semibold border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Feed Preview Overlay</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {localConfig.enabled ? 'ACTIVE OVERLAY' : 'DISABLED'}
              </span>
            </div>

            {/* Mockup Screen */}
            <div className="aspect-[9/16] w-full max-w-[240px] rounded-2xl bg-black overflow-hidden relative border-2 border-slate-700 shadow-2xl my-3">
              <img
                src={productImg}
                alt="Watermark Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

              {/* Watermark Overlay Render */}
              <WatermarkOverlay
                config={localConfig}
                accountHandle={localConfig.text || '@glowluxe.official'}
                brandName={project.inputData.productAnalysis?.brandName || 'GlowLuxe Official'}
              />

              {/* Mock UI Indicators */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1 pointer-events-none">
                <div className="text-[10px] font-bold truncate">
                  {localConfig.text || '@glowluxe.official'}
                </div>
                <div className="text-[8px] line-clamp-1 text-slate-300">
                  {project.storyboard[0]?.voiceoverText || 'Review produk viral terbaru...'}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center max-w-[240px]">
              Watermark dirender secara instan pada frame video MP4 & MOV sebelum disalurkan ke API media sosial.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() =>
              setLocalConfig({
                enabled: true,
                type: 'handle',
                text: '@glowluxe.official',
                logoUrl: '',
                position: 'top-right',
                opacity: 0.75,
                scale: 100,
                style: 'subtle_translucent',
                showTimestamp: false,
                showVerifiedIcon: true,
              })
            }
            className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-200 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{savedToast ? 'Tersimpan!' : 'Terapkan Watermark'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

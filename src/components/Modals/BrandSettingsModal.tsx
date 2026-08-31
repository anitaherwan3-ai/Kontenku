import React, { useState } from 'react';
import {
  X,
  Palette,
  Type as TypeIcon,
  Sparkles,
  Check,
  ShieldCheck,
  Sliders,
  Layers,
  Wand2,
  RefreshCw,
  Eye,
  CheckCircle2,
  Smartphone,
  Tag
} from 'lucide-react';
import { BrandKitSettings, PippitProject } from '../../types';

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PippitProject;
  onUpdateProject?: (updated: Partial<PippitProject>) => void;
  onChangeProject?: (updated: Partial<PippitProject>) => void;
}

const BRAND_PALETTE_PRESETS = [
  {
    id: 'preset-luxe',
    name: 'Clean Luxe & Skin Science',
    category: 'Beauty & Skincare',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    accentColor: '#10b981',
    neutralColor: '#0f172a',
    backgroundColor: '#ffffff',
    captionHighlightColor: '#fbbf24',
    fontFamilyHeading: 'Plus Jakarta Sans' as const,
    fontFamilyBody: 'Plus Jakarta Sans' as const,
    previewGradient: 'from-indigo-500 via-amber-400 to-emerald-400'
  },
  {
    id: 'preset-tiktok-neon',
    name: 'TikTok Viral Neon & Hype',
    category: 'Viral & Gen-Z',
    primaryColor: '#ec4899',
    secondaryColor: '#06b6d4',
    accentColor: '#facc15',
    neutralColor: '#090d16',
    backgroundColor: '#ffffff',
    captionHighlightColor: '#facc15',
    fontFamilyHeading: 'Bebas Neue' as const,
    fontFamilyBody: 'Montserrat' as const,
    previewGradient: 'from-pink-500 via-cyan-400 to-yellow-400'
  },
  {
    id: 'preset-cyber-tech',
    name: 'Cyber Gaming & High Tech',
    category: 'Gadgets & Gaming',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    neutralColor: '#020617',
    backgroundColor: '#ffffff',
    captionHighlightColor: '#38bdf8',
    fontFamilyHeading: 'Inter' as const,
    fontFamilyBody: 'Inter' as const,
    previewGradient: 'from-blue-500 via-purple-500 to-teal-400'
  },
  {
    id: 'preset-gourmet-warm',
    name: 'Gourmet F&B & Relatable',
    category: 'Food & Beverage',
    primaryColor: '#ea580c',
    secondaryColor: '#f59e0b',
    accentColor: '#84cc16',
    neutralColor: '#1c1917',
    backgroundColor: '#ffffff',
    captionHighlightColor: '#fde047',
    fontFamilyHeading: 'Montserrat' as const,
    fontFamilyBody: 'Plus Jakarta Sans' as const,
    previewGradient: 'from-orange-500 via-amber-500 to-lime-400'
  },
  {
    id: 'preset-luxury-gold',
    name: 'Royal Heritage & Gold',
    category: 'Fashion & Jewelry',
    primaryColor: '#d97706',
    secondaryColor: '#ca8a04',
    accentColor: '#e11d48',
    neutralColor: '#18181b',
    backgroundColor: '#ffffff',
    captionHighlightColor: '#fef08a',
    fontFamilyHeading: 'Playfair' as const,
    fontFamilyBody: 'Plus Jakarta Sans' as const,
    previewGradient: 'from-amber-600 via-yellow-500 to-rose-600'
  }
];

const AVAILABLE_FONTS: Array<BrandKitSettings['fontFamilyHeading']> = [
  'Plus Jakarta Sans',
  'Montserrat',
  'Inter',
  'Bebas Neue',
  'Playfair',
  'Impact'
];

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  onChangeProject
}) => {
  const initialBrand: BrandKitSettings = project.brandKit || {
    brandName: project.inputData?.productAnalysis?.brandName || 'Brand Official',
    brandTagline: 'Solusi Terpercaya & Kualitas Terbaik',
    logoUrl: project.inputData?.uploadedAssets?.find(a => a.type === 'logo')?.url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    accentColor: '#10b981',
    neutralColor: '#0f172a',
    backgroundColor: '#ffffff',
    fontFamilyHeading: 'Plus Jakarta Sans',
    fontFamilyBody: 'Plus Jakarta Sans',
    captionHighlightColor: '#fbbf24',
    captionTextColor: '#ffffff',
    captionBoxColor: '#0f172a',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    badgeStyle: 'modern_pill',
    defaultToneOfVoice: 'Excited UGC, jujur, relatable',
    autoApplyToCaptions: true,
    autoApplyToWatermark: true,
    autoApplyToStickers: true
  };

  const [brandKit, setBrandKit] = useState<BrandKitSettings>(initialBrand);
  const [activeTab, setActiveTab] = useState<'palette' | 'typography' | 'rules' | 'presets'>('palette');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof BRAND_PALETTE_PRESETS[0]) => {
    setBrandKit(prev => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      neutralColor: preset.neutralColor,
      backgroundColor: preset.backgroundColor,
      captionHighlightColor: preset.captionHighlightColor,
      fontFamilyHeading: preset.fontFamilyHeading,
      fontFamilyBody: preset.fontFamilyBody
    }));
  };

  const handleSaveAndSync = (autoSyncVideo: boolean = true) => {
    const updates: Partial<PippitProject> = {
      brandKit: { ...brandKit }
    };

    if (autoSyncVideo) {
      // Propagate brand colors and fonts to kinetic captions
      if (brandKit.autoApplyToCaptions && project.captionStyle) {
        updates.captionStyle = {
          ...project.captionStyle,
          highlightColor: brandKit.captionHighlightColor,
          fontFamily: brandKit.fontFamilyHeading,
          textColor: brandKit.captionTextColor || '#ffffff'
        };
      }

      // Propagate watermark handle
      if (brandKit.autoApplyToWatermark && project.watermarkConfig) {
        updates.watermarkConfig = {
          ...project.watermarkConfig,
          enabled: brandKit.watermarkEnabled,
          position: brandKit.watermarkPosition,
          text: `@${brandKit.brandName.toLowerCase().replace(/\s+/g, '')}`
        };
      }
    }

    const updater = onChangeProject || onUpdateProject;
    if (updater) {
      updater(updates);
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Project Brand Kit & Konsistensi Visual</h2>
                <span className="hidden sm:inline px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Auto-Sync Video
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 sm:line-clamp-none">
                Atur palet warna, tipografi, dan aset identitas agar seluruh video iklan otomatis konsisten.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('palette')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'palette'
                ? 'text-indigo-400 border-indigo-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Palet Warna Brand
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'typography'
                ? 'text-indigo-400 border-indigo-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <TypeIcon className="w-3.5 h-3.5" />
            Font & Tipografi
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'presets'
                ? 'text-indigo-400 border-indigo-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Koleksi Preset Industri
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'rules'
                ? 'text-indigo-400 border-indigo-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Aturan Auto-Konsistensi
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Row: Brand Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Brand / Toko</label>
              <input
                type="text"
                value={brandKit.brandName}
                onChange={e => setBrandKit({ ...brandKit, brandName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: GlowLuxe Skin Lab"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tagline Singkat Brand</label>
              <input
                type="text"
                value={brandKit.brandTagline || ''}
                onChange={e => setBrandKit({ ...brandKit, brandTagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Kualitas Dermatology Teruji BPOM"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL Logo Brand</label>
              <input
                type="text"
                value={brandKit.logoUrl || ''}
                onChange={e => setBrandKit({ ...brandKit, logoUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Tab 1: Palette */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Color Selectors */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    Warna Utama & Aksen Brand
                  </h3>

                  {/* Primary */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Warna Utama (Primary Brand)
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                          Tombol & CTA
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Dominan di badge, tombol belanja & logo banner</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.primaryColor}
                        onChange={e => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={brandKit.primaryColor}
                        onChange={e => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Secondary */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Warna Sekunder (Secondary)
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          Promo & Rating
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Dipakai untuk badge diskon, bintang rating & border aksen</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.secondaryColor}
                        onChange={e => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={brandKit.secondaryColor}
                        onChange={e => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Accent Highlight */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Highlight Subtitle (Kinetic Karaoke)
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                          Highlight Kata
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Warna kata yang menyala saat diucapkan di subtitle video</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.captionHighlightColor}
                        onChange={e => setBrandKit({ ...brandKit, captionHighlightColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={brandKit.captionHighlightColor}
                        onChange={e => setBrandKit({ ...brandKit, captionHighlightColor: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Neutral / Text Base */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div>
                      <div className="text-xs font-bold text-white">Warna Teks Standar & Box</div>
                      <div className="text-[11px] text-slate-400">Warna font dasar subtitle dan background pill badge</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandKit.captionTextColor}
                        onChange={e => setBrandKit({ ...brandKit, captionTextColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={brandKit.captionTextColor}
                        onChange={e => setBrandKit({ ...brandKit, captionTextColor: e.target.value })}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Live Visual Preview Card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Smartphone className="w-32 h-32" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        Simulasi Visual Iklan Video
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        9:16 Vertical
                      </span>
                    </div>

                    {/* Simulated Subtitle Box */}
                    <div
                      className="p-4 rounded-xl text-center shadow-lg transition-all"
                      style={{
                        backgroundColor: brandKit.neutralColor || '#0f172a',
                        border: `2px solid ${brandKit.primaryColor}`
                      }}
                    >
                      <div
                        className="text-xs font-black uppercase tracking-wider mb-1"
                        style={{ color: brandKit.primaryColor }}
                      >
                        {brandKit.brandName} • Official Ad
                      </div>
                      <p
                        className="text-sm font-extrabold leading-snug"
                        style={{
                          color: brandKit.captionTextColor,
                          fontFamily: brandKit.fontFamilyHeading
                        }}
                      >
                        Kulit glowing modal{' '}
                        <span
                          className="px-1.5 py-0.5 rounded shadow-sm"
                          style={{
                            backgroundColor: brandKit.captionHighlightColor,
                            color: '#000000'
                          }}
                        >
                          80 Ribuan
                        </span>{' '}
                        dalam 7 Hari!
                      </p>
                    </div>

                    {/* Simulated Stickers & Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div
                        className="p-2.5 rounded-lg flex items-center gap-2 shadow"
                        style={{
                          backgroundColor: `${brandKit.secondaryColor}20`,
                          border: `1px solid ${brandKit.secondaryColor}`
                        }}
                      >
                        <Tag className="w-4 h-4" style={{ color: brandKit.secondaryColor }} />
                        <div>
                          <div className="text-[10px] font-bold" style={{ color: brandKit.secondaryColor }}>
                            FLASH SALE
                          </div>
                          <div className="text-[11px] font-black text-white">DISKON 45%</div>
                        </div>
                      </div>

                      <div
                        className="p-2.5 rounded-lg flex items-center gap-2 shadow"
                        style={{
                          backgroundColor: `${brandKit.accentColor}20`,
                          border: `1px solid ${brandKit.accentColor}`
                        }}
                      >
                        <ShieldCheck className="w-4 h-4" style={{ color: brandKit.accentColor }} />
                        <div>
                          <div className="text-[10px] font-bold" style={{ color: brandKit.accentColor }}>
                            100% BPOM
                          </div>
                          <div className="text-[11px] font-black text-white">GARANSI ASLI</div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated TikTok CTA Button */}
                    <div
                      className="w-full py-2.5 rounded-xl text-center text-xs font-black uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: brandKit.primaryColor,
                        fontFamily: brandKit.fontFamilyHeading
                      }}
                    >
                      <span>👇 Tap Keranjang Kuning</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Kontras WCAG AA Lolos (100% Readable)
                    </span>
                    <span className="font-mono text-slate-500">Pippit Brand Consistency v2.6</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Typography */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Heading Font */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <TypeIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Font Judul & Kinetic Hook (Heading)
                  </label>
                  <p className="text-xs text-slate-400">
                    Digunakan pada teks Hook detik 0-3, badge penawaran, dan judul sticker promosi.
                  </p>

                  <div className="space-y-2">
                    {AVAILABLE_FONTS.map(font => (
                      <button
                        key={font}
                        onClick={() => setBrandKit({ ...brandKit, fontFamilyHeading: font })}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                          brandKit.fontFamilyHeading === font
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{font}</div>
                          <div
                            className="text-base font-extrabold text-white mt-0.5 tracking-tight"
                            style={{ fontFamily: font }}
                          >
                            VIRAL TIKTOK HOOK PROMO!
                          </div>
                        </div>
                        {brandKit.fontFamilyHeading === font && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Font */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <TypeIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Font Body & Narasi Voiceover
                  </label>
                  <p className="text-xs text-slate-400">
                    Digunakan untuk subtitle karaoke narasi, deskripsi produk USP, dan watermark handle.
                  </p>

                  <div className="space-y-2">
                    {AVAILABLE_FONTS.map(font => (
                      <button
                        key={font}
                        onClick={() => setBrandKit({ ...brandKit, fontFamilyBody: font })}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                          brandKit.fontFamilyBody === font
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{font}</div>
                          <div
                            className="text-sm font-medium text-slate-200 mt-0.5"
                            style={{ fontFamily: font }}
                          >
                            Tekstur watery gel tidak lengket & langsung meresap cepat.
                          </div>
                        </div>
                        {brandKit.fontFamilyBody === font && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Preset Palet & Font Terverifikasi Konversi Tinggi
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih preset industri siap pakai yang sudah diuji menghasilkan CTR tertinggi di TikTok & Instagram Ads.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BRAND_PALETTE_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-slate-900 text-indigo-400 px-2 py-0.5 rounded">
                          {preset.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5">{preset.name}</h4>

                      {/* Color dots */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: preset.primaryColor }}
                          title={`Primary: ${preset.primaryColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: preset.secondaryColor }}
                          title={`Secondary: ${preset.secondaryColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: preset.accentColor }}
                          title={`Accent: ${preset.accentColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: preset.captionHighlightColor }}
                          title={`Subtitle Highlight: ${preset.captionHighlightColor}`}
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 mt-2">
                        Font: <span className="text-slate-200 font-semibold">{preset.fontFamilyHeading}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyPreset(preset)}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-xs font-semibold text-white border border-slate-700 hover:border-indigo-500 transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Gunakan Preset Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Rules & Auto-Apply */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Aturan Otomatisasi Brand Kit ke Output Video
                </h3>
                <p className="text-xs text-slate-400">
                  Aktifkan fitur ini agar setiap kali storyboard dibuat atau diedit, palet warna dan font brand langsung disematkan.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/60 transition">
                  <input
                    type="checkbox"
                    checked={brandKit.autoApplyToCaptions}
                    onChange={e => setBrandKit({ ...brandKit, autoApplyToCaptions: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Sinkronisasi Otomatis ke Kinetic Subtitle</div>
                    <div className="text-[11px] text-slate-400">
                      Warna sorotan subtitle (karaoke highlight) dan font tipografi akan mengikuti Brand Kit di semua scene video.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/60 transition">
                  <input
                    type="checkbox"
                    checked={brandKit.autoApplyToWatermark}
                    onChange={e => setBrandKit({ ...brandKit, autoApplyToWatermark: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Sematkan Watermark Handle Toko Otomatis</div>
                    <div className="text-[11px] text-slate-400">
                      Menampilkan badge identitas resmi brand di sudut video untuk perlindungan hak cipta dan pengenalan brand.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/60 transition">
                  <input
                    type="checkbox"
                    checked={brandKit.autoApplyToStickers}
                    onChange={e => setBrandKit({ ...brandKit, autoApplyToStickers: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Harmonisasi Warna Dynamic Stickers & Flash Countdown</div>
                    <div className="text-[11px] text-slate-400">
                      Menyesuaikan palet stiker diskon, timer mundur, dan badge ulasan bintang 5 dengan warna sekunder brand.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Brand Kit berhasil diterapkan ke seluruh video!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition"
            >
              Tutup
            </button>
            <button
              onClick={() => handleSaveAndSync(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              Terapkan ke Seluruh Video & Subtitle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

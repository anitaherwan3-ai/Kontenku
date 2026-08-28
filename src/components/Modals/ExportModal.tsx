import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  Film,
  Sparkles,
  CheckCircle2,
  Copy,
  Layers,
  Share2,
  Smartphone,
  Square,
  Monitor,
  Move,
  Type,
  Maximize2,
  ShieldCheck,
  Eye,
  Sliders,
  Check,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PippitProject, AspectRatio } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PippitProject;
  onChangeProject?: (newProject: Partial<PippitProject>) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onChangeProject,
}) => {
  const [exportFormat, setExportFormat] = useState<'mp4_1080p' | 'mp4_4k' | 'json_package' | 'srt_subtitles'>('mp4_1080p');
  const [targetRatio, setTargetRatio] = useState<AspectRatio>(project.inputData.aspectRatio || '9:16');
  const [autoAdaptLayout, setAutoAdaptLayout] = useState<boolean>(true);
  const [activePreviewMode, setActivePreviewMode] = useState<'with_ui_overlay' | 'clean_render'>('with_ui_overlay');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  // Active scene sample for preview
  const previewScene = project.storyboard[0] || {
    onScreenText: '🔥 RACUN TIKTOK VIRAL! DISKON 50%',
    voiceoverText: 'Kalian wajib tahu produk yang lagi viral banget ini!',
    avatarAction: 'Host memegang produk dengan antusias',
  };

  // Calculated adaptation parameters based on format & auto-adapt toggle
  const getAdaptedSpecs = (ratio: AspectRatio, autoAdapt: boolean) => {
    if (!autoAdapt) {
      return {
        textPosY: project.captionStyle?.positionY || 75,
        fontSize: project.captionStyle?.fontSize || 24,
        paddingSide: 'px-4',
        safeZoneTop: '10%',
        safeZoneBottom: '20%',
        avatarAnchor: 'bottom-center',
        focalCrop: 'standard',
        description: 'Format mentah tanpa adaptasi safe-zone (Teks berisiko terpotong UI aplikasi).',
      };
    }

    switch (ratio) {
      case '1:1':
        return {
          textPosY: 58, // Moved up to avoid IG Feed bottom icons & description
          fontSize: 20, // Scaled slightly for square density
          paddingSide: 'px-8',
          safeZoneTop: '12%',
          safeZoneBottom: '16%',
          avatarAnchor: 'bottom-right-compact',
          focalCrop: 'smart-center-focal',
          description: 'Posisi teks dinaikkan ke 58% (Center-Bottom) & margin samping 8px agar 100% bebas dari crop Instagram Feed.',
        };
      case '16:9':
        return {
          textPosY: 82, // Standard lower-third for YouTube landscape
          fontSize: 26,
          paddingSide: 'px-16',
          safeZoneTop: '8%',
          safeZoneBottom: '12%',
          avatarAnchor: 'left-split',
          focalCrop: 'cinematic-widescreen',
          description: 'Posisi teks disesuaikan ke Lower-Third (82%) dengan margin horizontal lebar untuk YouTube Desktop & TV.',
        };
      case '9:16':
      default:
        return {
          textPosY: 72, // TikTok bottom safe-zone above caption & right sidebar
          fontSize: 24,
          paddingSide: 'px-5',
          safeZoneTop: '14%', // Under top search & for you tabs
          safeZoneBottom: '22%', // Above music disk & username
          avatarAnchor: 'bottom-center',
          focalCrop: 'full-vertical',
          description: 'Posisi teks dioptimalkan di zona aman 9:16 TikTok/Reels di atas username dan di samping tombol Like/Share.',
        };
    }
  };

  const currentSpecs = getAdaptedSpecs(targetRatio, autoAdaptLayout);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
      });
    }, 1500);
  };

  const handleCopyFullScript = () => {
    const fullScript = project.storyboard
      .map(
        (sc) =>
          `[Scene ${sc.sceneNumber} - ${sc.sceneType.toUpperCase()} (${sc.durationSeconds}s)]\nVoiceover: ${sc.voiceoverText}\nOn-Screen Text: ${sc.onScreenText}\nVisual Seedance: ${sc.visualPrompt}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleApplyToProject = () => {
    if (onChangeProject) {
      onChangeProject({
        inputData: {
          ...project.inputData,
          aspectRatio: targetRatio,
        },
        captionStyle: {
          ...project.captionStyle,
          positionY: currentSpecs.textPosY,
          fontSize: currentSpecs.fontSize,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative my-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Export & Auto-Adaptasi Tata Letak</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Multi-Format Render
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilih rasio aspek target dan sesuaikan penempatan teks otomatis untuk TikTok vs Instagram Feed.
            </p>
          </div>
        </div>

        {/* FEATURE: Target Aspect Ratio & Auto-Adapt Toggle */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
          {/* Ratio Selector Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pilih Format Rasio Output:</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Format Proyek Asli: <strong>{project.inputData.aspectRatio}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* 9:16 Vertical */}
              <button
                type="button"
                onClick={() => setTargetRatio('9:16')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  targetRatio === '9:16'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>9:16 Vertical</span>
                  </div>
                  {targetRatio === '9:16' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">TikTok, IG Reels, YT Shorts</p>
              </button>

              {/* 1:1 Square */}
              <button
                type="button"
                onClick={() => setTargetRatio('1:1')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  targetRatio === '1:1'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Square className="w-4 h-4 text-indigo-600" />
                    <span>1:1 Square</span>
                  </div>
                  {targetRatio === '1:1' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">Instagram Feed, Carousel Video</p>
              </button>

              {/* 16:9 Landscape */}
              <button
                type="button"
                onClick={() => setTargetRatio('16:9')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  targetRatio === '16:9'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Monitor className="w-4 h-4 text-indigo-600" />
                    <span>16:9 Landscape</span>
                  </div>
                  {targetRatio === '16:9' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">YouTube Display & Web Ads</p>
              </button>
            </div>
          </div>

          {/* TOGGLE: Auto-Adapt Layout & Text Placement */}
          <div className="p-3.5 bg-white border border-indigo-100 rounded-xl flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Adaptasi Tata Letak & Posisi Teks Otomatis (Smart Safe-Zone)
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Auto-Safe
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Menyesuaikan koordinat Y teks, safe margin, dan framing avatar secara dinamis agar tidak terpotong tombol UI platform.
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={autoAdaptLayout}
              onClick={() => setAutoAdaptLayout(!autoAdaptLayout)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoAdaptLayout ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  autoAdaptLayout ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Interactive Safe-Zone Simulation Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulasi Preview Format ({targetRatio === '1:1' ? '1:1 Square IG Feed' : targetRatio === '9:16' ? '9:16 Vertical TikTok' : '16:9 Landscape'}):</span>
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActivePreviewMode(activePreviewMode === 'with_ui_overlay' ? 'clean_render' : 'with_ui_overlay')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                  {activePreviewMode === 'with_ui_overlay' ? 'Sembunyikan Overlay UI Platform' : 'Tampilkan Overlay UI Platform'}
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-3 h-52 border border-slate-700">
              {/* Background Mockup Image */}
              <img
                src={project.storyboard[0]?.visualUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"}
                alt="Preview Background"
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                  targetRatio === '1:1' ? 'scale-105 filter blur-xs opacity-60' : 'opacity-70'
                }`}
              />

              {/* Target Ratio Frame Boundary */}
              <div
                className={`relative border-2 border-indigo-400/80 rounded-lg overflow-hidden bg-slate-950/70 shadow-2xl flex flex-col justify-between p-2.5 transition-all duration-300 ${
                  targetRatio === '1:1'
                    ? 'w-44 h-44 aspect-square'
                    : targetRatio === '16:9'
                    ? 'w-64 h-36 aspect-video'
                    : 'w-28 h-48 aspect-[9/16]'
                }`}
              >
                {/* Platform Overlay Badges (Simulated) */}
                {activePreviewMode === 'with_ui_overlay' && (
                  <>
                    {/* Top Safe Area indicator */}
                    <div className="flex items-center justify-between text-[8px] text-white/70 border-b border-white/10 pb-1">
                      <span>{targetRatio === '1:1' ? '📷 Instagram Feed' : targetRatio === '9:16' ? '🎵 TikTok For You' : '▶ YouTube'}</span>
                      <span className="text-[7px] text-emerald-400 font-bold">✓ Safe Area</span>
                    </div>

                    {/* Right side TikTok buttons if 9:16 */}
                    {targetRatio === '9:16' && (
                      <div className="absolute right-1.5 top-14 flex flex-col items-center gap-1.5 text-white/80">
                        <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[7px]">❤️</div>
                        <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[7px]">💬</div>
                        <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[7px]">🔗</div>
                      </div>
                    )}
                  </>
                )}

                {/* Avatar Anchor */}
                <div
                  className={`absolute ${
                    currentSpecs.avatarAnchor === 'bottom-right-compact'
                      ? 'bottom-2 right-2 w-7 h-7'
                      : currentSpecs.avatarAnchor === 'left-split'
                      ? 'bottom-2 left-2 w-8 h-8'
                      : 'bottom-2 left-2 w-7 h-7'
                  } rounded-full border border-indigo-400 overflow-hidden shadow-md z-10`}
                >
                  <img
                    src={project.selectedAvatar.avatarImage}
                    alt={project.selectedAvatar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Adapted Dynamic On-Screen Text Placement */}
                <div
                  className="w-full text-center transition-all duration-300 px-1"
                  style={{
                    marginTop: `${currentSpecs.textPosY * 0.4}px`,
                  }}
                >
                  <span
                    className="inline-block px-1.5 py-0.5 bg-indigo-600/95 text-white font-extrabold rounded shadow-md leading-tight text-[9px] border border-indigo-300/40"
                    style={{
                      fontSize: targetRatio === '1:1' ? '8.5px' : '9px',
                    }}
                  >
                    {previewScene.onScreenText || 'PROMO VIRAL KONTENKU'}
                  </span>
                </div>

                {/* Bottom Safe Area Status */}
                <div className="text-[7px] text-white/50 text-center truncate">
                  Y-Anchor: {currentSpecs.textPosY}% • {currentSpecs.focalCrop}
                </div>
              </div>
            </div>

            {/* Spec Details Note */}
            <div className="p-2.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Konfigurasi Adaptasi: </strong>
                <span>{currentSpecs.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Pilih Format Ekstensi File:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'mp4_1080p', label: `MP4 Video 1080p (${targetRatio})`, desc: 'Optimal untuk TikTok & Reels Ads' },
              { id: 'mp4_4k', label: 'MP4 Master 4K Ultra HD', desc: 'Kualitas tertinggi TV & Display' },
              { id: 'srt_subtitles', label: 'File Subtitle (.SRT)', desc: 'Takarir karaoke tersinkron' },
              { id: 'json_package', label: 'Paket Data Proyek (JSON)', desc: 'Simpan ke cloud/arsip' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setExportFormat(fmt.id as any)}
                className={`p-3 text-left rounded-xl border text-xs transition ${
                  exportFormat === fmt.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="text-slate-900 font-semibold">{fmt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Merender Video Adaptif ({targetRatio} Safe-Zone)...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Download Dimulai! Klik Lagi untuk Unduh Ulang ({targetRatio})</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Render & Download File ({targetRatio} Adaptif)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyFullScript}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              {copiedScript ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Naskah Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Naskah & Prompts</span>
                </>
              )}
            </button>

            <button
              onClick={handleApplyToProject}
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              <span>Terapkan Format ke Proyek</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

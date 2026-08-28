import React, { useState } from 'react';
import {
  X,
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  Layers,
  Smartphone,
  Square,
  Monitor,
  Check,
  FileArchive,
  FileCode,
  Image as ImageIcon,
  Zap,
  Sliders,
  RefreshCw,
  HardDrive,
  FolderArchive,
  Settings2,
  Music,
  FileText,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { PippitProject, AspectRatio, RenderFormat } from '../../types';
import { useRenderQueue } from '../../context/RenderQueueContext';

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PippitProject;
}

export interface ExportFormatOption {
  id: RenderFormat;
  name: string;
  extension: string;
  codec: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  estimatedSizePerVariant: number; // in MB
}

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { enqueueBulkBatch, batches, downloadTaskArtifact, downloadBatchZip, setIsDockOpen } = useRenderQueue();

  // Format selections
  const [selectedFormats, setSelectedFormats] = useState<RenderFormat[]>([
    'mp4',
    'mov',
    'gif',
  ]);

  // Aspect ratio selections
  const [selectedRatios, setSelectedRatios] = useState<AspectRatio[]>([
    '9:16',
    '1:1',
    '16:9',
  ]);

  // Quality & render settings
  const [renderQuality, setRenderQuality] = useState<'1080p' | '4k' | '720p_lite'>('1080p');
  const [fps, setFps] = useState<30 | 60>(60);
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeSafeZoneGuide, setIncludeSafeZoneGuide] = useState(false);

  // Active batch ID for live tracking inside modal
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBatch = batches.find((b) => b.id === activeBatchId);

  const formatOptions: ExportFormatOption[] = [
    {
      id: 'mp4',
      name: 'MP4 Video Master',
      extension: '.mp4',
      codec: 'H.264 / AAC High Profile',
      description: 'Format universal siap tayang untuk TikTok Shop, Instagram Reels, FB Ads, dan YouTube Shorts.',
      icon: <Film className="w-5 h-5 text-indigo-600" />,
      badge: 'Paling Populer',
      estimatedSizePerVariant: renderQuality === '4k' ? 45.2 : renderQuality === '1080p' ? 18.5 : 8.2,
    },
    {
      id: 'mov',
      name: 'MOV Apple ProRes / HQ',
      extension: '.mov',
      codec: 'Apple ProRes 422 HQ / Alpha Channel',
      description: 'Format master video uncompressed tanpa kompresi, kualitas studio editing profesional Premiere & Final Cut.',
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      badge: 'Studio Master',
      estimatedSizePerVariant: renderQuality === '4k' ? 140.0 : renderQuality === '1080p' ? 62.4 : 32.0,
    },
    {
      id: 'gif',
      name: 'GIF Looping Animated Clip',
      extension: '.gif',
      codec: 'Web-Optimized 50fps Loop',
      description: 'Animasi looping ringan untuk banner email marketing, etalase website e-commerce, & chat WhatsApp.',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badge: 'Web & Email Ready',
      estimatedSizePerVariant: 4.8,
    },
    {
      id: 'srt',
      name: 'Subtitle SRT & VTT Package',
      extension: '.srt / .vtt',
      codec: 'UTF-8 Synchronized Subtitles',
      description: 'Teks tertutup (closed caption) berjangka waktu persis untuk SEO video dan caption otomatis multi-bahasa.',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      badge: 'SEO Boost',
      estimatedSizePerVariant: 0.1,
    },
    {
      id: 'audio_pack',
      name: 'Audio Voiceover & BGM Pack',
      extension: '.wav + .mp3',
      codec: 'Stereo 48kHz / 320kbps',
      description: 'File terpisah suara narasi AI TTS jernih dan trek musik viral untuk mixing manual.',
      icon: <Music className="w-5 h-5 text-purple-600" />,
      badge: 'Audio Only',
      estimatedSizePerVariant: 6.2,
    },
  ];

  const ratioOptions: { id: AspectRatio; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: '9:16',
      name: '9:16 Vertical',
      icon: <Smartphone className="w-4 h-4" />,
      desc: 'TikTok, IG Reels, YT Shorts (1080x1920)',
    },
    {
      id: '1:1',
      name: '1:1 Square',
      icon: <Square className="w-4 h-4" />,
      desc: 'Instagram Feed & FB Carousel (1080x1080)',
    },
    {
      id: '16:9',
      name: '16:9 Landscape',
      icon: <Monitor className="w-4 h-4" />,
      desc: 'YouTube Desktop, FB In-Stream (1920x1080)',
    },
  ];

  const toggleFormat = (id: RenderFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((f) => f !== id) : prev) : [...prev, id]
    );
  };

  const toggleRatio = (ratio: AspectRatio) => {
    setSelectedRatios((prev) =>
      prev.includes(ratio) ? (prev.length > 1 ? prev.filter((r) => r !== ratio) : prev) : [...prev, ratio]
    );
  };

  // Calculate estimated total package size
  const totalFilesCount =
    (selectedFormats.includes('mp4') ? selectedRatios.length : 0) +
    (selectedFormats.includes('mov') ? selectedRatios.length : 0) +
    (selectedFormats.includes('gif') ? selectedRatios.length : 0) +
    (selectedFormats.includes('srt') ? 1 : 0) +
    (selectedFormats.includes('audio_pack') ? 1 : 0);

  const totalEstimatedMb = selectedFormats.reduce((acc, fmtId) => {
    const fmt = formatOptions.find((f) => f.id === fmtId);
    if (!fmt) return acc;
    if (fmtId === 'srt' || fmtId === 'audio_pack') {
      return acc + fmt.estimatedSizePerVariant;
    }
    return acc + fmt.estimatedSizePerVariant * selectedRatios.length;
  }, 0);

  // Trigger Asynchronous Background Queue Dispatch
  const handleStartBulkExportBackground = () => {
    const taskConfigs: any[] = [];

    selectedFormats.forEach((fmt) => {
      if (fmt === 'mp4' || fmt === 'mov' || fmt === 'gif') {
        selectedRatios.forEach((ratio) => {
          taskConfigs.push({
            projectId: project.id,
            projectTitle: project.title || 'Video Campaign',
            format: fmt,
            aspectRatio: ratio,
            resolution: renderQuality,
            fps,
            includeCaptions,
            includeAudio,
          });
        });
      } else {
        // SRT or Audio Pack (single ratio independent)
        taskConfigs.push({
          projectId: project.id,
          projectTitle: project.title || 'Video Campaign',
          format: fmt,
          aspectRatio: '9:16',
          resolution: renderQuality,
          fps,
          includeCaptions,
          includeAudio,
        });
      }
    });

    const batchId = enqueueBulkBatch(
      `Ekspor Massal: ${project.title || 'Video Campaign'}`,
      taskConfigs
    );

    setActiveBatchId(batchId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Ekspor Massal Background Renderer
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Non-Blocking Queue
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Render multi-format (MP4, MOV, GIF, SRT) di latar belakang tanpa membekukan antarmuka aplikasi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 text-xs">
          
          {/* STEP 1: Choose Formats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <span>1. Pilih Format Video & Aset yang Ingin Dibuat</span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  ({selectedFormats.length} Dipilih)
                </span>
              </label>
              <button
                type="button"
                onClick={() => setSelectedFormats(['mp4', 'mov', 'gif', 'srt', 'audio_pack'])}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Pilih Semua Format
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formatOptions.map((fmt) => {
                const isSelected = selectedFormats.includes(fmt.id);
                return (
                  <div
                    key={fmt.id}
                    onClick={() => toggleFormat(fmt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition select-none flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-400/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                      {fmt.icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {fmt.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] transition ${
                            isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-indigo-700 font-semibold">
                        {fmt.codec}
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 pt-0.5">
                        {fmt.description}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-medium">
                          {fmt.badge}
                        </span>
                        <span>~{fmt.estimatedSizePerVariant} MB/varian</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Aspect Ratios */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <span>2. Pilih Rasio Aspek Video (Auto Safe-Zone Adjusted)</span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  ({selectedRatios.length} Rasio Dipilih)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ratioOptions.map((r) => {
                const isSelected = selectedRatios.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleRatio(r.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition select-none flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-400/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{r.name}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                            isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{r.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Quality, FPS & Render Options */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                <span>3. Konfigurasi Kualitas & Engine GPU</span>
              </span>
              <span className="text-[10px] text-slate-500">Estimasi Total: ~{totalEstimatedMb.toFixed(1)} MB ({totalFilesCount} Files)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quality Preset */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Resolusi Video:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '1080p', label: 'Full HD 1080p' },
                    { id: '4k', label: 'Ultra HD 4K' },
                    { id: '720p_lite', label: 'Fast 720p' },
                  ].map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setRenderQuality(q.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                        renderQuality === q.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate Preset */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Frame Rate (FPS):</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { val: 60, label: '60 FPS (Ultra Smooth FYP)' },
                    { val: 30, label: '30 FPS (Standard Web)' },
                  ].map((f) => (
                    <button
                      key={f.val}
                      type="button"
                      onClick={() => setFps(f.val as any)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                        fps === f.val
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle checkboxes */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeCaptions}
                  onChange={(e) => setIncludeCaptions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Burn-in Kinetic Subtitles</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeAudio}
                  onChange={(e) => setIncludeAudio(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Voiceover + BGM Mix</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeSafeZoneGuide}
                  onChange={(e) => setIncludeSafeZoneGuide(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>TikTok Safe-Zone Overlay</span>
              </label>
            </div>
          </div>

          {/* Active Batch Real-Time Live Status in Modal */}
          {currentBatch && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>Antrean Render Background Aktif</span>
                </span>
                <span>{currentBatch.overallProgress}% Selesai ({currentBatch.completedTasks}/{currentBatch.totalTasks})</span>
              </div>

              <div className="w-full bg-indigo-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${currentBatch.overallProgress}%` }}
                />
              </div>

              {/* Task list preview */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {currentBatch.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2 bg-white rounded-xl border border-indigo-100 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate max-w-[280px]">
                      <span className="font-semibold text-slate-800 truncate">{t.outputFilename}</span>
                      <span className="text-[10px] text-slate-500">({t.renderStepLabel})</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-indigo-600 font-bold text-[10px]">
                        {t.status === 'completed' ? 'Siap' : `${t.progress}%`}
                      </span>
                      {t.status === 'completed' && (
                        <button
                          onClick={() => downloadTaskArtifact(t)}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                        >
                          <Download className="w-2.5 h-2.5" />
                          Unduh
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentBatch.status === 'completed' && (
                <div className="p-2.5 bg-emerald-100/70 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 font-semibold text-xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Seluruh {currentBatch.totalTasks} varian file selesai diproses!</span>
                  </span>
                  <button
                    onClick={() => downloadBatchZip(currentBatch.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Paket ZIP</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Total: <strong>{totalFilesCount} Varian File</strong> (~{totalEstimatedMb.toFixed(1)} MB)
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              {currentBatch && currentBatch.status !== 'completed' ? 'Jalankan di Background' : 'Tutup'}
            </button>

            {currentBatch && currentBatch.status === 'completed' ? (
              <button
                id="btn-download-bulk-zip"
                onClick={() => downloadBatchZip(currentBatch.id)}
                className="w-1/2 sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File ZIP Sekarang</span>
              </button>
            ) : (
              <button
                id="btn-start-bulk-render"
                onClick={handleStartBulkExportBackground}
                disabled={totalFilesCount === 0}
                className="w-1/2 sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
              >
                <FolderArchive className="w-4 h-4" />
                <span>Mulai Ekspor Massal di Background</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

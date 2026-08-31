import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Scissors,
  Type,
  Volume2,
  Sliders,
  Layers,
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Wand2,
  Music,
  Plus,
  RefreshCw,
  Eye,
  Smartphone,
  Tv,
  Square,
  Zap,
  Radio,
  Bell,
  Flame,
  Clock,
  Tag,
  ShoppingBag,
  TrendingUp,
  Target,
  FileDown,
  Copy,
  Check
} from 'lucide-react';
import {
  PippitProject,
  StoryboardScene,
  PromptChainStep,
  CaptionStyle,
  CaptionPresetType,
  BackgroundMusicTrack,
  HookVariant
} from '../../types';
import { SAMPLE_BGM_TRACKS } from '../../data/samplePresets';
import { promptChainStepApi } from '../../services/api';
import { soundSynth } from '../../utils/audioSynth';
import { parseStoryboardToKineticWords, generateSrtContent, getActiveWordIndexAtTime } from '../../utils/kineticCaptionParser';
import { KineticCaptionsOverlay } from './KineticCaptionsOverlay';
import { DynamicStickersOverlay } from './DynamicStickersOverlay';
import { DynamicStickersPanel } from './DynamicStickersPanel';
import { WatermarkOverlay } from '../Distribution/WatermarkOverlay';
import { VideoPreviewPlayer } from './VideoPreviewPlayer';

interface QuickEditTabProps {
  project: PippitProject;
  onChangeProject: (newProject: Partial<PippitProject>) => void;
  onProceedToDistribution: () => void;
  onOpenBrandSettings?: () => void;
}

export const QuickEditTab: React.FC<QuickEditTabProps> = ({
  project,
  onChangeProject,
  onProceedToDistribution,
  onOpenBrandSettings,
}) => {
  const [activeTool, setActiveTool] = useState<
    'captions' | 'stickers' | 'hooks' | 'chain' | 'bg_removal' | 'audio' | 'sfx_soundboard'
  >('captions');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isProcessingChain, setIsProcessingChain] = useState(false);
  const [activeChainStepId, setActiveChainStepId] = useState<string>(
    project.promptChainSteps[0]?.id || ''
  );
  const [bgRemovalSelectedPreset, setBgRemovalSelectedPreset] = useState<string>('studio_white');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [removedBgSuccess, setRemovedBgSuccess] = useState(false);
  const [activeSfxPlayed, setActiveSfxPlayed] = useState<string | null>(null);
  const [copiedSrt, setCopiedSrt] = useState(false);

  // Helper to compute scene start time
  const getSceneStartTime = (sceneIdx: number) => {
    let start = 0;
    for (let i = 0; i < sceneIdx; i++) {
      start += project.storyboard[i]?.durationSeconds || 3;
    }
    return start;
  };

  // Calculate total duration in seconds
  const totalDuration = project.storyboard.reduce((acc, sc) => acc + (sc.durationSeconds || 3), 0);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Determine current active scene based on currentTime
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < project.storyboard.length; i++) {
      accumulated += project.storyboard[i].durationSeconds || 3;
      if (currentTime <= accumulated) {
        setCurrentSceneIndex(i);
        break;
      }
    }
  }, [currentTime, project.storyboard]);

  const activeScene: StoryboardScene = project.storyboard[currentSceneIndex] || project.storyboard[0];

  // Prompt Chaining AI Refine handler
  const handleRefinePromptStep = async (step: PromptChainStep) => {
    setIsProcessingChain(true);
    try {
      const result = await promptChainStepApi({
        category: step.category,
        currentText: step.refinedPrompt || step.originalPrompt,
        productTitle: project.inputData.productAnalysis?.productName || 'Product',
        goal: project.inputData.adGoal,
      });

      const updatedSteps = project.promptChainSteps.map((s) =>
        s.id === step.id
          ? {
              ...s,
              refinedPrompt: result.refinedPrompt,
              aiSuggestedImprovements: result.aiSuggestedImprovements,
              status: 'applied' as const,
            }
          : s
      );

      onChangeProject({ promptChainSteps: updatedSteps });
    } catch (err) {
      console.error('Prompt chain step error:', err);
    } finally {
      setIsProcessingChain(false);
    }
  };

  // Background removal simulation
  const handleTriggerBgRemoval = () => {
    setIsRemovingBg(true);
    setTimeout(() => {
      setIsRemovingBg(false);
      setRemovedBgSuccess(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-200">
            <Sliders className="w-3.5 h-3.5" />
            Layer 3: Quick Edit & Refining Layer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Studio Penyuntingan Cepat & Prompt Chaining
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Sempurnakan draf video langkah-demi-langkah (Prompt Chaining), hapus background foto produk instan, kustomisasi takarir karaoke TikTok, dan atur mixing audio.
          </p>
        </div>

        <button
          id="btn-proceed-to-distribution"
          onClick={onProceedToDistribution}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 shrink-0"
        >
          <span>Lanjut ke 4. Output & Distribusi</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Studio Grid: Left Live Canvas, Right Editing Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dedicated Video Preview Player Component (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 z-20">
          <VideoPreviewPlayer
            project={project}
            activeSceneIndex={currentSceneIndex}
            onSelectScene={setCurrentSceneIndex}
            onOpenBrandSettings={onOpenBrandSettings}
          />
        </div>

        {/* Right Column: Refining Tool Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tool Module Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'captions', label: '1. Kinetic Captions', icon: Type },
              { id: 'stickers', label: '2. Dynamic Stickers & Flash Sale', icon: Flame },
              { id: 'hooks', label: '3. Multi-Hook A/B', icon: Target },
              { id: 'chain', label: '4. Prompt Chaining', icon: Wand2 },
              { id: 'bg_removal', label: '5. BG Removal AI', icon: Scissors },
              { id: 'audio', label: '6. Audio Mixer', icon: Volume2 },
              { id: 'sfx_soundboard', label: '7. SFX Soundboard', icon: Zap },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* MODULE 1: Kinetic Auto-Captions & Subtitle Styling */}
          {activeTool === 'captions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-indigo-600" />
                    <span>Kinetic Subtitles & Viral Karaoke Styler</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Animasi teks kata-per-kata yang bergerak sinkron dengan narasi suara. Terbukti meningkatkan *watch time* hingga 80%.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const parsed = parseStoryboardToKineticWords(project.storyboard, (project.captionStyle.syncOffsetMs || 0) / 1000);
                    const srtContent = generateSrtContent(parsed.words);
                    navigator.clipboard.writeText(srtContent);
                    setCopiedSrt(true);
                    setTimeout(() => setCopiedSrt(false), 2500);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  {copiedSrt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Salin Naskah SRT Subtitles</span>
                    </>
                  )}
                </button>
              </div>

              {/* 7 Viral Preset Cards */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Preset Gaya Viral TikTok / Reels:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'hormozi_bold' as CaptionPresetType,
                      name: 'Alex Hormozi Viral Pop',
                      description: 'Bold uppercase, highlight kuning/hijau kontras, outline tebal & word pop scale.',
                      badge: '🔥 80% Retensi TikTok',
                      sampleHighlight: '#FACC15',
                      style: {
                        presetType: 'hormozi_bold' as CaptionPresetType,
                        fontFamily: 'Montserrat' as const,
                        fontSize: 24,
                        highlightColor: '#FACC15',
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        uppercase: true,
                        animation: 'hormozi_pulse' as const,
                        positionY: 74,
                        autoKeywordsHighlight: true,
                        showEmojiBadges: true,
                      },
                    },
                    {
                      id: 'mrbeast_impact' as CaptionPresetType,
                      name: 'MrBeast High-Urgency Impact',
                      description: 'Font tebal Impact dengan warna merah neon + kuning, tanpa background box.',
                      badge: '⚡ Extreme Hype',
                      sampleHighlight: '#EF4444',
                      style: {
                        presetType: 'mrbeast_impact' as CaptionPresetType,
                        fontFamily: 'Impact' as const,
                        fontSize: 26,
                        highlightColor: '#EF4444',
                        strokeColor: '#000000',
                        strokeWidth: 5,
                        uppercase: true,
                        animation: 'bounce' as const,
                        positionY: 72,
                        autoKeywordsHighlight: true,
                        showEmojiBadges: true,
                      },
                    },
                    {
                      id: 'tiktok_viral_yellow' as CaptionPresetType,
                      name: 'TikTok FYP Yellow Translucent',
                      description: 'Gaya klasik CapCut FYP dengan latar hitam transparan dan teks kuning cerah.',
                      badge: '⭐ Paling Populer',
                      sampleHighlight: '#FACC15',
                      style: {
                        presetType: 'tiktok_viral_yellow' as CaptionPresetType,
                        fontFamily: 'Montserrat' as const,
                        fontSize: 22,
                        highlightColor: '#FACC15',
                        strokeColor: '#000000',
                        strokeWidth: 3,
                        uppercase: true,
                        animation: 'karaoke_glow' as const,
                        positionY: 76,
                        autoKeywordsHighlight: true,
                        showEmojiBadges: false,
                      },
                    },
                    {
                      id: 'clean_minimal_pill' as CaptionPresetType,
                      name: 'Clean Aesthetic Frosted Pill',
                      description: 'Pill semi-transparan dengan aksen hijau emerald lembut dan font clean modern.',
                      badge: '✨ Aesthetic Skincare',
                      sampleHighlight: '#10B981',
                      style: {
                        presetType: 'clean_minimal_pill' as CaptionPresetType,
                        fontFamily: 'Plus Jakarta Sans' as const,
                        fontSize: 20,
                        highlightColor: '#10B981',
                        strokeColor: 'transparent',
                        strokeWidth: 0,
                        uppercase: false,
                        animation: 'simple_fade' as const,
                        positionY: 78,
                        boxBackground: 'rgba(0,0,0,0.5)',
                        autoKeywordsHighlight: false,
                        showEmojiBadges: false,
                      },
                    },
                    {
                      id: 'cyber_neon' as CaptionPresetType,
                      name: 'Cyber Neon RGB Glow',
                      description: 'Glow neon cyan dan magenta elektrik dengan font Bebas Neue yang tegas.',
                      badge: '🚀 Tech & Gaming',
                      sampleHighlight: '#22D3EE',
                      style: {
                        presetType: 'cyber_neon' as CaptionPresetType,
                        fontFamily: 'Bebas Neue' as const,
                        fontSize: 26,
                        highlightColor: '#22D3EE',
                        strokeColor: '#0F172A',
                        strokeWidth: 3,
                        uppercase: true,
                        animation: 'word_pop' as const,
                        positionY: 74,
                        autoKeywordsHighlight: true,
                        showEmojiBadges: true,
                      },
                    },
                    {
                      id: 'luxury_serif' as CaptionPresetType,
                      name: 'Luxury Editorial Gold',
                      description: 'Tipografi Playfair dengan aksen emas premium untuk brand mewah dan parfum.',
                      badge: '💎 Luxury Brand',
                      sampleHighlight: '#F59E0B',
                      style: {
                        presetType: 'luxury_serif' as CaptionPresetType,
                        fontFamily: 'Playfair' as const,
                        fontSize: 22,
                        highlightColor: '#F59E0B',
                        strokeColor: '#000000',
                        strokeWidth: 2,
                        uppercase: false,
                        animation: 'slide_up' as const,
                        positionY: 78,
                        autoKeywordsHighlight: false,
                        showEmojiBadges: false,
                      },
                    },
                  ].map((preset) => {
                    const isSelected =
                      (project.captionStyle.presetType || 'hormozi_bold') === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          soundSynth.playSound('pop');
                          onChangeProject({
                            captionStyle: {
                              ...project.captionStyle,
                              ...preset.style,
                            },
                          });
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-black text-slate-900">{preset.name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {preset.description}
                          </p>
                        </div>

                        {/* Visual Pill Preview */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span
                            className="text-xs font-extrabold px-2 py-0.5 rounded bg-black text-white"
                            style={{ color: preset.sampleHighlight }}
                          >
                            VIRAL TEXT
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                              <span>Aktif</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Synchronized Voiceover Word Scrubber / Timeline Inspector */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sinkronisasi Kata Narasi Suara (Scene #{activeScene.sceneNumber})</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-mono">
                    Klik kata untuk uji dengar & seek timeline
                  </span>
                </div>

                {/* Parsed word tokens for current scene */}
                {(() => {
                  const sceneStartTime = getSceneStartTime(currentSceneIndex);
                  const parsed = parseStoryboardToKineticWords(
                    [activeScene],
                    sceneStartTime + (project.captionStyle.syncOffsetMs || 0) / 1000
                  );
                  const activeWordIdx = getActiveWordIndexAtTime(parsed.words, currentTime);

                  return (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-indigo-100/80 max-h-32 overflow-y-auto">
                      {parsed.words.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Tidak ada naskah narasi di scene ini.</span>
                      ) : (
                        parsed.words.map((w, idx) => {
                          const isActiveWord = idx === activeWordIdx;
                          return (
                            <button
                              key={w.id}
                              onClick={() => {
                                setCurrentTime(w.startTime);
                                soundSynth.playSound('pop');
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                                isActiveWord
                                  ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-400/50'
                                  : w.isKeyword
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              title={`${w.startTime.toFixed(2)}s - ${w.endTime.toFixed(2)}s`}
                            >
                              {w.emojiTag && <span>{w.emojiTag}</span>}
                              <span>{w.word}</span>
                              <span className="text-[9px] opacity-60 font-mono">
                                {w.startTime.toFixed(1)}s
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  );
                })()}

                {/* Audio/Voiceover Timing Sync Offset Slider */}
                <div className="pt-2 border-t border-indigo-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-700">Offset Audio Sinkron:</span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {project.captionStyle.syncOffsetMs || 0} ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                    <span className="text-[10px] text-slate-400">-500ms</span>
                    <input
                      type="range"
                      min="-500"
                      max="500"
                      step="25"
                      value={project.captionStyle.syncOffsetMs || 0}
                      onChange={(e) =>
                        onChangeProject({
                          captionStyle: { ...project.captionStyle, syncOffsetMs: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400">+500ms</span>
                  </div>
                </div>
              </div>

              {/* Detailed Fine-Tuning Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pengaturan Detail Tipografi & Posisi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Font Family */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Jenis Font
                    </label>
                    <select
                      value={project.captionStyle.fontFamily}
                      onChange={(e) =>
                        onChangeProject({
                          captionStyle: { ...project.captionStyle, fontFamily: e.target.value as any },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Montserrat">Montserrat (CapCut Viral)</option>
                      <option value="Bebas Neue">Bebas Neue (Punchy Bold)</option>
                      <option value="Impact">Impact (Hormozi / Meme)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                      <option value="Playfair">Playfair (Luxury Aesthetic)</option>
                      <option value="Inter">Inter (Minimal Tech)</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Ukuran Teks: {project.captionStyle.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="34"
                      value={project.captionStyle.fontSize}
                      onChange={(e) =>
                        onChangeProject({
                          captionStyle: { ...project.captionStyle, fontSize: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-indigo-600 mt-1"
                    />
                  </div>

                  {/* Vertical Position */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Posisi Vertikal ({project.captionStyle.positionY}%)
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="85"
                      value={project.captionStyle.positionY}
                      onChange={(e) =>
                        onChangeProject({
                          captionStyle: { ...project.captionStyle, positionY: parseInt(e.target.value) },
                        })
                      }
                      className="w-full accent-indigo-600 mt-1"
                    />
                  </div>
                </div>

                {/* Highlight Color Pickers */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-700">Warna Highlight Aktif:</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { code: '#FACC15', label: 'TikTok Yellow' },
                        { code: '#4ADE80', label: 'Neon Green' },
                        { code: '#EF4444', label: 'Bright Red' },
                        { code: '#22D3EE', label: 'Cyan Glow' },
                        { code: '#F43F5E', label: 'Pink Rose' },
                      ].map((c) => (
                        <button
                          key={c.code}
                          onClick={() =>
                            onChangeProject({
                              captionStyle: { ...project.captionStyle, highlightColor: c.code },
                            })
                          }
                          style={{ backgroundColor: c.code }}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            project.captionStyle.highlightColor === c.code
                              ? 'border-slate-950 scale-110 shadow-xs'
                              : 'border-slate-300'
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={project.captionStyle.uppercase}
                        onChange={(e) =>
                          onChangeProject({
                            captionStyle: { ...project.captionStyle, uppercase: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span>UPPERCASE</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={project.captionStyle.autoKeywordsHighlight !== false}
                        onChange={(e) =>
                          onChangeProject({
                            captionStyle: { ...project.captionStyle, autoKeywordsHighlight: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span>Auto-Highlight Promo</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={project.captionStyle.showEmojiBadges !== false}
                        onChange={(e) =>
                          onChangeProject({
                            captionStyle: { ...project.captionStyle, showEmojiBadges: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span>Emoji Badges 🔥</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: Dynamic Stickers & Flash Sale Countdown */}
          {activeTool === 'stickers' && (
            <DynamicStickersPanel
              project={project}
              onChangeProject={onChangeProject}
            />
          )}

          {/* MODULE 3: Multi-Hook A/B Test Switcher */}
          {activeTool === 'hooks' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span>Multi-Hook A/B Testing Studio</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ganti detik 0-3 video utama dengan 5 variasi sudut psikologi yang berbeda untuk menemukan hook dengan CTR tertinggi.
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundSynth.playSound('whoosh');
                    const firstHook = project.hookVariants?.[0];
                    if (firstHook) {
                      const updatedScenes = project.storyboard.map((sc, idx) => {
                        if (idx === 0 || sc.sceneType === 'hook') {
                          return {
                            ...sc,
                            voiceoverText: firstHook.voiceoverText,
                            onScreenText: firstHook.onScreenText,
                            visualPrompt: firstHook.visualPrompt,
                            visualUrl: firstHook.visualUrl || sc.visualUrl,
                          };
                        }
                        return sc;
                      });
                      onChangeProject({
                        storyboard: updatedScenes,
                        selectedHookId: firstHook.id,
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reset ke Hook Rekomendasi</span>
                </button>
              </div>

              {/* Hook Variants List */}
              <div className="space-y-3">
                {(project.hookVariants || []).map((hook, idx) => {
                  const isCurrentActive =
                    project.selectedHookId === hook.id ||
                    (project.storyboard[0]?.voiceoverText === hook.voiceoverText);

                  return (
                    <div
                      key={hook.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrentActive
                          ? 'bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black text-slate-900">{hook.angleTitle}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            {hook.predictedCtrLift}
                          </span>
                        </div>

                        <div className="text-xs font-mono font-bold text-indigo-900 bg-white/80 p-2 rounded-xl border border-indigo-100">
                          {hook.onScreenText}
                        </div>

                        <p className="text-[11px] text-slate-600 italic">
                          "{hook.voiceoverText}"
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            soundSynth.playSound('pop');
                            const updatedScenes = project.storyboard.map((sc, scIdx) => {
                              if (scIdx === 0 || sc.sceneType === 'hook') {
                                return {
                                  ...sc,
                                  voiceoverText: hook.voiceoverText,
                                  onScreenText: hook.onScreenText,
                                  visualPrompt: hook.visualPrompt,
                                  visualUrl: hook.visualUrl || sc.visualUrl,
                                };
                              }
                              return sc;
                            });

                            onChangeProject({
                              storyboard: updatedScenes,
                              selectedHookId: hook.id,
                            });
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5 ${
                            isCurrentActive
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {isCurrentActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Hook Aktif</span>
                            </>
                          ) : (
                            <span>Pasang ke Video</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODULE 1: Prompt Chaining Wizard */}
          {activeTool === 'chain' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <span>Prompt Chaining Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memecah proses penyempurnaan video secara bertahap demi hasil yang presisi dan konversi tinggi.
                </p>
              </div>

              {/* Chain Steps Accordion / Cards */}
              <div className="space-y-3">
                {project.promptChainSteps.map((step, idx) => {
                  const isCurrentActive = activeChainStepId === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`border rounded-2xl transition p-4 space-y-3 ${
                        isCurrentActive
                          ? 'bg-indigo-50/40 border-indigo-300 shadow-sm'
                          : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setActiveChainStepId(step.id)}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{step.title}</div>
                            <div className="text-[10px] text-slate-500 capitalize">Kategori: {step.category.replace('_', ' ')}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                            {step.status === 'applied' ? '✓ Disempurnakan' : 'Draf Kasar'}
                          </span>
                        </div>
                      </div>

                      {isCurrentActive && (
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Hasil Prompt yang Telah Disempurnakan (Refined Prompt):
                            </label>
                            <textarea
                              rows={2}
                              value={step.refinedPrompt}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = project.promptChainSteps.map((s) =>
                                  s.id === step.id ? { ...s, refinedPrompt: val } : s
                                );
                                onChangeProject({ promptChainSteps: updated });
                              }}
                              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                          </div>

                          {/* AI Suggestions Pill list */}
                          {step.aiSuggestedImprovements?.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                                Rekomendasi Peningkatan AI:
                              </span>
                              <div className="space-y-1 text-[11px] text-slate-700">
                                {step.aiSuggestedImprovements.map((imp, i) => (
                                  <div key={i} className="flex items-start gap-1.5 bg-white p-2 rounded-lg border border-slate-200">
                                    <Sparkles className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                                    <span>{imp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleRefinePromptStep(step)}
                            disabled={isProcessingChain}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingChain ? 'animate-spin' : ''}`} />
                            <span>{isProcessingChain ? 'AI Sedang Mematangkan...' : 'Refine Step Ini dengan AI'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODULE 2: Intelligent Background Removal */}
          {activeTool === 'bg_removal' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-indigo-600" />
                  <span>Intelligent Background Removal</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bersihkan latar belakang foto produk secara instan dan pasangkan dengan latar studio sinematik.
                </p>
              </div>

              {/* Before & After Preview Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Foto Asli Terunggah</span>
                  <div className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
                      alt="Original Product"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white">
                      Original
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Hasil AI Cutout & Studio Backdrop</span>
                  <div
                    className={`aspect-square rounded-2xl border border-slate-300 overflow-hidden relative flex items-center justify-center p-4 transition-all ${
                      bgRemovalSelectedPreset === 'studio_white'
                        ? 'bg-gradient-to-b from-slate-100 to-slate-200'
                        : bgRemovalSelectedPreset === 'cyberpunk'
                        ? 'bg-gradient-to-tr from-purple-900 via-indigo-950 to-pink-900'
                        : bgRemovalSelectedPreset === 'pastel_sunset'
                        ? 'bg-gradient-to-tr from-amber-100 via-rose-100 to-indigo-100'
                        : 'bg-gradient-to-b from-emerald-900 to-teal-950'
                    }`}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
                      alt="AI Cutout Product"
                      className={`max-h-[85%] object-contain drop-shadow-2xl transition-all duration-500 ${
                        removedBgSuccess ? 'scale-100' : 'opacity-90'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-emerald-300 font-bold border border-emerald-500/30">
                      AI Isolated Product Cutout
                    </div>
                  </div>
                </div>
              </div>

              {/* Backdrop Style Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Pilih Latar Studio Pengganti:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'studio_white', name: 'Studio Minimalis', desc: 'Clean White' },
                    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'RGB Lighting' },
                    { id: 'pastel_sunset', name: 'Pastel Sunset', desc: 'Warm Aesthetic' },
                    { id: 'tropical', name: 'Tropical Green', desc: 'Organic Nature' },
                  ].map((backdrop) => (
                    <button
                      key={backdrop.id}
                      onClick={() => setBgRemovalSelectedPreset(backdrop.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        bgRemovalSelectedPreset === backdrop.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{backdrop.name}</div>
                      <div className="text-[10px] text-slate-500">{backdrop.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Cutout Button */}
              <button
                onClick={handleTriggerBgRemoval}
                disabled={isRemovingBg}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isRemovingBg ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menghapus Background & Menerapkan Studio Lighting...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Hapus Background Foto Produk Sekarang</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* MODULE 6: Audio & BGM Mixer */}
          {activeTool === 'audio' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Audio & BGM Mixer</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur keseimbangan volume antara suara narasi avatar dan musik latar (BGM).
                </p>
              </div>

              {/* Volume Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Volume Voiceover Avatar</span>
                    <span className="text-indigo-600 font-bold">{project.voiceVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={project.voiceVolume}
                    onChange={(e) => onChangeProject({ voiceVolume: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Volume Background Music (BGM)</span>
                    <span className="text-indigo-600 font-bold">{project.bgmVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={project.bgmVolume}
                    onChange={(e) => onChangeProject({ bgmVolume: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* BGM Track Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Pilih Lagu Latar (BGM Library Viral Commerce):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_BGM_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => onChangeProject({ selectedBgm: track })}
                      className={`p-3 text-left rounded-xl border text-xs transition flex items-center justify-between ${
                        project.selectedBgm.id === track.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-slate-900 font-medium">{track.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{track.genre}</span>
                          <span>• {track.bpm} BPM</span>
                        </div>
                      </div>

                      {project.selectedBgm.id === track.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MODULE 5: Viral Commerce SFX Soundboard & Audio Synthesizer */}
          {activeTool === 'sfx_soundboard' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Viral Commerce Sound Effects (SFX Soundboard)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Audio synthesizer berkecepatan tinggi tanpa buffering untuk mendongkrak retensi dan impuls beli penonton.
                  </p>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg shrink-0">
                  Target: Scene #{activeScene?.sceneNumber}
                </span>
              </div>

              {/* Interactive Sound Pad Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'chaching',
                    name: 'Cha-Ching Cash Register',
                    category: 'Flash Sale / Cart',
                    icon: '💰',
                    color: 'hover:border-emerald-500 hover:bg-emerald-50/50',
                    badge: 'bg-emerald-100 text-emerald-800',
                  },
                  {
                    id: 'whoosh',
                    name: 'Dynamic Fast Whoosh',
                    category: 'Scene Transition',
                    icon: '💨',
                    color: 'hover:border-indigo-500 hover:bg-indigo-50/50',
                    badge: 'bg-indigo-100 text-indigo-800',
                  },
                  {
                    id: 'thock',
                    name: 'Keyboard ASMR Click',
                    category: 'Unboxing / Product',
                    icon: '🎧',
                    color: 'hover:border-purple-500 hover:bg-purple-50/50',
                    badge: 'bg-purple-100 text-purple-800',
                  },
                  {
                    id: 'bell',
                    name: 'Sparkle Ding Notification',
                    category: 'Feature Highlight',
                    icon: '✨',
                    color: 'hover:border-amber-500 hover:bg-amber-50/50',
                    badge: 'bg-amber-100 text-amber-800',
                  },
                  {
                    id: 'scratch',
                    name: 'Dramatic Record Scratch',
                    category: 'Meme / Disbelief',
                    icon: '🛑',
                    color: 'hover:border-rose-500 hover:bg-rose-50/50',
                    badge: 'bg-rose-100 text-rose-800',
                  },
                  {
                    id: 'airhorn',
                    name: 'Hype TikTok Airhorn',
                    category: 'Viral Peak / Win',
                    icon: '📣',
                    color: 'hover:border-orange-500 hover:bg-orange-50/50',
                    badge: 'bg-orange-100 text-orange-800',
                  },
                  {
                    id: 'pop',
                    name: 'Clean Bubble Pop',
                    category: 'UI Element / Badge',
                    icon: '🫧',
                    color: 'hover:border-sky-500 hover:bg-sky-50/50',
                    badge: 'bg-sky-100 text-sky-800',
                  },
                ].map((sfx) => {
                  const isCurrentOnScene = activeScene?.bgSoundEffect?.toLowerCase() === sfx.name.toLowerCase() || activeScene?.bgSoundEffect?.toLowerCase() === sfx.id;
                  return (
                    <div
                      key={sfx.id}
                      className={`p-3.5 rounded-2xl border bg-slate-50/70 border-slate-200 transition flex flex-col justify-between gap-3 ${sfx.color}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{sfx.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{sfx.name}</div>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${sfx.badge}`}>
                              {sfx.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Play sound immediately */}
                        <button
                          onClick={() => {
                            soundSynth.playSound(sfx.id);
                            setActiveSfxPlayed(sfx.id);
                            setTimeout(() => setActiveSfxPlayed(null), 800);
                          }}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95"
                        >
                          <Play className={`w-3 h-3 ${activeSfxPlayed === sfx.id ? 'text-amber-500 fill-amber-500 scale-125 transition' : 'text-indigo-600 fill-indigo-600'}`} />
                          <span>Dengar Suara</span>
                        </button>

                        {/* Attach to active scene */}
                        <button
                          onClick={() => {
                            soundSynth.playSound(sfx.id);
                            const updated = project.storyboard.map((sc, idx) =>
                              idx === currentSceneIndex ? { ...sc, bgSoundEffect: sfx.name } : sc
                            );
                            onChangeProject({ storyboard: updated });
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition flex items-center gap-1 ${
                            isCurrentOnScene
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                          title={`Pasang efek suara ini ke Adegan #${activeScene?.sceneNumber}`}
                        >
                          {isCurrentOnScene ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                              <span>Terpasang</span>
                            </>
                          ) : (
                            <span>+ Pasang</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Sound Indicator on Scene */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Efek Suara Adegan #{activeScene?.sceneNumber} Saat Ini:
                </span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {activeScene?.bgSoundEffect || 'Pop'}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

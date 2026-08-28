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
  Bell
} from 'lucide-react';
import {
  PippitProject,
  StoryboardScene,
  PromptChainStep,
  CaptionStyle,
  BackgroundMusicTrack
} from '../../types';
import { SAMPLE_BGM_TRACKS } from '../../data/samplePresets';
import { promptChainStepApi } from '../../services/api';
import { soundSynth } from '../../utils/audioSynth';

interface QuickEditTabProps {
  project: PippitProject;
  onChangeProject: (newProject: Partial<PippitProject>) => void;
  onProceedToDistribution: () => void;
}

export const QuickEditTab: React.FC<QuickEditTabProps> = ({
  project,
  onChangeProject,
  onProceedToDistribution,
}) => {
  const [activeTool, setActiveTool] = useState<'chain' | 'bg_removal' | 'captions' | 'audio' | 'sfx_soundboard'>('chain');
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
        
        {/* Left Column: Live Video Canvas & Timeline Scrubber (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm sticky top-24">
            
            {/* Canvas Header & Ratio Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Video Canvas</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px]">
                <button
                  onClick={() => onChangeProject({ inputData: { ...project.inputData, aspectRatio: '9:16' } })}
                  className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition ${
                    project.inputData.aspectRatio === '9:16' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>9:16</span>
                </button>
                <button
                  onClick={() => onChangeProject({ inputData: { ...project.inputData, aspectRatio: '1:1' } })}
                  className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition ${
                    project.inputData.aspectRatio === '1:1' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Square className="w-3 h-3" />
                  <span>1:1</span>
                </button>
                <button
                  onClick={() => onChangeProject({ inputData: { ...project.inputData, aspectRatio: '16:9' } })}
                  className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition ${
                    project.inputData.aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>16:9</span>
                </button>
              </div>
            </div>

            {/* Video Stage Frame */}
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl transition-all duration-300 ${
                project.inputData.aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-h-[500px] w-auto'
                  : project.inputData.aspectRatio === '1:1'
                  ? 'aspect-square max-h-[420px] w-full'
                  : 'aspect-[16/9] max-h-[340px] w-full'
              }`}
            >
              {/* Scene Visual Backdrop */}
              <img
                src={activeScene?.visualUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'}
                alt="Scene Backdrop"
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying && activeScene?.cameraMovement === 'zoom_in'
                    ? 'scale-110'
                    : isPlaying && activeScene?.cameraMovement === 'dynamic_shake'
                    ? 'scale-105 animate-pulse'
                    : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

              {/* Top Layer: Scene Badge & BGM pill */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-black/70 backdrop-blur-md text-amber-300 rounded-md border border-amber-500/30">
                  Scene #{activeScene?.sceneNumber}: {activeScene?.sceneType}
                </span>

                <span className="text-[10px] font-medium px-2 py-1 bg-black/70 backdrop-blur-md text-slate-200 rounded-md border border-slate-700 flex items-center gap-1">
                  <Music className="w-2.5 h-2.5 text-indigo-400" />
                  <span className="truncate max-w-[100px]">{project.selectedBgm.title}</span>
                </span>
              </div>

              {/* Digital Avatar PiP (Corner Overlay with Live Talking Animation) */}
              <div className="absolute bottom-24 right-3 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-xl bg-slate-950 z-20">
                <img
                  src={project.selectedAvatar.avatarImage}
                  alt={project.selectedAvatar.name}
                  className={`w-full h-full object-cover ${isPlaying ? 'scale-105 transition duration-300' : ''}`}
                  referrerPolicy="no-referrer"
                />
                {isPlaying && (
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-[8px] text-center font-bold text-slate-200 truncate px-1">
                  {project.selectedAvatar.name.split(' ')[0]} (AI Host)
                </div>
              </div>

              {/* Auto Subtitle / Karaoke On-Screen Dynamic Captions */}
              <div
                className="absolute inset-x-3 text-center pointer-events-none z-10"
                style={{ top: `${project.captionStyle.positionY}%` }}
              >
                <div
                  className="inline-block px-3 py-1.5 rounded-xl shadow-2xl transition-all duration-200"
                  style={{
                    backgroundColor: project.captionStyle.backgroundColor || 'rgba(0,0,0,0.7)',
                    color: project.captionStyle.textColor || '#ffffff',
                    fontFamily: project.captionStyle.fontFamily || 'Montserrat',
                    fontSize: `${project.captionStyle.fontSize * 0.75}px`,
                    textTransform: project.captionStyle.uppercase ? 'uppercase' : 'none',
                    WebkitTextStroke: `${project.captionStyle.strokeWidth * 0.5}px ${project.captionStyle.strokeColor || '#000000'}`,
                  }}
                >
                  <span className="font-extrabold tracking-wide" style={{ color: project.captionStyle.highlightColor }}>
                    {activeScene?.onScreenText}
                  </span>
                </div>
              </div>

              {/* TikTok Yellow Cart Anchor CTA (When in CTA scene or bottom left) */}
              {activeScene?.sceneType === 'cta' && (
                <div className="absolute bottom-4 left-3 right-3 bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl shadow-2xl flex items-center justify-between animate-bounce z-20">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-base">🛍️</span>
                    <span className="truncate">Keranjang Kuning: Diskon 45%</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-md shrink-0 font-semibold">
                    Beli Sekarang
                  </span>
                </div>
              )}

              {/* Center Play/Pause Overlay Indicator on click */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition group"
              >
                {!isPlaying && (
                  <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                )}
              </button>
            </div>

            {/* Timeline Controls & Scrubber */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{currentTime.toFixed(1)}s</span>
                <span className="text-slate-400">/</span>
                <span>{totalDuration.toFixed(1)}s</span>
              </div>

              {/* Scrubber Range */}
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />

              {/* Playback Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                  title="Reset ke Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Preview</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  Scene {currentSceneIndex + 1} of {project.storyboard.length}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Refining Tool Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tool Module Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'chain', label: '1. Prompt Chaining', icon: Wand2 },
              { id: 'bg_removal', label: '2. BG Removal AI', icon: Scissors },
              { id: 'captions', label: '3. Karaoke Captions', icon: Type },
              { id: 'audio', label: '4. Audio & BGM Mixer', icon: Volume2 },
              { id: 'sfx_soundboard', label: '5. Viral SFX Soundboard', icon: Zap },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

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

          {/* MODULE 3: Karaoke Captions & Subtitles Customizer */}
          {activeTool === 'captions' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Type className="w-4 h-4 text-indigo-600" />
                  <span>Kustomisasi Takarir / Subtitle Otomatis</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan gaya tipografi, warna highlight karaoke, dan posisi teks agar ramah algoritma FYP TikTok.
                </p>
              </div>

              {/* Font Family & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Gaya Font
                  </label>
                  <select
                    value={project.captionStyle.fontFamily}
                    onChange={(e) =>
                      onChangeProject({
                        captionStyle: { ...project.captionStyle, fontFamily: e.target.value as any },
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Montserrat">Montserrat (CapCut Viral Style)</option>
                    <option value="Bebas Neue">Bebas Neue (Punchy Bold)</option>
                    <option value="Impact">Impact (High Urgency Meme)</option>
                    <option value="Playfair">Playfair (Luxury Aesthetic)</option>
                    <option value="Inter">Inter (Clean Modern)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Ukuran Font: {project.captionStyle.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="36"
                    value={project.captionStyle.fontSize}
                    onChange={(e) =>
                      onChangeProject({
                        captionStyle: { ...project.captionStyle, fontSize: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              {/* Highlight Color & Animation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Warna Highlight Kata
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { code: '#FACC15', label: 'TikTok Yellow' },
                      { code: '#22C55E', label: 'Emerald Green' },
                      { code: '#F43F5E', label: 'Rose Pink' },
                      { code: '#38BDF8', label: 'Sky Cyan' },
                    ].map((c) => (
                      <button
                        key={c.code}
                        onClick={() =>
                          onChangeProject({
                            captionStyle: { ...project.captionStyle, highlightColor: c.code },
                          })
                        }
                        style={{ backgroundColor: c.code }}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          project.captionStyle.highlightColor === c.code ? 'border-slate-900 scale-110 shadow-xs' : 'border-slate-300'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Posisi Vertikal ({project.captionStyle.positionY}%)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={project.captionStyle.positionY}
                    onChange={(e) =>
                      onChangeProject({
                        captionStyle: { ...project.captionStyle, positionY: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              {/* Uppercase & Animation Style */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-800 font-medium">Teks Huruf Kapital Otomatis (UPPERCASE)</span>
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
              </div>

            </div>
          )}

          {/* MODULE 4: Audio & BGM Mixer */}
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

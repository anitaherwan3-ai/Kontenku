import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ShoppingBag,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Disc,
  Clock,
  Eye,
  Sliders,
  CheckCircle2,
  Music,
  Mic,
  Palette
} from 'lucide-react';
import { PippitProject, StoryboardScene } from '../../types';

interface VideoPreviewPlayerProps {
  project: PippitProject;
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
  onOpenBrandSettings?: () => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  project,
  activeSceneIndex,
  onSelectScene,
  onOpenBrandSettings
}) => {
  const scenes = project.storyboard || [];
  const totalDuration = scenes.reduce((acc, sc) => acc + (sc.durationSeconds || 3), 0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [isSocialUiVisible, setIsSocialUiVisible] = useState(true);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate current scene index based on currentTime
  let accumulatedTime = 0;
  let computedSceneIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    const scDur = scenes[i].durationSeconds || 3;
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + scDur) {
      computedSceneIndex = i;
      break;
    }
    accumulatedTime += scDur;
    if (i === scenes.length - 1) computedSceneIndex = i;
  }

  const currentScene: StoryboardScene | undefined = scenes[computedSceneIndex] || scenes[0];

  // Sync with activeSceneIndex when parent changes it manually
  useEffect(() => {
    if (!isPlaying && scenes[activeSceneIndex]) {
      let sceneStart = 0;
      for (let i = 0; i < activeSceneIndex; i++) {
        sceneStart += scenes[i].durationSeconds || 3;
      }
      setCurrentTime(sceneStart);
    }
  }, [activeSceneIndex, isPlaying, scenes]);

  // Main playback timer loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updatePlayhead = (now: number) => {
      const deltaSeconds = ((now - lastTime) / 1000) * playbackSpeed;
      lastTime = now;

      setCurrentTime(prev => {
        const nextTime = prev + deltaSeconds;
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          return 0; // loop or reset
        }
        return nextTime;
      });

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(updatePlayhead);
      }
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updatePlayhead);

      // Play BGM if available
      if (project.selectedBgm?.audioUrl && !isBgmMuted) {
        if (!audioRef.current) {
          audioRef.current = new Audio(project.selectedBgm.audioUrl);
          audioRef.current.loop = true;
        }
        audioRef.current.volume = Math.max(0, Math.min(1, (project.bgmVolume ?? 30) / 100));
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isPlaying, totalDuration, playbackSpeed, isBgmMuted, project.selectedBgm, project.bgmVolume]);

  // Update parent active scene indicator smoothly
  useEffect(() => {
    if (computedSceneIndex !== activeSceneIndex && isPlaying) {
      onSelectScene(computedSceneIndex);
    }
  }, [computedSceneIndex, activeSceneIndex, isPlaying, onSelectScene]);

  // Subtitle karaoke word-highlight progress
  useEffect(() => {
    if (!currentScene) return;
    const words = (currentScene.voiceoverText || '').split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    let sceneStartTime = 0;
    for (let i = 0; i < computedSceneIndex; i++) {
      sceneStartTime += scenes[i].durationSeconds || 3;
    }
    const sceneElapsed = currentTime - sceneStartTime;
    const sceneDur = currentScene.durationSeconds || 3;
    const progress = Math.max(0, Math.min(1, sceneElapsed / sceneDur));
    const wordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
    setActiveWordIndex(wordIdx);
  }, [currentTime, computedSceneIndex, currentScene, scenes]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onSelectScene(0);
  };

  const handleSkipPrevScene = () => {
    const prevIdx = Math.max(0, computedSceneIndex - 1);
    let targetTime = 0;
    for (let i = 0; i < prevIdx; i++) {
      targetTime += scenes[i].durationSeconds || 3;
    }
    setCurrentTime(targetTime);
    onSelectScene(prevIdx);
  };

  const handleSkipNextScene = () => {
    const nextIdx = Math.min(scenes.length - 1, computedSceneIndex + 1);
    let targetTime = 0;
    for (let i = 0; i < nextIdx; i++) {
      targetTime += scenes[i].durationSeconds || 3;
    }
    setCurrentTime(targetTime);
    onSelectScene(nextIdx);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const target = percentage * totalDuration;
    setCurrentTime(target);
  };

  // Keyboard shortcut: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format time (e.g. "00:04.2")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  // Brand Kit styling references
  const brand = project.brandKit;
  const headingFont = brand?.fontFamilyHeading || 'Plus Jakarta Sans';
  const highlightColor = brand?.captionHighlightColor || project.captionStyle?.highlightColor || '#fbbf24';
  const primaryBrandColor = brand?.primaryColor || '#6366f1';
  const secondaryBrandColor = brand?.secondaryColor || '#f59e0b';
  const watermarkText = project.watermarkConfig?.text || brand?.brandName || '@pippit.studio';

  // Camera Motion CSS class
  const getCameraAnimation = (motion?: string) => {
    if (!isPlaying) return 'scale-100';
    switch (motion) {
      case 'zoom_in':
        return 'scale-110 transition-transform duration-[3000ms] ease-out';
      case 'pan_right':
        return 'translate-x-3 scale-105 transition-transform duration-[3000ms] ease-in-out';
      case 'dynamic_shake':
        return 'animate-pulse scale-105';
      case 'orbit':
        return 'rotate-1 scale-105 transition-transform duration-[3000ms]';
      default:
        return 'scale-100';
    }
  };

  // Active Scene Type Color Badge
  const getSceneTypeColor = (type?: string) => {
    switch (type) {
      case 'hook':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'problem':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'demo':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'social_proof':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'cta':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Live Video Canvas Preview
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
          {currentScene && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getSceneTypeColor(
                currentScene.sceneType
              )}`}
            >
              Scene {computedSceneIndex + 1}/{scenes.length} • {currentScene.sceneType}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Kit Quick Link */}
          {onOpenBrandSettings && (
            <button
              onClick={onOpenBrandSettings}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center gap-1.5 transition"
              title="Atur Palet Warna & Font Brand"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Brand Kit</span>
            </button>
          )}

          {/* Social UI Overlay Toggle */}
          <button
            onClick={() => setIsSocialUiVisible(!isSocialUiVisible)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              isSocialUiVisible
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Simulasi UI TikTok / Reels"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TikTok UI</span>
          </button>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {(['9:16', '1:1', '16:9'] as const).map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded transition ${
                  aspectRatio === ratio
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video Viewport Stage */}
      <div className="flex-1 min-h-[320px] sm:min-h-[420px] max-h-[620px] bg-black/95 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none">
        {/* Dynamic Aspect Ratio Box */}
        <div
          className={`relative bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 transition-all duration-300 flex items-center justify-center max-w-full ${
            aspectRatio === '9:16'
              ? 'w-[240px] sm:w-[290px] h-[426px] sm:h-[515px]'
              : aspectRatio === '1:1'
              ? 'w-full max-w-[340px] sm:max-w-[420px] aspect-square'
              : 'w-full max-w-[460px] sm:max-w-[580px] aspect-video'
          }`}
        >
          {/* Layer 1: Background Visual with Motion Simulation */}
          <div className="absolute inset-0 overflow-hidden">
            {currentScene?.visualUrl ? (
              <img
                src={currentScene.visualUrl}
                alt={currentScene.onScreenText || 'Scene visual'}
                className={`w-full h-full object-cover origin-center ${getCameraAnimation(
                  currentScene.cameraMovement
                )}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6 text-center text-slate-400 text-xs">
                {currentScene?.visualPrompt || 'Visual Scene Render'}
              </div>
            )}
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
          </div>

          {/* Layer 2: Watermark Branding */}
          {project.watermarkConfig?.enabled !== false && (
            <div
              className={`absolute z-20 pointer-events-none transition-all ${
                project.watermarkConfig?.position === 'top-left'
                  ? 'top-4 left-4'
                  : project.watermarkConfig?.position === 'bottom-left'
                  ? 'bottom-16 left-4'
                  : project.watermarkConfig?.position === 'bottom-right'
                  ? 'bottom-16 right-4'
                  : 'top-4 right-4'
              }`}
            >
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: primaryBrandColor }}
                />
                <span className="text-[10px] font-bold text-white tracking-wide">
                  {watermarkText}
                </span>
              </div>
            </div>
          )}

          {/* Layer 3: Dynamic Stickers & Countdown Timer */}
          {project.dynamicStickers &&
            project.dynamicStickers
              .filter(s => s.enabled)
              .map(sticker => {
                if (sticker.visibleScenes === 'cta_only' && currentScene?.sceneType !== 'cta') {
                  return null;
                }
                return (
                  <div
                    key={sticker.id}
                    className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${sticker.positionX}%`,
                      top: `${sticker.positionY}%`,
                      transform: `scale(${sticker.scale / 100})`
                    }}
                  >
                    {sticker.type === 'countdown_timer' && (
                      <div className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white border border-red-400/50 shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {sticker.title}: 01:34:28
                        </span>
                      </div>
                    )}
                    {sticker.type === 'flash_discount' && (
                      <div
                        className="px-2.5 py-1 rounded-xl text-black font-black text-xs shadow-xl flex items-center gap-1"
                        style={{ backgroundColor: secondaryBrandColor }}
                      >
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>{sticker.title}</span>
                      </div>
                    )}
                    {sticker.type === 'guarantee_badge' && (
                      <div className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sticker.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}

          {/* Layer 4: Top On-Screen Hook Badge */}
          {currentScene?.onScreenText && (
            <div className="absolute top-12 left-3 right-3 z-20 flex justify-center pointer-events-none">
              <div
                className="px-3 py-1.5 rounded-xl shadow-2xl text-center backdrop-blur-md max-w-[90%]"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: `2px solid ${primaryBrandColor}`
                }}
              >
                <p
                  className="text-xs font-black uppercase tracking-tight"
                  style={{
                    color: '#ffffff',
                    fontFamily: headingFont
                  }}
                >
                  {currentScene.onScreenText}
                </p>
              </div>
            </div>
          )}

          {/* Layer 5: Digital Avatar Speaking Corner PiP */}
          {project.selectedAvatar && (
            <div className="absolute bottom-20 right-3 z-20 pointer-events-none flex flex-col items-center">
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-2xl transition-all ${
                    isPlaying
                      ? 'border-emerald-400 ring-4 ring-emerald-500/30 scale-105'
                      : 'border-white/60'
                  }`}
                >
                  <img
                    src={project.selectedAvatar.avatarImage}
                    alt={project.selectedAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isPlaying && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
                    <Mic className="w-2.5 h-2.5 animate-pulse" />
                  </div>
                )}
              </div>
              <span className="text-[9px] font-bold text-white/90 drop-shadow mt-1 bg-black/60 px-1.5 py-0.2 rounded-full">
                {project.selectedAvatar.name.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Layer 6: Kinetic Animated Karaoke Subtitles */}
          {currentScene?.voiceoverText && (
            <div className="absolute bottom-6 left-3 right-16 z-20 pointer-events-none">
              <div className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl">
                <p
                  className="text-xs font-bold leading-relaxed text-slate-100 flex flex-wrap gap-1"
                  style={{ fontFamily: headingFont }}
                >
                  {currentScene.voiceoverText.split(/\s+/).map((word, idx) => {
                    const isWordActive = idx === activeWordIndex;
                    return (
                      <span
                        key={idx}
                        className={`transition-all duration-150 rounded px-1 ${
                          isWordActive
                            ? 'font-black scale-110 shadow-sm'
                            : 'opacity-90'
                        }`}
                        style={{
                          backgroundColor: isWordActive ? highlightColor : 'transparent',
                          color: isWordActive ? '#000000' : '#ffffff'
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Layer 7: Simulated TikTok / Reels Overlay Elements */}
          {isSocialUiVisible && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3">
              {/* Top Bar: Following / For You Tabs */}
              <div className="flex justify-center items-center gap-3 pt-1 text-white text-[11px] font-bold drop-shadow">
                <span className="text-white/60">Following</span>
                <span className="border-b-2 border-white pb-0.5">For You</span>
              </div>

              {/* Right Side Action Bar (Likes, Comments, Share, Disc) */}
              <div className="self-end flex flex-col items-center gap-3 mb-20 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  </div>
                  <span className="text-[9px] font-bold drop-shadow mt-0.5">24.5K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold drop-shadow mt-0.5">380</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold drop-shadow mt-0.5">1.2K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold drop-shadow mt-0.5">Share</span>
                </div>

                {/* Rotating Music Disc */}
                <div
                  className={`w-7 h-7 rounded-full bg-slate-900 border-2 border-white/80 flex items-center justify-center shadow-lg ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4s' }}
                >
                  <Disc className="w-4 h-4 text-indigo-400" />
                </div>
              </div>

              {/* Bottom TikTok Yellow Cart CTA Pill */}
              <div className="absolute bottom-20 left-3 z-30 pointer-events-auto">
                <button
                  className="px-3 py-1.5 rounded-full bg-[#facc15] hover:bg-[#eab308] text-black text-[11px] font-black shadow-xl flex items-center gap-1.5 transition transform hover:scale-105 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-black" />
                  <span>Keranjang Kuning (Diskon 45%)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Scene Segmented Scrubber Bar */}
      <div className="px-4 pt-3 pb-1 bg-slate-950 border-t border-slate-800">
        <div
          onClick={handleSeek}
          className="relative h-3 w-full bg-slate-800 rounded-full cursor-pointer flex overflow-hidden border border-slate-700/60"
        >
          {scenes.map((sc, idx) => {
            const scDur = sc.durationSeconds || 3;
            const widthPct = (scDur / totalDuration) * 100;
            const isCurrent = idx === computedSceneIndex;

            return (
              <div
                key={sc.id || idx}
                style={{ width: `${widthPct}%` }}
                className={`h-full border-r border-slate-950 transition-colors relative group ${
                  idx === 0
                    ? 'bg-pink-600/40 hover:bg-pink-600/70'
                    : idx === scenes.length - 1
                    ? 'bg-red-600/40 hover:bg-red-600/70'
                    : 'bg-indigo-600/40 hover:bg-indigo-600/70'
                } ${isCurrent ? 'ring-2 ring-indigo-400 z-10' : ''}`}
                title={`Scene ${idx + 1}: ${sc.sceneType} (${scDur}s)`}
              >
                {/* Segment Hover Tooltip */}
                <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                  Scene {idx + 1} • {sc.sceneType} ({scDur}s)
                </div>
              </div>
            );
          })}

          {/* Active Playhead Indicator */}
          <div
            className="absolute top-0 bottom-0 bg-white shadow-lg w-1.5 -ml-0.5 pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Playback Control Bar */}
      <div className="px-4 py-3 bg-slate-950/95 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Ulangi dari Awal (Reset)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSkipPrevScene}
            disabled={computedSceneIndex === 0}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Scene Sebelumnya"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
            title={isPlaying ? 'Pause (Spasi)' : 'Putar Video (Spasi)'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={handleSkipNextScene}
            disabled={computedSceneIndex === scenes.length - 1}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Scene Berikutnya"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Audio Mix Controls */}
        <div className="flex items-center gap-3">
          {/* Voiceover Volume / Mute */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-slate-400 hidden sm:inline">Voice</span>
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="text-slate-400 hover:text-white transition"
              title={isVoiceMuted ? 'Unmute Voiceover' : 'Mute Voiceover'}
            >
              {isVoiceMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* BGM Volume / Mute */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-slate-400 hidden sm:inline">BGM</span>
            <button
              onClick={() => setIsBgmMuted(!isBgmMuted)}
              className="text-slate-400 hover:text-white transition"
              title={isBgmMuted ? 'Unmute Background Music' : 'Mute Background Music'}
            >
              {isBgmMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Speed & Info */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {[0.75, 1, 1.25, 1.5].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

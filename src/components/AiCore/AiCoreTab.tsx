import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  RefreshCw,
  Plus,
  Trash2,
  Volume2,
  Play,
  Pause,
  Video,
  Wand2,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Film,
  Camera,
  Music,
  UserCheck,
  Bot,
  Zap,
  Globe,
  TrendingUp,
  Target,
  Flame,
  ArrowLeftRight,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Move,
  Search
} from 'lucide-react';
import {
  StoryboardScene,
  DigitalAvatar,
  TTSSettings,
  PippitProject,
  InputLayerData,
  HookVariant
} from '../../types';
import { SAMPLE_AVATARS } from '../../data/samplePresets';
import {
  generateStoryboardApi,
  seedanceRemixApi,
  generateHookVariantsApi,
  translateStoryboardApi,
  magicRefineStoryboardApi
} from '../../services/api';
import { SEOScriptAnalyzer } from './SEOScriptAnalyzer';
import { AIScriptGenerator } from './AIScriptGenerator';

interface AiCoreTabProps {
  project: PippitProject;
  onChangeStoryboard: (newScenes: StoryboardScene[]) => void;
  onChangeAvatar: (avatar: DigitalAvatar) => void;
  onChangeTtsSettings: (settings: Partial<TTSSettings>) => void;
  onProceedToQuickEdit: () => void;
  onChangeProject?: (updated: Partial<PippitProject>) => void;
}

export const AiCoreTab: React.FC<AiCoreTabProps> = ({
  project,
  onChangeStoryboard,
  onChangeAvatar,
  onChangeTtsSettings,
  onProceedToQuickEdit,
  onChangeProject,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'3act_script' | 'script' | 'hook_matrix' | 'seedance' | 'avatar'>('3act_script');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedSceneForSeedance, setSelectedSceneForSeedance] = useState<StoryboardScene>(
    project.storyboard[0] || {
      id: 'sc-default',
      sceneNumber: 1,
      sceneType: 'hook',
      durationSeconds: 3,
      voiceoverText: '',
      avatarAction: '',
      visualPrompt: '',
      visualUrl: '',
      onScreenText: '',
      cameraMovement: 'static',
      transition: 'cut',
    }
  );
  const [seedanceEditPrompt, setSeedanceEditPrompt] = useState('');
  const [isSeedanceProcessing, setIsSeedanceProcessing] = useState(false);
  const [seedanceHistory, setSeedanceHistory] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // A/B Hook Matrix State
  const [hookVariants, setHookVariants] = useState<HookVariant[]>([
    {
      id: 'hook-preset-1',
      angleType: 'curiosity_gap',
      angleTitle: 'Curiosity & Secret Reveal',
      voiceoverText: `Kalian jangan checkout dulu sebelum liat rahasia tersembunyi dari ${project.inputData.productAnalysis?.productName || 'produk ini'}!`,
      onScreenText: '😱 JANGAN BELI DULU SEBELUM LIAT INI!',
      visualPrompt: 'Close-up host pointing dramatically at camera with shocked expression, high engagement UGC lighting, 9:16 vertical view',
      predictedRetention3s: 92.4,
      predictedCtrLift: '+34.5% CTR',
      psychologicalTrigger: 'FOMO & Curiosity Gap Trigger',
    },
    {
      id: 'hook-preset-2',
      angleType: 'problem_agitation',
      angleTitle: 'Visceral Pain Point Callout',
      voiceoverText: 'Capek banget kan kalau beli yang abal-abal langsung rusak? Ini solusi yang beneran awet!',
      onScreenText: '🛑 CAPEK DITIPU BARANG ABAL-ABAL?',
      visualPrompt: 'Frustrated expression holding poor competitor product, sudden snap cut to pristine product in action',
      predictedRetention3s: 88.7,
      predictedCtrLift: '+22.8% CTR',
      psychologicalTrigger: 'Relatable Problem Agitation',
    },
    {
      id: 'hook-preset-3',
      angleType: 'price_shock',
      angleTitle: 'Price Shock & Flash Promo',
      voiceoverText: 'Gak masuk akal! Kualitas sebagus ini lagi ada diskon 50% cuma buat 50 pembeli pertama!',
      onScreenText: '🔥 DISKON FLASH SALE 50% HARI INI!',
      visualPrompt: 'Price tag slash animation with pulsing yellow cart countdown badge and bright product hero display',
      predictedRetention3s: 94.1,
      predictedCtrLift: '+41.2% CTR',
      psychologicalTrigger: 'Extreme Bargain & Scarcity Urgency',
    },
    {
      id: 'hook-preset-4',
      angleType: 'social_proof',
      angleTitle: 'Viral Social Proof & FOMO',
      voiceoverText: 'Pantesan ludes 10.000 pcs dalam seminggu di TikTok Shop, ternyata rahasianya ada di sini!',
      onScreenText: '⭐ 10.000+ SOLD OUT! RAHASIA VIRAL',
      visualPrompt: 'Dynamic screen recording of 5-star customer reviews popping up with happy UGC creator smiling',
      predictedRetention3s: 89.9,
      predictedCtrLift: '+28.4% CTR',
      psychologicalTrigger: 'Bandwagon Effect & Social Proof',
    },
  ]);
  const [isLoadingHooks, setIsLoadingHooks] = useState(false);
  const [appliedHookId, setAppliedHookId] = useState<string | null>(null);

  // Localization Translation State
  const [targetTransLang, setTargetTransLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationSuccess, setTranslationSuccess] = useState(false);

  // AI Magic Refine State (Uses product analysis data to automatically upgrade hook lines & viral visual prompts)
  const [isMagicRefining, setIsMagicRefining] = useState(false);
  const [magicRefiningSceneId, setMagicRefiningSceneId] = useState<string | null>(null);
  const [magicRefineSummary, setMagicRefineSummary] = useState<string | null>(null);
  const [magicRefineHooks, setMagicRefineHooks] = useState<string[]>([]);
  const [showMagicRefineModal, setShowMagicRefineModal] = useState(false);

  // AI Magic Refine Action Handler
  const handleMagicRefineStoryboard = async (specificSceneId?: string, focus?: 'viral_hooks' | 'cinematic_prompts' | 'all') => {
    setIsMagicRefining(true);
    if (specificSceneId) {
      setMagicRefiningSceneId(specificSceneId);
    }
    try {
      const result = await magicRefineStoryboardApi({
        scenes: project.storyboard,
        productAnalysis: project.inputData.productAnalysis,
        specificSceneId,
        focus: focus || 'all',
      });

      onChangeStoryboard(result.scenes);
      setMagicRefineSummary(result.refineSummary);
      if (result.viralHooksSuggested && result.viralHooksSuggested.length > 0) {
        setMagicRefineHooks(result.viralHooksSuggested);
      }
      setShowMagicRefineModal(true);

      // Auto dismiss banner after 6s
      setTimeout(() => {
        setMagicRefineSummary(null);
      }, 6000);
    } catch (err) {
      console.error('Error during AI Magic Refine:', err);
    } finally {
      setIsMagicRefining(false);
      setMagicRefiningSceneId(null);
    }
  };

  // Generate A/B Hook Matrix
  const handleGenerateHooks = async () => {
    setIsLoadingHooks(true);
    try {
      const generated = await generateHookVariantsApi({
        productTitle: project.inputData.productAnalysis?.productName || project.title,
        usps: project.inputData.productAnalysis?.uniqueSellingPoints || [],
        painPoints: project.inputData.productAnalysis?.painPointsSolved || [],
        tone: project.inputData.selectedTone,
        language: project.inputData.targetLanguage,
      });
      setHookVariants(generated);
    } catch (err) {
      console.error('Error generating hook matrix:', err);
    } finally {
      setIsLoadingHooks(false);
    }
  };

  // 1-Click Apply Hook to Scene 1
  const handleApplyHookToScene1 = (variant: HookVariant) => {
    const updated = project.storyboard.map((sc, idx) => {
      if (idx === 0) {
        return {
          ...sc,
          voiceoverText: variant.voiceoverText,
          onScreenText: variant.onScreenText,
          visualPrompt: variant.visualPrompt,
        };
      }
      return sc;
    });
    onChangeStoryboard(updated);
    setAppliedHookId(variant.id);
    setTimeout(() => setAppliedHookId(null), 3000);
  };

  // Multilingual Translator
  const handleTranslateStoryboard = async () => {
    setIsTranslating(true);
    setTranslationSuccess(false);
    try {
      const translated = await translateStoryboardApi({
        scenes: project.storyboard,
        targetLanguage: targetTransLang,
      });
      onChangeStoryboard(translated);
      setTranslationSuccess(true);
      setTimeout(() => setTranslationSuccess(false), 3500);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Re-generate complete storyboard
  const handleRegenerateStoryboard = async () => {
    setIsRegenerating(true);
    try {
      const generated = await generateStoryboardApi({
        productAnalysis: project.inputData.productAnalysis,
        promptConcept: project.inputData.promptConcept,
        duration: project.inputData.duration,
        tone: project.inputData.selectedTone,
        avatarName: project.selectedAvatar.name,
        language: project.inputData.targetLanguage,
      });
      onChangeStoryboard(generated);
      if (generated.length > 0) {
        setSelectedSceneForSeedance(generated[0]);
      }
    } catch (err) {
      console.error('Error generating storyboard:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Seedance prompt remix
  const handleApplySeedanceRemix = async () => {
    if (!seedanceEditPrompt.trim()) return;
    setIsSeedanceProcessing(true);
    try {
      const result = await seedanceRemixApi({
        scene: selectedSceneForSeedance,
        editInstruction: seedanceEditPrompt,
        productContext: project.inputData.productAnalysis?.productName,
      });

      const updated = project.storyboard.map((sc) => {
        if (sc.id === selectedSceneForSeedance.id) {
          return {
            ...sc,
            visualPrompt: result.updatedVisualPrompt,
            avatarAction: result.updatedAvatarAction,
            onScreenText: result.updatedOnScreenText || sc.onScreenText,
            cameraMovement: (result.updatedCameraMovement as any) || sc.cameraMovement,
          };
        }
        return sc;
      });

      onChangeStoryboard(updated);
      setSelectedSceneForSeedance((prev) => ({
        ...prev,
        visualPrompt: result.updatedVisualPrompt,
        avatarAction: result.updatedAvatarAction,
      }));
      setSeedanceHistory((prev) => [result.seedanceEffectSummary, ...prev]);
      setSeedanceEditPrompt('');
    } catch (err) {
      console.error('Seedance remix error:', err);
    } finally {
      setIsSeedanceProcessing(false);
    }
  };

  // Audio preview simulation
  const handlePlayVoicePreview = (text?: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = text || project.storyboard[0]?.voiceoverText || 'Halo! Ini adalah preview suara digital avatar KontenKU.';
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = project.ttsSettings.speed || 1.1;
      utterance.pitch = project.ttsSettings.pitch || 1.0;
      utterance.lang = project.inputData.targetLanguage === 'en' ? 'en-US' : 'id-ID';

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  // Scene CRUD
  const handleUpdateScene = (sceneId: string, fields: Partial<StoryboardScene>) => {
    const updated = project.storyboard.map((sc) =>
      sc.id === sceneId ? { ...sc, ...fields } : sc
    );
    onChangeStoryboard(updated);
  };

  const handleAddScene = () => {
    const newScene: StoryboardScene = {
      id: `scene-custom-${Date.now()}`,
      sceneNumber: project.storyboard.length + 1,
      sceneType: 'demo',
      durationSeconds: 3,
      voiceoverText: 'Tambahkan narasi pendukung untuk menonjolkan fitur produk di sini.',
      avatarAction: 'Menunjukkan keunggulan produk secara detail',
      visualPrompt: 'Clean product closeup in aesthetic studio setting, 9:16 vertical view',
      visualUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      onScreenText: '✨ Fitur Unggulan Terbaru',
      cameraMovement: 'zoom_in',
      transition: 'cut',
      bgSoundEffect: 'Pop',
    };
    onChangeStoryboard([...project.storyboard, newScene]);
  };

  const handleDeleteScene = (sceneId: string) => {
    if (project.storyboard.length <= 1) return;
    const filtered = project.storyboard
      .filter((sc) => sc.id !== sceneId)
      .map((sc, index) => ({ ...sc, sceneNumber: index + 1 }));
    onChangeStoryboard(filtered);
  };

  // Drag and drop state for Storyboard scenes
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);
  const [dragOverSceneIndex, setDragOverSceneIndex] = useState<number | null>(null);

  const handleSceneDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSceneIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleSceneDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSceneIndex !== index) {
      setDragOverSceneIndex(index);
    }
  };

  const handleSceneDragLeave = (e: React.DragEvent, index: number) => {
    if (dragOverSceneIndex === index) {
      setDragOverSceneIndex(null);
    }
  };

  const handleSceneDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSceneIndex === null || draggedSceneIndex === targetIndex) {
      setDraggedSceneIndex(null);
      setDragOverSceneIndex(null);
      return;
    }

    const updated = [...project.storyboard];
    const [moved] = updated.splice(draggedSceneIndex, 1);
    updated.splice(targetIndex, 0, moved);

    const reindexed = updated.map((sc, idx) => ({
      ...sc,
      sceneNumber: idx + 1,
    }));

    onChangeStoryboard(reindexed);
    setDraggedSceneIndex(null);
    setDragOverSceneIndex(null);
  };

  const handleSceneDragEnd = () => {
    setDraggedSceneIndex(null);
    setDragOverSceneIndex(null);
  };

  // 1-Click Move left/right handler
  const handleMoveSceneStep = (currentIndex: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= project.storyboard.length) return;

    const updated = [...project.storyboard];
    const [moved] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, moved);

    const reindexed = updated.map((sc, idx) => ({
      ...sc,
      sceneNumber: idx + 1,
    }));

    onChangeStoryboard(reindexed);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-200">
            <Cpu className="w-3.5 h-3.5" />
            Layer 2: AI Core & Model Processing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Otak Pemrosesan Multi-Model Bytedance
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Penyusunan naskah otomatis (AI Script), generator visual sinematik Seedance berbasis teks, serta aktor digital (AI Influencer) dengan Text-to-Speech multi-aksen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-regenerate-storyboard"
            onClick={handleRegenerateStoryboard}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span>{isRegenerating ? 'Menyusun Ulang...' : 'Re-Generate AI'}</span>
          </button>

          <button
            id="btn-proceed-to-quickedit"
            onClick={onProceedToQuickEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 shrink-0"
          >
            <span>Lanjut ke 3. Studio Quick Edit</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('3act_script')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeSubTab === '3act_script'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>✨ AI Script Generator (3 Babak)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('script')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeSubTab === 'script'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Film className="w-4 h-4 text-indigo-600" />
          <span>1. Naskah & Storyboard ({project.storyboard.length} Adegan)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hook_matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeSubTab === 'hook_matrix'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>2. A/B Hook Matrix (4 Sudut Viral)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seedance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeSubTab === 'seedance'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Wand2 className="w-4 h-4 text-indigo-600" />
          <span>3. Seedance Video Engine (Text-to-Video)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('avatar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeSubTab === 'avatar'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>4. Digital Avatar & Multi-Accent TTS</span>
        </button>
      </div>

      {/* SUB-TAB 0: AI Script Generator (3-Act Structure) */}
      {activeSubTab === '3act_script' && (
        <AIScriptGenerator
          project={project}
          onChangeProject={onChangeProject || (() => {})}
          onNavigateToQuickEdit={onProceedToQuickEdit}
        />
      )}

      {/* SUB-TAB 1: AI Script & Storyboard Editor */}
      {activeSubTab === 'script' && (
        <div className="space-y-6">
          {/* Multilingual Localization Banner */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Auto-Dubbing & Global Market Localizer</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                    Cross-Border E-Commerce
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Terjemahkan & sesuaikan dialek naskah secara otomatis untuk pasar TikTok & Reels global.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={targetTransLang}
                onChange={(e) => setTargetTransLang(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="en">🇺🇸 English (US Commerce & Slang)</option>
                <option value="ms">🇲🇾 Bahasa Melayu (Pasar Malaysia)</option>
                <option value="id">🇮🇩 Bahasa Indonesia (Gen-Z UGC)</option>
                <option value="tl">🇵🇭 Filipino / Tagalog (Shopee PH)</option>
                <option value="th">🇹🇭 Thai (Southeast Asia)</option>
                <option value="ja">🇯🇵 Japanese (Clean Commerce)</option>
              </select>

              <button
                onClick={handleTranslateStoryboard}
                disabled={isTranslating}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menerjemahkan...</span>
                  </>
                ) : translationSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Naskah Disesuaikan!</span>
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Adaptasi Naskah</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TikTok & Reels E-Commerce SEO Engine & Search Trends Analysis Tool */}
          <SEOScriptAnalyzer
            project={project}
            onChangeStoryboard={onChangeStoryboard}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Struktur Alur Cerita Iklan (Storyboard)</span>
                <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md font-semibold">
                  Formula UGC Hook-to-CTA
                </span>
              </h2>
              <p className="text-xs text-slate-500">Setiap adegan dioptimalkan untuk menjaga retensi audiens TikTok & Reels</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* AI MAGIC REFINE BUTTON */}
              <button
                id="btn-ai-magic-refine"
                onClick={() => handleMagicRefineStoryboard()}
                disabled={isMagicRefining}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 hover:from-amber-600 hover:via-pink-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
                title="Gunakan data analisis produk untuk menyempurnakan hook viral 3s dan prompt visual secara otomatis"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isMagicRefining ? 'animate-spin' : 'animate-pulse text-amber-200'}`} />
                <span>{isMagicRefining ? 'AI Magic Refine Sedang Bekerja...' : '✨ AI Magic Refine'}</span>
              </button>

              <button
                onClick={handleAddScene}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tambah Adegan</span>
              </button>
            </div>
          </div>

          {/* AI Magic Refine Result Banner */}
          {magicRefineSummary && (
            <div className="p-4 bg-gradient-to-r from-amber-50 via-pink-50 to-indigo-50 border border-indigo-200/80 rounded-2xl space-y-3 shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Hasil AI Magic Refine (Berdasarkan Data Produk)
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Viral Retention Lift +38%
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                      {magicRefineSummary}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMagicRefineSummary(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Suggested Alternative Viral Hooks */}
              {magicRefineHooks.length > 0 && (
                <div className="pt-2 border-t border-indigo-100/80">
                  <span className="text-[11px] font-bold text-indigo-900 block mb-1.5">
                    💡 Rekomendasi Sudut Hook Alternatif (Klik untuk Terapkan ke Scene 1):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {magicRefineHooks.map((hookText, hIdx) => (
                      <button
                        key={hIdx}
                        onClick={() => {
                          const updated = project.storyboard.map((sc, sIdx) => {
                            if (sIdx === 0) {
                              return {
                                ...sc,
                                voiceoverText: hookText.replace(/^"|"$/g, ''),
                                onScreenText: `🔥 ${hookText.slice(0, 30)}...`,
                              };
                            }
                            return sc;
                          });
                          onChangeStoryboard(updated);
                          setMagicRefineSummary('✅ Sudut hook alternatif berhasil diterapkan ke Adegan 1!');
                          setTimeout(() => setMagicRefineSummary(null), 3000);
                        }}
                        className="p-2 bg-white/80 hover:bg-white border border-indigo-200/60 rounded-xl text-left text-[11px] text-slate-800 hover:text-indigo-900 hover:border-indigo-400 transition shadow-2xs group"
                      >
                        <span className="line-clamp-2 italic font-medium">{hookText}</span>
                        <span className="text-[10px] text-indigo-600 font-bold block mt-1 group-hover:underline">
                          + Terapkan ke Hook
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Drag and drop helper tip */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                <strong>Fitur Drag & Drop:</strong> Tarik kartu adegan dengan ikon grip atau gunakan tombol panah <span className="font-bold text-indigo-700">◀ ▶</span> untuk mengatur ulang urutan timeline video secara instan.
              </span>
            </div>
            <span className="hidden sm:inline-flex text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">
              {project.storyboard.length} Adegan Terdaftar
            </span>
          </div>

          {/* Scene Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.storyboard.map((scene, idx) => (
              <div
                key={scene.id}
                draggable
                onDragStart={(e) => handleSceneDragStart(e, idx)}
                onDragOver={(e) => handleSceneDragOver(e, idx)}
                onDragLeave={(e) => handleSceneDragLeave(e, idx)}
                onDrop={(e) => handleSceneDrop(e, idx)}
                onDragEnd={handleSceneDragEnd}
                className={`bg-white border rounded-2xl p-4 space-y-3.5 shadow-sm flex flex-col justify-between transition-all duration-200 group relative ${
                  draggedSceneIndex === idx
                    ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50/40 scale-[0.98]'
                    : dragOverSceneIndex === idx
                    ? 'border-2 border-indigo-600 ring-4 ring-indigo-100 bg-indigo-50/30 scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Scene Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    {/* Drag Grip Handle */}
                    <div
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-grab active:cursor-grabbing transition"
                      title="Tarik & Lepas untuk mengubah urutan adegan"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center border border-slate-200">
                      {scene.sceneNumber}
                    </span>
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      scene.sceneType === 'hook'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : scene.sceneType === 'cta'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {scene.sceneType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {/* Quick Move Step Left */}
                    <button
                      type="button"
                      onClick={() => handleMoveSceneStep(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-indigo-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition"
                      title="Geser adegan ke kiri / sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Move Step Right */}
                    <button
                      type="button"
                      onClick={() => handleMoveSceneStep(idx, 'right')}
                      disabled={idx === project.storyboard.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-indigo-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition"
                      title="Geser adegan ke kanan / selanjutnya"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-3.5 bg-slate-200 mx-0.5" />

                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={scene.durationSeconds}
                      onChange={(e) =>
                        handleUpdateScene(scene.id, { durationSeconds: parseFloat(e.target.value) || 3 })
                      }
                      className="w-11 bg-white border border-slate-300 rounded-md px-1 py-0.5 text-center text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-[10px]">dtk</span>

                    <button
                      onClick={() => handleDeleteScene(scene.id)}
                      disabled={project.storyboard.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition ml-0.5"
                      title="Hapus Adegan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Visual Preview Image */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={scene.visualUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'}
                    alt={`Scene ${scene.sceneNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm self-start truncate max-w-full">
                      Teks Layar: {scene.onScreenText}
                    </span>
                  </div>
                </div>

                {/* Voiceover Script Input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Naskah Voiceover (Avatar Dialogue)
                  </label>
                  <textarea
                    rows={3}
                    value={scene.voiceoverText}
                    onChange={(e) => handleUpdateScene(scene.id, { voiceoverText: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Seedance Visual Prompt Description */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Petunjuk Visual / Seedance Prompt
                  </label>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 line-clamp-2">
                    {scene.visualPrompt}
                  </p>
                </div>

                {/* Camera & Transition metadata */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 truncate">
                    <Camera className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="capitalize truncate">{scene.cameraMovement.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Music className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">{scene.bgSoundEffect || 'None'}</span>
                  </div>
                </div>

                {/* Action Buttons: AI Magic Refine & Seedance Engine */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleMagicRefineStoryboard(scene.id)}
                    disabled={isMagicRefining && magicRefiningSceneId === scene.id}
                    className="py-2 bg-gradient-to-r from-amber-50 to-pink-50 hover:from-amber-100 hover:to-pink-100 border border-pink-200/80 text-pink-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 shadow-2xs"
                    title="Optimalkan Hook & Prompt Visual adegan ini dengan data produk AI"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isMagicRefining && magicRefiningSceneId === scene.id ? 'animate-spin text-pink-600' : 'text-amber-500'}`} />
                    <span>{isMagicRefining && magicRefiningSceneId === scene.id ? 'Refining...' : 'Magic Refine'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSceneForSeedance(scene);
                      setActiveSubTab('seedance');
                    }}
                    className="py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Seedance Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: A/B Hook Variant Matrix */}
      {activeSubTab === 'hook_matrix' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-500" />
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Matrix Pengujian A/B Hook 3-Detik Pertama
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                70% keberhasilan iklan TikTok & Reels ditentukan oleh 3 detik pertama. Pilih dari 4 formula psikologi viral di bawah atau generate varian baru secara otomatis.
              </p>
            </div>

            <button
              onClick={handleGenerateHooks}
              disabled={isLoadingHooks}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHooks ? 'animate-spin' : ''}`} />
              <span>{isLoadingHooks ? 'Menghasilkan 4 Sudut...' : 'Generate 4 Varian Hook AI'}</span>
            </button>
          </div>

          {/* Current Active Hook Info */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Adegan 1 (Hook Saat Ini di Storyboard)
                </span>
                <p className="text-xs font-semibold text-slate-900 italic">
                  "{project.storyboard[0]?.voiceoverText}"
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-white text-slate-700 font-semibold rounded-lg border border-indigo-100 shadow-2xs self-start sm:self-auto">
              Teks Layar: {project.storyboard[0]?.onScreenText}
            </span>
          </div>

          {/* 4 Hook Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hookVariants.map((hook, idx) => {
              const isApplied = appliedHookId === hook.id;
              return (
                <div
                  key={hook.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          idx === 0
                            ? 'bg-purple-100 text-purple-700'
                            : idx === 1
                            ? 'bg-rose-100 text-rose-700'
                            : idx === 2
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">{hook.angleTitle}</h3>
                          <span className="text-[10px] text-slate-500 font-medium">{hook.psychologicalTrigger}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {hook.predictedCtrLift}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Retensi 3s: <strong className="text-slate-800">{hook.predictedRetention3s}%</strong>
                        </span>
                      </div>
                    </div>

                    {/* Voiceover Speech Script */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Naskah Dialog Hook (Voiceover)
                      </label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                        "{hook.voiceoverText}"
                      </div>
                    </div>

                    {/* On-Screen Text Badge */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Stiker Teks Layar (Visual Anchor)
                      </label>
                      <span className="inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xs">
                        {hook.onScreenText}
                      </span>
                    </div>

                    {/* Seedance Visual Direction */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Arahan Visual Seedance
                      </label>
                      <p className="text-[11px] text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200 line-clamp-2">
                        {hook.visualPrompt}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handlePlayVoicePreview(hook.voiceoverText)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                      title="Dengarkan Preview Suara"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tes Suara</span>
                    </button>

                    <button
                      onClick={() => handleApplyHookToScene1(hook)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>Berhasil Diterapkan ke Adegan 1!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Terapkan ke Adegan 1 (Hook)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Seedance Video Engine */}
      {activeSubTab === 'seedance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Canvas & Scene Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>Seedance Text-Driven Video Modifier</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit adegan video cukup dengan instruksi teks layaknya mengedit foto (ganti background, objek, tata cahaya, atau ekspresi).
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                  Scene #{selectedSceneForSeedance.sceneNumber}
                </span>
              </div>

              {/* Scene Visualizer Stage */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center group">
                <img
                  src={selectedSceneForSeedance.visualUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'}
                  alt="Seedance Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-700 backdrop-blur-md">
                      Seedance Cinematic Model V3.1
                    </span>
                    <span className="text-xs text-amber-300 font-bold px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40">
                      High-Fidelity Render
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white drop-shadow-md">
                      "{selectedSceneForSeedance.onScreenText}"
                    </div>
                    <div className="text-xs text-slate-200 line-clamp-1 italic drop-shadow">
                      {selectedSceneForSeedance.voiceoverText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scene Switcher Pills */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-medium">Pilih Adegan yang Ingin Diedit:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {project.storyboard.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedSceneForSeedance(sc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                        selectedSceneForSeedance.id === sc.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>Scene #{sc.sceneNumber}</span>
                      <span className="text-[10px] opacity-75">({sc.sceneType})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seedance Transformation History */}
            {seedanceHistory.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Riwayat Transformasi Seedance AI</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {seedanceHistory.map((item, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Natural Language Seedance Remix Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Perintah Modifikasi Video (Natural Language)</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Ketik Instruksi Perubahan untuk Adegan #{selectedSceneForSeedance.sceneNumber}
                </label>
                <textarea
                  rows={4}
                  value={seedanceEditPrompt}
                  onChange={(e) => setSeedanceEditPrompt(e.target.value)}
                  placeholder="Contoh: Ganti background menjadi kafe aesthetic Bali dengan pencahayaan sunset hangat, ubah sudut kamera menjadi zoom macro dinamis..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              {/* One-Click Presets for Quick Seedance Modifier */}
              <div>
                <span className="text-xs text-slate-500 font-medium block mb-2">
                  Atau klik template efek Seedance instan:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Ganti background ke aesthetic modern cafe',
                    'Ubah pencahayaan ke Cyberpunk Neon RGB',
                    'Tambahkan efek percikan air / slow-motion splash',
                    'Ganti ke studio minimalis putih clean mewah',
                    'Tambahkan efek zoom dramatis & particles',
                    'Ubah nuansa ke Tropical Outdoor Bali sunset',
                  ].map((presetText, i) => (
                    <button
                      key={i}
                      onClick={() => setSeedanceEditPrompt(presetText)}
                      className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-[11px] text-slate-700 transition"
                    >
                      + {presetText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-apply-seedance"
                onClick={handleApplySeedanceRemix}
                disabled={isSeedanceProcessing || !seedanceEditPrompt.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isSeedanceProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Memproses Seedance AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-white" />
                    <span>Terapkan Modifikasi Seedance</span>
                  </>
                )}
              </button>

              {/* Current Prompt Breakdown */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Seedance Visual Prompt Saat Ini
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {selectedSceneForSeedance.visualPrompt}
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: Digital Avatar & TTS */}
      {activeSubTab === 'avatar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Avatar Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Pilih Digital Avatar (AI Influencer / Host)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aktor buatan yang dapat berbicara secara natural dengan ekspresi bibir (lip-sync) tersinkronisasi
                  </p>
                </div>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SAMPLE_AVATARS.map((avatar) => {
                  const isSelected = project.selectedAvatar.id === avatar.id;
                  return (
                    <div
                      key={avatar.id}
                      onClick={() => onChangeAvatar(avatar)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex gap-3.5 items-start ${
                        isSelected
                          ? 'bg-indigo-50/60 border-indigo-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={avatar.avatarImage}
                          alt={avatar.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 truncate">
                        <div className="font-bold text-sm text-slate-900 truncate">{avatar.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{avatar.role}</div>
                        <div className="text-[10px] text-indigo-600 font-medium truncate">{avatar.accent}</div>
                        
                        <div className="flex flex-wrap gap-1 pt-1">
                          {avatar.tags.slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TTS & Voice Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Pengaturan Text-to-Speech (TTS)</span>
              </h3>

              {/* Selected Avatar Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <img
                  src={project.selectedAvatar.avatarImage}
                  alt={project.selectedAvatar.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{project.selectedAvatar.name}</div>
                  <div className="text-[11px] text-slate-500">{project.selectedAvatar.accent}</div>
                  <div className="text-[10px] text-indigo-600 font-medium">Default Voice: {project.selectedAvatar.defaultVoice}</div>
                </div>
              </div>

              {/* Emotion Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Emosi & Gaya Bicara
                </label>
                <select
                  value={project.ttsSettings.emotion}
                  onChange={(e) => onChangeTtsSettings({ emotion: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="excited">Excited & High Energy (Viral UGC)</option>
                  <option value="convincing">Meyakinkan & Edukatif (Problem-Solution)</option>
                  <option value="natural">Natural Conversational (Santai)</option>
                  <option value="authoritative">Authoritative & Elegant (Luxury)</option>
                </select>
              </div>

              {/* Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Kecepatan Bicara (Pacing)</span>
                  <span className="text-indigo-600 font-bold">{project.ttsSettings.speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={project.ttsSettings.speed}
                  onChange={(e) => onChangeTtsSettings({ speed: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Lambat (0.8x)</span>
                  <span>Standar (1.0x)</span>
                  <span>TikTok Fast (1.4x)</span>
                </div>
              </div>

              {/* Voice Tester Button */}
              <button
                onClick={() => handlePlayVoicePreview()}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Menghentikan Preview Suara...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    <span>Tes Sampel Suara Avatar ({project.selectedAvatar.name})</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

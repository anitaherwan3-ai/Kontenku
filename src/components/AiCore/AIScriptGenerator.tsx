import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Play,
  Volume2,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Tag,
  Plus,
  X,
  Layers,
  ArrowRight,
  Flame,
  ShoppingBag,
  ShieldCheck,
  Eye,
  Camera,
  Film,
  Zap,
  Sliders
} from 'lucide-react';
import { PippitProject, ThreeActItem, ThreeActScriptData, StoryboardScene } from '../../types';
import { generate3ActScriptApi } from '../../services/api';

interface AIScriptGeneratorProps {
  project: PippitProject;
  onChangeProject: (updated: Partial<PippitProject>) => void;
  onNavigateToQuickEdit?: () => void;
}

const SAMPLE_KEYWORD_SUGGESTIONS = [
  '10% Niacinamide',
  'Pudarkan Bekas Jerawat 7 Hari',
  'Tekstur Watery Gel Cepat Meresap',
  'Diskon Flash Sale 45%',
  'Keranjang Kuning',
  'Garansi 100% BPOM & Halal',
  'Viral TikTok FYP',
  'Anti Lengket & Ringan',
  'Hot-swappable Switch',
  'Baterai Tahan Lama',
  'Hasil Terbukti Nyata'
];

const STRATEGY_ANGLES = [
  {
    id: 'viral_problem_solution',
    name: 'Problem-Solution (Curiosity & Solusi Nyata)',
    description: 'Hook masalah relatable (bekas jerawat/meja berantakan) + demo produk penyelamat.',
    icon: Flame,
    recommendedFor: 'Skincare, Gadget, Life Hacks'
  },
  {
    id: 'price_shock',
    name: 'Price Shock & Scarcity Urgency (Diskon Flash Sale)',
    description: 'Hook membandingkan harga mahal vs murah + desakan beli di keranjang kuning.',
    icon: ShoppingBag,
    recommendedFor: 'Flash Sale, Promo Terbatas, E-Commerce'
  },
  {
    id: 'sensory_asmr_demo',
    name: 'Sensory ASMR & Macro Texture Demo',
    description: 'Fokus visual macro tetesan/tekstur suara thocky yang memuaskan audiens.',
    icon: Sparkles,
    recommendedFor: 'Beauty Serum, Food & Beverage, Mechanical Gear'
  },
  {
    id: 'skeptical_reverse',
    name: 'Skeptical Review & Honest Transformation',
    description: 'Awalnya ragu & skeptis, lalu kaget setelah melihat hasil dalam 7 hari.',
    icon: ShieldCheck,
    recommendedFor: 'UGC Reviewer, High Trust Building'
  }
];

export const AIScriptGenerator: React.FC<AIScriptGeneratorProps> = ({
  project,
  onChangeProject,
  onNavigateToQuickEdit
}) => {
  const initialKeywords = project.threeActScript?.acts?.flatMap(a => a.keywordsUsed) || [
    '10% Niacinamide',
    'Pudarkan Bekas Jerawat',
    'Tekstur Watery',
    'Diskon Flash Sale 45%'
  ];

  const [productTitle, setProductTitle] = useState(
    project.inputData.productAnalysis?.productName || 'GlowLuxe 10% Niacinamide Serum'
  );
  const [category, setCategory] = useState(
    project.inputData.productAnalysis?.category || 'Skincare & Beauty'
  );
  const [brandName, setBrandName] = useState(
    project.brandKit?.brandName || project.inputData.productAnalysis?.brandName || 'GlowLuxe Official'
  );
  const [selectedStrategy, setSelectedStrategy] = useState('viral_problem_solution');
  const [duration, setDuration] = useState<'15s' | '30s'>('15s');
  const [language, setLanguage] = useState<'id' | 'en' | 'ms'>('id');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(Array.from(new Set(initialKeywords)));
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [playingActSpeech, setPlayingActSpeech] = useState<number | null>(null);

  const scriptData: ThreeActScriptData = project.threeActScript || {
    scriptTitle: 'Naskah 3-Babak Viral: GlowLuxe 10% Niacinamide Serum',
    overallConcept: 'Struktur naskah 3 babak dengan Hook kontras harga, Demo tekstur cepat meresap, dan CTA diskon kilat keranjang kuning.',
    targetHookAngle: 'Curiosity & Price Contrast Hook',
    targetPacing: 'Fast-paced & High Retention',
    estimatedWatchTime: '15.0s (Target Completion: 48%)',
    acts: [
      {
        actNumber: 1,
        actType: 'hook',
        actTitle: 'Babak 1: The Viral Hook (0-3s)',
        durationSeconds: 3,
        voiceoverText: 'Stop buang jutaan rupiah buat perawatan klinik! Rahasia kulit glowing kaca ternyata cuma serum 80 ribuan ini!',
        onScreenText: '😱 STOP BUANG JUTAAN! Kulit Glowing Modal 80K',
        avatarAction: 'Ekspresi kaget sambil menunjuk ke kamera lalu mengangkat produk serum',
        visualPrompt: 'POV front view: A trendy Gen-Z Indonesian girl with glowing dewy glass skin holding GlowLuxe serum bottle, energetic gesture, bright aesthetic bathroom backdrop, TikTok style 9:16 vertical high quality',
        cameraMovement: 'zoom_in',
        transition: 'zoom_blur',
        bgSoundEffect: 'Whoosh + Record Scratch',
        psychologicalAngle: 'Price Contrast & Visceral Problem Agitation',
        keywordsUsed: ['serum viral', 'kulit glowing', 'diskon 80k'],
        visualUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
      },
      {
        actNumber: 2,
        actType: 'demo',
        actTitle: 'Babak 2: The Demo & Problem Solution (3-12s)',
        durationSeconds: 8,
        voiceoverText: 'Ini dia GlowLuxe Serum! 10% Niacinamide murni plus 3X Ceramide. Teksturnya watery banget, langsung meresap dalam 5 detik tanpa rasa lengket sama sekali!',
        onScreenText: '✨ 10% Niacinamide + 3X Ceramide (Watery & Cepat Meresap)',
        avatarAction: 'Meneteskan serum ke pipi/tangan lalu mengusapnya dengan efek glowing seketika',
        visualPrompt: 'Ultra macro slow motion: clear golden serum droplet falling from glass pipette onto smooth skin, instant hydration glow shimmer, pastel studio backdrop',
        cameraMovement: 'pan_right',
        transition: 'cut',
        bgSoundEffect: 'Water Droplet Pop + Thock',
        psychologicalAngle: 'Sensory ASMR Demo & Formula USP Proof',
        keywordsUsed: ['10% Niacinamide', '3X Ceramide', 'Watery Gel'],
        visualUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      },
      {
        actNumber: 3,
        actType: 'cta',
        actTitle: 'Babak 3: The Urgency CTA & Yellow Cart (12-15s)',
        durationSeconds: 4,
        voiceoverText: 'Lagi ada diskon flash sale 45% cuma buat 50 pembeli pertama! Klik keranjang kuning di kiri bawah sekarang juga sebelum kehabisan!',
        onScreenText: '👇 KLIK KERANJANG KUNING (DISKON 45% HARI INI)',
        avatarAction: 'Menunjuk ke sudut kiri bawah layar dengan ekspresi antusias',
        visualPrompt: 'Big glowing TikTok Yellow Cart animation pulsing at bottom left, limited stock counter ticker, high conversion e-commerce CTA',
        cameraMovement: 'dynamic_shake',
        transition: 'glitch',
        bgSoundEffect: 'Cash Register Cha-Ching',
        psychologicalAngle: 'Scarcity Fear & Direct Action Command',
        keywordsUsed: ['diskon 45%', 'flash sale', 'keranjang kuning'],
        visualUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
      }
    ]
  };

  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    if (!keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const generated = await generate3ActScriptApi({
        productTitle,
        category,
        brandName,
        keywords,
        usps: project.inputData.productAnalysis?.uniqueSellingPoints || [],
        painPoints: project.inputData.productAnalysis?.painPointsSolved || [],
        tone: project.inputData.selectedTone || 'excited_ugc',
        duration,
        adGoal: project.inputData.adGoal || 'conversion',
        language,
        strategyAngle: selectedStrategy
      });

      onChangeProject({
        threeActScript: generated
      });
    } catch (err) {
      console.error('Failed to generate 3-act script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStoryboard = () => {
    if (!scriptData || !scriptData.acts) return;

    // Convert 3 acts directly into Pippit StoryboardScene array
    const convertedScenes: StoryboardScene[] = scriptData.acts.map((act, idx) => ({
      id: `scene-3act-${Date.now()}-${idx}`,
      sceneNumber: idx + 1,
      sceneType: act.actType === 'hook' ? 'hook' : act.actType === 'demo' ? 'demo' : 'cta',
      durationSeconds: act.durationSeconds || (idx === 0 ? 3 : idx === 1 ? 8 : 4),
      voiceoverText: act.voiceoverText,
      avatarAction: act.avatarAction,
      visualPrompt: act.visualPrompt,
      visualUrl: act.visualUrl || (
        idx === 0
          ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
          : idx === 1
          ? 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
      ),
      onScreenText: act.onScreenText,
      cameraMovement: act.cameraMovement || 'zoom_in',
      transition: act.transition || 'zoom_blur',
      bgSoundEffect: act.bgSoundEffect || 'Pop'
    }));

    onChangeProject({
      storyboard: convertedScenes,
      threeActScript: scriptData
    });

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      if (onNavigateToQuickEdit) {
        onNavigateToQuickEdit();
      }
    }, 900);
  };

  const handleCopyScript = () => {
    const fullText = `=== ${scriptData.scriptTitle} ===\nKonsep: ${scriptData.overallConcept}\n\n` +
      scriptData.acts.map(act => (
        `[${act.actTitle}]\n` +
        `⏱️ Durasi: ${act.durationSeconds}s\n` +
        `🗣️ Voiceover: "${act.voiceoverText}"\n` +
        `📱 On-Screen Text: ${act.onScreenText}\n` +
        `🎭 Avatar Cue: ${act.avatarAction}\n` +
        `🎬 Visual: ${act.visualPrompt}\n` +
        `🏷️ Kata Kunci: ${act.keywordsUsed.join(', ')}\n`
      )).join('\n------------------------\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handlePlayVoicePreview = (actNum: number, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (playingActSpeech === actNum) {
        setPlayingActSpeech(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'ms' ? 'ms-MY' : 'id-ID';
      utterance.rate = 1.1;
      utterance.onend = () => setPlayingActSpeech(null);
      utterance.onerror = () => setPlayingActSpeech(null);
      setPlayingActSpeech(actNum);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Film className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Script Engine 3.7
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Formula 3 Babak (Hook • Demo • CTA)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Script Generator Otomatis (3-Act Video Ad)
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Masukkan kata kunci produk unggulan Anda. Gemini AI akan merancang naskah video iklan terstruktur dengan{' '}
            <strong className="text-pink-400">Babak 1: Hook Detik 0-3</strong> yang menghentikan scroll,{' '}
            <strong className="text-emerald-400">Babak 2: Demo & Solusi Masalah</strong>, dan{' '}
            <strong className="text-amber-400">Babak 3: Urgensi Keranjang Kuning</strong>.
          </p>
        </div>
      </div>

      {/* Input Configuration & Keyword Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Keyword Inputs & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              Input Kata Kunci & Parameter
            </h3>
            <span className="text-xs text-indigo-400 font-mono">{keywords.length} Keyword Aktif</span>
          </div>

          {/* Product & Brand Name */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Produk</label>
              <input
                type="text"
                value={productTitle}
                onChange={e => setProductTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Contoh: GlowLuxe Barrier Serum 30ml"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Skincare / Tech / Fashion"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nama Brand</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="GlowLuxe Official"
                />
              </div>
            </div>
          </div>

          {/* Keyword Cloud & Add Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Kata Kunci Produk (USPs, Kandungan, Diskon, Masalah)
            </label>

            {/* Keyword Input field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword(keywordInput);
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Ketik kata kunci & tekan Enter..."
              />
              <button
                type="button"
                onClick={() => handleAddKeyword(keywordInput)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>

            {/* Active Keyword Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 min-h-[60px] items-center">
              {keywords.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Belum ada kata kunci ditambahkan.</span>
              ) : (
                keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium animate-fade-in"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="hover:text-red-400 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick Keyword Suggestions */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Saran Kata Kunci Cepat:</div>
              <div className="flex flex-wrap gap-1">
                {SAMPLE_KEYWORD_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddKeyword(sug)}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] border border-slate-700/60 transition flex items-center gap-1"
                  >
                    <Plus className="w-2.5 h-2.5 text-indigo-400" />
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Strategy Angle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Sudut Strategi Naskah 3 Babak</label>
            <div className="space-y-2">
              {STRATEGY_ANGLES.map(strat => {
                const Icon = strat.icon;
                const isSelected = selectedStrategy === strat.id;
                return (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategy(strat.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{strat.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{strat.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Language */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Durasi Video</label>
              <div className="flex gap-2">
                {(['15s', '30s'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                      duration === d
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Bahasa Naskah</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="id">Bahasa Indonesia (UGC)</option>
                <option value="en">English (US Ads)</option>
                <option value="ms">Bahasa Melayu</option>
              </select>
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            onClick={handleGenerateScript}
            disabled={isGenerating || keywords.length === 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Merancang Naskah 3 Babak AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-white" />
                <span>Hasilkan Naskah 3 Babak Sekarang</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: 3-Act Structured Storyboard Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info & Action Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                {scriptData.scriptTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{scriptData.overallConcept}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Naskah</span>
                  </>
                )}
              </button>

              <button
                onClick={handleApplyToStoryboard}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition transform active:scale-95"
              >
                {appliedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Diterapkan!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Terapkan ke Storyboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* The 3 Acts Display */}
          <div className="space-y-5">
            {scriptData.acts.map((act, index) => {
              const isHook = act.actType === 'hook';
              const isDemo = act.actType === 'demo';
              const isCta = act.actType === 'cta';

              return (
                <div
                  key={index}
                  className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden shadow-xl ${
                    isHook
                      ? 'bg-slate-900/90 border-pink-500/40 hover:border-pink-500/70'
                      : isDemo
                      ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70'
                      : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500/70'
                  }`}
                >
                  {/* Top Act Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md ${
                          isHook
                            ? 'bg-gradient-to-tr from-pink-600 to-rose-500'
                            : isDemo
                            ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                            : 'bg-gradient-to-tr from-amber-600 to-yellow-500'
                        }`}
                      >
                        {act.actNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{act.actTitle}</h4>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Durasi Target: {act.durationSeconds}s • Angle: {act.psychologicalAngle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayVoicePreview(act.actNumber, act.voiceoverText)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          playingActSpeech === act.actNumber
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                        title="Dengarkan Suara Voiceover AI"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tes Suara</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Left: Script Voiceover & On-Screen Banner (8 cols) */}
                    <div className="md:col-span-8 space-y-3">
                      {/* Voiceover Script Block */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          🗣️ Voiceover Narasi Audio (Kata-kata yang diucapkan):
                        </label>
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-medium text-slate-100 leading-relaxed shadow-inner">
                          "{act.voiceoverText}"
                        </div>
                      </div>

                      {/* On-Screen Text Badge */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          📱 Teks On-Screen Hook & Badge Video:
                        </label>
                        <div
                          className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-tight shadow-md flex items-center justify-between"
                          style={{
                            backgroundColor: isHook ? '#be185d' : isDemo ? '#047857' : '#b45309',
                            color: '#ffffff'
                          }}
                        >
                          <span>{act.onScreenText}</span>
                          <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded text-white font-mono">
                            Overlay
                          </span>
                        </div>
                      </div>

                      {/* Keywords Used Chips */}
                      {act.keywordsUsed && act.keywordsUsed.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-slate-500 font-bold">Kata Kunci:</span>
                          {act.keywordsUsed.map((kw, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Visual Cue & Camera Prompt (4 cols) */}
                    <div className="md:col-span-4 space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                      {/* Visual Thumbnail */}
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group">
                        <img
                          src={act.visualUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'}
                          alt="Visual cue"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[9px] font-bold text-white uppercase bg-black/60 px-1.5 py-0.5 rounded">
                            {act.cameraMovement} • {act.transition}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-semibold">Aksi Avatar:</span>
                          <p className="text-slate-200 line-clamp-2 mt-0.5">{act.avatarAction}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold">Efek Suara (SFX):</span>
                          <p className="text-amber-400 font-mono mt-0.5">🎵 {act.bgSoundEffect}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout Banner */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Siap untuk memvisualisasikan video?</h4>
                <p className="text-[11px] text-slate-300">
                  Klik "Terapkan ke Storyboard" untuk langsung memuat 3 babak ini ke dalam Live Video Canvas dan penyuntingan AI.
                </p>
              </div>
            </div>

            <button
              onClick={handleApplyToStoryboard}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 shrink-0 transition active:scale-95"
            >
              <span>Terapkan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

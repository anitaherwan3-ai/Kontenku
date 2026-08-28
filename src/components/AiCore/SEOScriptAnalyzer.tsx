import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  Flame,
  CheckCircle2,
  Plus,
  ArrowRight,
  SlidersHorizontal,
  Lightbulb,
  Hash,
  RefreshCw,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Tag,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { StoryboardScene, SEOKeywordItem, PippitProject } from '../../types';
import { TRENDING_SEO_KEYWORDS, analyzeStoryboardSEO } from '../../data/seoTrends';
import { fetchSeoKeywordsApi, optimizeScriptSeoApi } from '../../services/api';

interface SEOScriptAnalyzerProps {
  project: PippitProject;
  onChangeStoryboard: (newScenes: StoryboardScene[]) => void;
}

export const SEOScriptAnalyzer: React.FC<SEOScriptAnalyzerProps> = ({
  project,
  onChangeStoryboard,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'tiktok' | 'reels'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [isAiFetching, setIsAiFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<'keywords' | 'scoring' | 'hashtags'>('keywords');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [customKeywords, setCustomKeywords] = useState<SEOKeywordItem[]>([]);
  const [selectedKeywordsForOptimize, setSelectedKeywordsForOptimize] = useState<string[]>([]);
  const [injectedNotification, setInjectedNotification] = useState<string | null>(null);

  // Combine static presets with any AI-generated custom keywords
  const allKeywords = useMemo(() => {
    const combined = [...customKeywords, ...TRENDING_SEO_KEYWORDS];
    return combined;
  }, [customKeywords]);

  // Real-time script SEO analysis
  const seoAnalysis = useMemo(() => {
    return analyzeStoryboardSEO(project.storyboard, project.inputData.productAnalysis?.category);
  }, [project.storyboard, project.inputData.productAnalysis?.category]);

  // Filtered keywords based on search and category
  const filteredKeywords = useMemo(() => {
    return allKeywords.filter((kw) => {
      const matchPlatform = selectedPlatform === 'all' || kw.platform === 'all' || kw.platform === selectedPlatform;
      const matchCategory =
        selectedCategory === 'all' ||
        kw.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(kw.category.toLowerCase());
      const matchSearch =
        !searchQuery.trim() ||
        kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kw.sampleUsage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kw.intent.toLowerCase().includes(searchQuery.toLowerCase());

      return matchPlatform && matchCategory && matchSearch;
    });
  }, [allKeywords, selectedPlatform, selectedCategory, searchQuery]);

  // 1-Click insert keyword into specific scene
  const handleInsertKeyword = (keywordItem: SEOKeywordItem, targetPlacement: 'hook' | 'cta' | 'active_scene') => {
    const updatedScenes = [...project.storyboard];
    if (updatedScenes.length === 0) return;

    if (targetPlacement === 'hook') {
      const firstScene = updatedScenes[0];
      const newVoice = firstScene.voiceoverText.includes(keywordItem.keyword)
        ? firstScene.voiceoverText
        : `${firstScene.voiceoverText} (${keywordItem.sampleUsage})`;
      const newText = firstScene.onScreenText.includes(keywordItem.keyword)
        ? firstScene.onScreenText
        : `🔥 ${keywordItem.keyword.toUpperCase()}`;

      updatedScenes[0] = {
        ...firstScene,
        voiceoverText: newVoice,
        onScreenText: newText,
      };
    } else if (targetPlacement === 'cta') {
      const lastIndex = updatedScenes.length - 1;
      const lastScene = updatedScenes[lastIndex];
      const newVoice = lastScene.voiceoverText.includes(keywordItem.keyword)
        ? lastScene.voiceoverText
        : `${lastScene.voiceoverText} ${keywordItem.sampleUsage}`;
      const newText = `👇 ${keywordItem.keyword.toUpperCase()}`;

      updatedScenes[lastIndex] = {
        ...lastScene,
        voiceoverText: newVoice,
        onScreenText: newText,
      };
    } else {
      // Default to scene 1 or matching scene type
      const targetIdx = updatedScenes.findIndex((s) => s.sceneType === keywordItem.recommendedSceneType);
      const idxToUse = targetIdx !== -1 ? targetIdx : 0;
      const targetScene = updatedScenes[idxToUse];

      updatedScenes[idxToUse] = {
        ...targetScene,
        voiceoverText: `${targetScene.voiceoverText} ${keywordItem.sampleUsage}`,
        onScreenText: `${targetScene.onScreenText} • ${keywordItem.keyword.toUpperCase()}`,
      };
    }

    onChangeStoryboard(updatedScenes);
    setInjectedNotification(`Kata kunci "${keywordItem.keyword}" berhasil disisipkan ke Naskah!`);
    setTimeout(() => setInjectedNotification(null), 3000);
  };

  // Toggle selection for AI Batch Optimizer
  const toggleKeywordSelection = (kwId: string) => {
    setSelectedKeywordsForOptimize((prev) =>
      prev.includes(kwId) ? prev.filter((id) => id !== kwId) : [...prev, kwId]
    );
  };

  // Trigger AI SEO Script Optimization
  const handleOptimizeScriptWithSEO = async () => {
    setIsAiOptimizing(true);
    try {
      const keywordsToUse = allKeywords.filter((k) =>
        selectedKeywordsForOptimize.length > 0 ? selectedKeywordsForOptimize.includes(k.id) : true
      ).slice(0, 4);

      const optimized = await optimizeScriptSeoApi({
        scenes: project.storyboard,
        selectedKeywords: keywordsToUse,
        productTitle: project.inputData.productAnalysis?.productName || project.title,
        platform: selectedPlatform === 'all' ? 'tiktok' : selectedPlatform,
      });

      onChangeStoryboard(optimized);
      setInjectedNotification('Naskah berhasil dioptimasi dengan algoritma kata kunci viral TikTok & Reels!');
      setTimeout(() => setInjectedNotification(null), 4000);
    } catch (err) {
      console.error('Error optimizing script with SEO:', err);
    } finally {
      setIsAiOptimizing(false);
    }
  };

  // Fetch live AI SEO keywords for current product
  const handleFetchAiKeywords = async () => {
    setIsAiFetching(true);
    try {
      const generated = await fetchSeoKeywordsApi({
        productTitle: project.inputData.productAnalysis?.productName || project.title,
        category: project.inputData.productAnalysis?.category || 'E-Commerce',
        platform: selectedPlatform,
        customNiche: project.inputData.promptConcept,
      });

      setCustomKeywords((prev) => [...generated, ...prev]);
      setInjectedNotification(`${generated.length} Tren Kata Kunci Baru Berhasil Ditambahkan!`);
      setTimeout(() => setInjectedNotification(null), 3500);
    } catch (err) {
      console.error('Error fetching AI SEO keywords:', err);
    } finally {
      setIsAiFetching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case 'high_buying_intent':
        return { label: 'High Buying Intent', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'viral_hook':
        return { label: 'Viral Hook 3s', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'promo_discount':
        return { label: 'Diskon & CTA', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'unboxing_review':
        return { label: 'Review & Proof', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'problem_solution':
        return { label: 'Problem Solver', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'E-Commerce Search', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>TikTok & Reels E-Commerce SEO Engine</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                Algorithm Discovery Tool
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Rekomendasi kata kunci pencarian bervolume tinggi untuk menaikkan peringkat naskah di algoritma TikTok Shop & IG Reels.
            </p>
          </div>
        </div>

        {/* Score Pill & Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* SEO Score Meter */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">SEO Visibility</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>{seoAnalysis.overallScore}/100</span>
                <span className="text-[10px] text-slate-400">
                  ({seoAnalysis.overallScore >= 80 ? 'Viral Ready' : 'Cukup'})
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs">
              {seoAnalysis.overallScore >= 85 ? 'A+' : seoAnalysis.overallScore >= 70 ? 'B+' : 'C'}
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            title={isCollapsed ? 'Buka Panel SEO' : 'Tutup Panel SEO'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Injected Notification Alert */}
      {injectedNotification && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{injectedNotification}</span>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Top Control Bar: Platform & Categories & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPlatform === 'all'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Platform (Multi-Channel)
              </button>
              <button
                onClick={() => setSelectedPlatform('tiktok')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  selectedPlatform === 'tiktok'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎵 TikTok Trends</span>
              </button>
              <button
                onClick={() => setSelectedPlatform('reels')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  selectedPlatform === 'reels'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📸 Instagram Reels</span>
              </button>
            </div>

            {/* Quick Actions: AI Optimize Script & AI Trend Discovery */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleFetchAiKeywords}
                disabled={isAiFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAiFetching ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
                <span>{isAiFetching ? 'Menganalisis Tren...' : 'Gali Tren AI Baru'}</span>
              </button>

              <button
                onClick={handleOptimizeScriptWithSEO}
                disabled={isAiOptimizing}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiOptimizing ? 'animate-spin' : 'text-amber-300'}`} />
                <span>{isAiOptimizing ? 'Mengoptimasi Naskah...' : 'Optimasi Naskah Otomatis (AI)'}</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('keywords')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'keywords'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Daftar Kata Kunci Tren ({filteredKeywords.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('scoring')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'scoring'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Audit & Skor Naskah</span>
              </button>

              <button
                onClick={() => setActiveTab('hashtags')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'hashtags'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hashtag E-Commerce</span>
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kata kunci / intent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* TAB 1: Keywords Table & Cards */}
          {activeTab === 'keywords' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">
                  Klik <strong>"Sisipkan"</strong> untuk menambahkan kata kunci langsung ke bagian naskah tertentu:
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedKeywordsForOptimize.length} kata kunci dipilih untuk optimasi AI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredKeywords.map((item) => {
                  const intentInfo = getIntentBadge(item.intent);
                  const isMatched = seoAnalysis.matchedKeywords.some(
                    (mk) => mk.toLowerCase() === item.keyword.toLowerCase()
                  );
                  const isSelected = selectedKeywordsForOptimize.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isMatched
                          ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                          : isSelected
                          ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-100'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Card Header */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 capitalize flex items-center gap-1.5">
                              <span>{item.keyword}</span>
                              {isMatched && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Terpasang
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${intentInfo.color}`}>
                              {intentInfo.label}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-2">
                          "{item.sampleUsage}"
                        </p>
                      </div>

                      {/* Card Metrics & Quick Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Flame className="w-3 h-3 text-rose-500" />
                            {item.searchVolume}
                          </span>
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                            +{item.growthPercent}% 🔥
                          </span>
                          <span className="text-indigo-600 font-semibold text-[10px]">
                            {item.ctrLift}
                          </span>
                        </div>

                        {/* Insert Menu */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleKeywordSelection(item.id)}
                            className={`p-1 rounded text-[10px] font-semibold transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Pilih untuk Optimasi AI Batch"
                          >
                            {isSelected ? '✓ Terpilih' : '+ Pilih'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInsertKeyword(item, 'hook')}
                            className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 text-[10px] font-bold rounded-lg transition"
                            title="Sisipkan ke Scene 1 (Hook)"
                          >
                            + Hook
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInsertKeyword(item, 'cta')}
                            className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-700 text-[10px] font-bold rounded-lg transition"
                            title="Sisipkan ke Scene Akhir (CTA)"
                          >
                            + CTA
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SEO Script Scoring & Recommendations */}
          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kekuatan Hook 3 Detik</span>
                  <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{seoAnalysis.hookSEOStrength === 'viral_optimized' ? '⚡ Sangat Kuat (Viral Grade)' : seoAnalysis.hookSEOStrength === 'good' ? '✨ Cukup Menarik' : '⚠️ Perlu Keyword Hook'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {seoAnalysis.hookSEOStrength === 'viral_optimized' ? 'Hook langsung memicu rasa ingin tahu dan kata kunci terindeks di detik 1-3.' : 'Tambahkan kata pemicu seperti "Review jujur" atau "Racun viral".'}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kata Kunci Terdeteksi</span>
                  <div className="text-base font-extrabold text-indigo-600 flex items-center gap-2">
                    <span>{seoAnalysis.matchedKeywords.length} Keyword Aktif</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kata kunci terdeteksi di dalam rekaman voiceover & takarir on-screen teks.
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Algoritma Search Readiness</span>
                  <div className="text-base font-extrabold text-emerald-600 flex items-center gap-2">
                    <span>{seoAnalysis.overallScore >= 80 ? '98% Siap FYP & Rank #1' : 'Perlu Tambahan Keyword'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kesiapan video untuk muncul di pencarian teratas TikTok & Instagram Reels.
                  </p>
                </div>
              </div>

              {/* Actionable Recommendations List */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Rekomendasi Optimasi Algoritma Video:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-indigo-950/80 list-disc list-inside">
                  {seoAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Matched Keywords Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Kata Kunci yang Sudah Terpasang di Storyboard:</span>
                <div className="flex flex-wrap gap-2">
                  {seoAnalysis.matchedKeywords.length > 0 ? (
                    seoAnalysis.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{kw}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum ada kata kunci tren yang terpasang di storyboard.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Suggested E-Commerce Hashtags */}
          {activeTab === 'hashtags' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Gunakan kumpulan hashtag terverifikasi ini saat memposting ke TikTok atau Instagram Reels untuk memperluas jangkauan organik:
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-2">
                {seoAnalysis.suggestedHashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigator.clipboard.writeText(tag);
                      setInjectedNotification(`Hashtag ${tag} berhasil disalin!`);
                      setTimeout(() => setInjectedNotification(null), 2500);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
                    title="Klik untuk menyalin"
                  >
                    <Hash className="w-3 h-3 text-indigo-500" />
                    <span>{tag.replace('#', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

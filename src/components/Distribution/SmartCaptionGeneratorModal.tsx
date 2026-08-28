import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Check,
  Copy,
  TrendingUp,
  Hash,
  Flame,
  ShoppingBag,
  Send,
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  Plus,
  Tag,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PippitProject, AdPlatform, SmartCaptionSuggestion, SmartHashtagGroup } from '../../types';
import { generateSmartCaptionsApi } from '../../services/api';

interface SmartCaptionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PippitProject;
  currentPlatform: AdPlatform;
  onApplyCaption: (caption: string) => void;
}

export const SmartCaptionGeneratorModal: React.FC<SmartCaptionGeneratorModalProps> = ({
  isOpen,
  onClose,
  project,
  currentPlatform,
  onApplyCaption,
}) => {
  const [activePlatform, setActivePlatform] = useState<AdPlatform>(currentPlatform);
  const [isLoading, setIsLoading] = useState(false);
  const [customFocus, setCustomFocus] = useState('');
  const [activeTab, setActiveTab] = useState<'captions' | 'hashtags'>('captions');
  const [selectedAngleId, setSelectedAngleId] = useState<string>('cap-hard-sell');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState(false);

  const [suggestions, setSuggestions] = useState<SmartCaptionSuggestion[]>([]);
  const [hashtagGroups, setHashtagGroups] = useState<SmartHashtagGroup[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  // Fetch initial captions when opened
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      handleGenerate();
    }
  }, [isOpen, activePlatform]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateSmartCaptionsApi({
        productAnalysis: project.inputData.productAnalysis,
        storyboard: project.storyboard,
        platform: activePlatform,
        customFocus: customFocus.trim() || undefined,
      });

      if (res?.suggestions) {
        setSuggestions(res.suggestions);
        if (res.suggestions[0]) {
          setSelectedAngleId(res.suggestions[0].id);
        }
      }
      if (res?.hashtagGroups) {
        setHashtagGroups(res.hashtagGroups);
        // Pre-select top tags from groups
        const allTags: string[] = [];
        res.hashtagGroups.forEach((g) => {
          g.tags.slice(0, 2).forEach((t) => allTags.push(t.tag));
        });
        setSelectedHashtags(allTags);
      }
    } catch (err) {
      console.error('Error generating smart captions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleApplyToPost = (captionText: string) => {
    onApplyCaption(captionText);
    setAppliedToast(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => {
      setAppliedToast(false);
      onClose();
    }, 600);
  };

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const currentSuggestion = suggestions.find((s) => s.id === selectedAngleId) || suggestions[0];

  const productName = project.inputData.productAnalysis?.productName || 'Produk Unggulan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Smart Hashtag & Caption AI Generator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Gemini 3.7 Pro Copy Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Membuat variasi caption berkonversi tinggi & riset tagar viral berdasarkan naskah storyboard & USP produk.
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

        {/* Platform & Focus Filter Bar */}
        <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Platform Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300/80 shrink-0">
            {(['tiktok', 'instagram', 'facebook'] as AdPlatform[]).map((plt) => (
              <button
                key={plt}
                onClick={() => {
                  setActivePlatform(plt);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activePlatform === plt
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{plt === 'tiktok' ? '🎵' : plt === 'instagram' ? '📸' : '👥'}</span>
                <span className="capitalize">{plt}</span>
              </button>
            ))}
          </div>

          {/* Custom Focus / Prompt input & Re-generate */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="Fokus tambahan (cth: Tekankan Garansi & Flash Sale 50%)..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menulis...' : 'Generate'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Navigation (Captions Angles vs Hashtag Explorer) */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('captions')}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'captions'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5 Variasi Angle Copywriting AI</span>
          </button>

          <button
            onClick={() => setActiveTab('hashtags')}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'hashtags'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Katalog Riset Tagar Viral ({hashtagGroups.length} Kategori)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Gemini AI Sedang Menganalisis Naskah & Meriset Tagar Viral...
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Menyinkronkan hook dari scene pertama storyboard dengan pola pencarian di platform {activePlatform.toUpperCase()}.
              </p>
            </div>
          ) : activeTab === 'captions' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Copy Angles Selector (5 cols) */}
              <div className="lg:col-span-5 space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Gaya Copywriting (Angles)
                </label>

                <div className="space-y-2">
                  {suggestions.map((sug) => {
                    const isSelected = selectedAngleId === sug.id;
                    return (
                      <div
                        key={sug.id}
                        onClick={() => setSelectedAngleId(sug.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition select-none flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-1 ring-indigo-500/30'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {sug.angleLabel}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {sug.estimatedEngagementLift}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {sug.hookLine}
                        </p>
                        <div className="text-[10px] text-indigo-600 font-medium pt-0.5">
                          🎯 Vibe: {sug.targetVibe}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Full Caption Preview & Breakdown (7 cols) */}
              {currentSuggestion && (
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {currentSuggestion.angleLabel}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          Diproyeksikan meningkatkan: <b className="text-emerald-700">{currentSuggestion.estimatedEngagementLift}</b>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            handleCopyText(currentSuggestion.fullCaption, currentSuggestion.id)
                          }
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
                        >
                          {copiedId === currentSuggestion.id ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Breakdown Pillars */}
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>Hook Line (Detik 1-3)</span>
                        </div>
                        <p className="font-semibold text-slate-900">{currentSuggestion.hookLine}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                          <span>📝</span>
                          <span>Body Copy / Value Proposition</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{currentSuggestion.bodyText}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          <span>Call to Action (CTA) & Keranjang Belanja</span>
                        </div>
                        <p className="font-semibold text-slate-900">{currentSuggestion.callToAction}</p>
                      </div>
                    </div>

                    {/* Tagar List */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Tagar Terpilih:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {currentSuggestion.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-900 text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Full Preview Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Teks Lengkap Siap Posting:
                      </label>
                      <div className="p-3.5 bg-white border border-slate-300 rounded-2xl text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans max-h-40 overflow-y-auto">
                        {currentSuggestion.fullCaption}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => handleApplyToPost(currentSuggestion.fullCaption)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {appliedToast ? 'Berhasil Diterapkan!' : 'Terapkan ke Postingan Ini'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* HASHTAG EXPLORER TAB */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    #
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Riset Tagar AI untuk "{productName}"
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Pilih tagar yang ingin dimasukkan ke dalam caption. Algoritma akan mendistribusikan ke FYP yang relevan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const tagsText = selectedHashtags.join(' ');
                      handleCopyText(tagsText, 'all-tags');
                    }}
                    className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copiedId === 'all-tags' ? 'Tersalin!' : `Salin ${selectedHashtags.length} Tagar`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hashtag Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hashtagGroups.map((group) => (
                  <div
                    key={group.category}
                    className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{group.category}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {group.tags.length} Tagar
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.tags.map((item) => {
                        const isSelected = selectedHashtags.includes(item.tag);
                        return (
                          <div
                            key={item.tag}
                            onClick={() => toggleHashtag(item.tag)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition select-none flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{item.tag}</div>
                              <div
                                className={`text-[9px] ${
                                  isSelected ? 'text-indigo-200' : 'text-slate-500'
                                }`}
                              >
                                {item.searchVolume} vol • {item.intent}
                              </div>
                            </div>

                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 border ${
                                isSelected
                                  ? 'bg-white text-indigo-600 border-white font-bold'
                                  : 'border-slate-300 bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Hashtags Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Tagar Terpilih ({selectedHashtags.length})</span>
                  <button
                    onClick={() => setSelectedHashtags([])}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Kosongkan Semua
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => toggleHashtag(tag)}
                        className="hover:text-red-200 transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {activeTab === 'captions'
              ? '✨ 5 angle dibuat siap untuk dipublikasikan'
              : `🏷️ ${selectedHashtags.length} tagar dipilih`}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>
            {activeTab === 'hashtags' && selectedHashtags.length > 0 && (
              <button
                onClick={() => {
                  const appendText = `\n\n${selectedHashtags.join(' ')}`;
                  onApplyCaption(
                    (project.scheduledPosts[0]?.caption || '') + appendText
                  );
                  onClose();
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Tambahkan Tagar ke Caption
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

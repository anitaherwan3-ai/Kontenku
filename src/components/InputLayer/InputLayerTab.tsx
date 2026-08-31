import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  Zap,
  Flame,
  HelpCircle,
  Scissors,
  Layers,
  FolderKanban,
  Bookmark,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Activity,
  Globe,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InputLayerData, AspectRatio, AdDuration, ProductAnalysis, UploadedAsset, PromptTemplate } from '../../types';
import { DEMO_PRESET_PRODUCTS } from '../../data/samplePresets';
import { EXPERT_PROMPT_TEMPLATES } from '../../data/promptTemplates';
import { analyzeProductApi } from '../../services/api';

interface InputLayerTabProps {
  inputData: InputLayerData;
  onChangeInputData: (newData: Partial<InputLayerData>) => void;
  onProceedToAiCore: () => void;
  onProceedToMediaAssets?: () => void;
}

export const InputLayerTab: React.FC<InputLayerTabProps> = ({
  inputData,
  onChangeInputData,
  onProceedToAiCore,
  onProceedToMediaAssets,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState(inputData.productUrl || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Enhanced retry logic & error feedback state
  const [retryCount, setRetryCount] = useState<number>(0);
  const [fetchProgressPercent, setFetchProgressPercent] = useState<number>(0);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<{
    title: string;
    message: string;
    reasonType: 'network_or_antibot' | 'format_url' | 'server_timeout';
    suggestedAction: string;
  } | null>(null);

  // Handle Prompt Template Selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = EXPERT_PROMPT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    onChangeInputData({
      promptConcept: template.promptText,
      adGoal: template.recommendedGoal,
      selectedTone: template.recommendedTone,
      duration: template.recommendedDuration,
    });
  };

  const handleResetPrompt = () => {
    setSelectedTemplateId('');
    onChangeInputData({
      promptConcept: '',
    });
  };

  // Group templates by category
  const categories = Array.from(new Set(EXPERT_PROMPT_TEMPLATES.map((t) => t.category)));
  const activeTemplate = EXPERT_PROMPT_TEMPLATES.find((t) => t.id === selectedTemplateId);

  // Analyze URL handler with robust retry logic & simulated step progress
  const handleAnalyzeUrl = async (customUrl?: string, isRetry: boolean = false) => {
    const targetUrl = customUrl || urlInput;
    if (!targetUrl.trim()) return;

    if (isRetry) {
      setRetryCount((prev) => prev + 1);
    } else {
      setRetryCount(0);
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setErrorFeedback(null);
    setFetchProgressPercent(20);
    setAnalysisStep('1. Menghubungkan ke URL & mengekstrak OpenGraph metadata...');

    const timer1 = setTimeout(() => {
      setFetchProgressPercent(50);
      setAnalysisStep('2. AI Gemini 2.5 Flash membedah formula, USPs, & audiens target...');
    }, 650);

    const timer2 = setTimeout(() => {
      setFetchProgressPercent(85);
      setAnalysisStep('3. Merancang strategi hook viral & 3-Act video structure...');
    }, 1350);

    try {
      // Check if it matches a demo preset for instant rich assets
      const foundPreset = DEMO_PRESET_PRODUCTS.find((p) => p.url === targetUrl);
      if (foundPreset) {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setFetchProgressPercent(100);
        
        onChangeInputData({
          productUrl: targetUrl,
          productAnalysis: foundPreset.analysis,
          uploadedAssets: [
            {
              id: `asset-${Date.now()}-1`,
              name: `${foundPreset.name.slice(0, 20)}.jpg`,
              type: 'image',
              url: foundPreset.image,
              size: '1.8 MB',
              processed: true,
            },
          ],
        });

        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        setIsAnalyzing(false);
        setAnalysisStep('');
        return;
      }

      // Otherwise call server Gemini analysis with fallback support
      const analysis = await analyzeProductApi({
        url: targetUrl,
        promptConcept: inputData.promptConcept,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setFetchProgressPercent(100);

      onChangeInputData({
        productUrl: targetUrl,
        productAnalysis: analysis,
      });

      confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 } });
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error('URL Analysis error:', err);

      const currentAttempt = isRetry ? retryCount + 1 : 1;
      setErrorFeedback({
        title: 'Tautan Produk Memerlukan Verifikasi AI Tambahan',
        message:
          'URL e-commerce mungkin dilindungi proteksi bot/WAF atau format tautan singkat. Sistem AI cerdas kami dapat mencoba kembali dengan metode parsing semantik alternatif.',
        reasonType: 'network_or_antibot',
        suggestedAction:
          currentAttempt < 3
            ? `Klik 'Coba Lagi dengan AI Semantic Scanner' (Percobaan ${currentAttempt}/3) atau pilih salah satu preset produk siap pakai di bawah.`
            : 'Batas percobaan tercapai. Anda dapat memasukkan konsep produk secara manual atau memilih preset demo.',
      });
      setErrorMessage('Terjadi kendala saat membaca link langsung. Gunakan tombol coba lagi di bawah.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Mock File Uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: UploadedAsset['type']) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const newAssets: UploadedAsset[] = fileList.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      processed: true,
    }));

    onChangeInputData({
      uploadedAssets: [...inputData.uploadedAssets, ...newAssets],
    });
  };

  const handleRemoveAsset = (id: string) => {
    onChangeInputData({
      uploadedAssets: inputData.uploadedAssets.filter((a) => a.id !== id),
    });
  };

  const handleAddSampleImage = (url: string, name: string) => {
    const newAsset: UploadedAsset = {
      id: `sample-${Date.now()}`,
      name,
      type: 'image',
      url,
      size: '1.2 MB',
      processed: true,
    };
    onChangeInputData({
      uploadedAssets: [...inputData.uploadedAssets, newAsset],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-200">
            <Layers className="w-3.5 h-3.5" />
            Layer 1: Input Layer & Data Ingestion
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sumber Data & Analisis Aset Mentah
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Masukkan tautan e-commerce produk, unggah aset visual, atau ketik konsep naskah iklan. KontenKU akan membedah spesifikasi dan menyusun strategi ad creative otomatis.
          </p>
        </div>

        <button
          id="btn-proceed-to-aicore"
          onClick={onProceedToAiCore}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 shrink-0"
        >
          <span>Lanjut ke 2. AI Core Generator</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: 3 Main Input Doors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Link-to-Video & Multimodal Uploads (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Link-to-Video (Tautan Produk) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">1. Link-to-Video (Tautan Produk)</h2>
                  <p className="text-xs text-slate-500">Tempelkan tautan Shopee, TikTok Shop, Tokopedia, atau Landing Page</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                Auto-Dissect AI
              </span>
            </div>

            <div className={`p-1 rounded-2xl transition ${
              isAnalyzing ? 'ring-2 ring-indigo-500/50 bg-indigo-50/30' : ''
            }`}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="input-product-url"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://shopee.co.id/brand/product-name..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  id="btn-analyze-url"
                  onClick={() => handleAnalyzeUrl()}
                  disabled={isAnalyzing || !urlInput}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition shrink-0 active:scale-95"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Membedah ({fetchProgressPercent}%)...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Bedah Produk</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual Indicator: AI Fetching & Dissecting Data */}
            {isAnalyzing && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 rounded-2xl space-y-3 shadow-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                    </span>
                    <span className="text-xs font-bold text-indigo-950">
                      AI Gemini 2.5 Flash sedang membedah data produk...
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-md border border-indigo-200">
                    {fetchProgressPercent}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${fetchProgressPercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-indigo-800 font-medium">
                  <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse shrink-0" />
                  <span className="truncate">{analysisStep || 'Menguraikan kandungan, formula, USP, dan persona target...'}</span>
                </div>
              </div>
            )}

            {/* Enhanced Error Feedback & Retry Mechanism */}
            {errorFeedback && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 shadow-xs animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-amber-950">
                      {errorFeedback.title}
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {errorFeedback.message}
                    </p>
                    <p className="text-[11px] text-amber-700 font-semibold pt-0.5">
                      💡 Solusi: {errorFeedback.suggestedAction}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleAnalyzeUrl(urlInput, true)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Coba Lagi (Percobaan {retryCount + 1}/3)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const preset = DEMO_PRESET_PRODUCTS[0];
                      setUrlInput(preset.url);
                      handleAnalyzeUrl(preset.url);
                    }}
                    className="px-3 py-2 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl shadow-2xs transition"
                  >
                    ⚡ Gunakan Preset Demo GlowLuxe
                  </button>

                  <button
                    type="button"
                    onClick={() => setErrorFeedback(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 ml-auto"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {/* Quick Preset Selector Chips */}
            <div>
              <div className="text-xs text-slate-500 font-medium mb-2 flex items-center justify-between">
                <span>Atau coba produk demo siap pakai:</span>
                <span className="text-[11px] text-slate-400">1-Klik Langsung Isi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_PRESET_PRODUCTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setUrlInput(preset.url);
                      handleAnalyzeUrl(preset.url);
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between gap-1.5 ${
                      inputData.productUrl === preset.url
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-medium'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{preset.category}</span>
                      <span className="text-indigo-600 font-bold">Pilih</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dissected Intelligence Result Card */}
            {inputData.productAnalysis && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Hasil Analisis Produk Otomatis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingAnalysis(!isEditingAnalysis)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                    >
                      {isEditingAnalysis ? 'Simpan' : 'Edit Detail'}
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      Akurasi {inputData.productAnalysis.confidenceScore}%
                    </span>
                  </div>
                </div>

                {isEditingAnalysis ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Nama Produk</label>
                      <input
                        type="text"
                        value={inputData.productAnalysis.productName}
                        onChange={(e) => {
                          if (!inputData.productAnalysis) return;
                          onChangeInputData({
                            productAnalysis: {
                              ...inputData.productAnalysis,
                              productName: e.target.value,
                            },
                          });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Brand</label>
                        <input
                          type="text"
                          value={inputData.productAnalysis.brandName}
                          onChange={(e) => {
                            if (!inputData.productAnalysis) return;
                            onChangeInputData({
                              productAnalysis: {
                                ...inputData.productAnalysis,
                                brandName: e.target.value,
                              },
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Harga & Promo</label>
                        <input
                          type="text"
                          value={inputData.productAnalysis.pricePoint}
                          onChange={(e) => {
                            if (!inputData.productAnalysis) return;
                            onChangeInputData({
                              productAnalysis: {
                                ...inputData.productAnalysis,
                                pricePoint: e.target.value,
                              },
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Viral Hook (0-3 Detik)</label>
                      <input
                        type="text"
                        value={inputData.productAnalysis.recommendedHook}
                        onChange={(e) => {
                          if (!inputData.productAnalysis) return;
                          onChangeInputData({
                            productAnalysis: {
                              ...inputData.productAnalysis,
                              recommendedHook: e.target.value,
                            },
                          });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Nama Produk</span>
                        <span className="text-slate-900 font-semibold">{inputData.productAnalysis.productName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Harga & Promo</span>
                        <span className="text-indigo-600 font-bold">{inputData.productAnalysis.pricePoint}</span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Unique Selling Points (USP)</span>
                      <ul className="space-y-1">
                        {inputData.productAnalysis.uniqueSellingPoints.map((usp, i) => (
                          <li key={i} className="text-slate-700 flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span>
                            <span>{usp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                      <span className="text-amber-800 font-bold block text-[10px] uppercase">Rekomendasi Viral Hook (0-3 Detik Pertama)</span>
                      <p className="text-amber-900 italic mt-0.5">{inputData.productAnalysis.recommendedHook}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Helper Guidance Note */}
            <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Panduan Input Link:</span> Mendukung tautan Tokopedia, Shopee, TikTok Shop, Lazada, dan Landing Page. Jika link marketplace menggunakan format aplikasi pendek atau diproteksi bot, sistem AI tetap mengekstrak nama produk & kata kunci slug secara cerdas atau Anda bisa memilih contoh preset demo.
              </div>
            </div>
          </div>

          {/* Section 2: Multimodal Upload (Gambar, B-roll, Logo, SOP/PDF) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">2. Multimodal Upload</h2>
                  <p className="text-xs text-slate-500">Unggah foto produk, video B-roll, logo merek, atau dokumen panduan/SOP</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {inputData.uploadedAssets.length} Aset Terunggah
              </span>
            </div>

            {/* Dropzones Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Image Upload */}
              <label className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer transition text-center group">
                <ImageIcon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Foto Produk</span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="hidden"
                />
              </label>

              {/* Video B-roll Upload */}
              <label className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer transition text-center group">
                <Video className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-800 mt-1.5">B-roll Video</span>
                <span className="text-[10px] text-slate-400">MP4, MOV</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video')}
                  className="hidden"
                />
              </label>

              {/* Logo Upload */}
              <label className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer transition text-center group">
                <ShieldCheck className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Logo Brand</span>
                <span className="text-[10px] text-slate-400">PNG Transparan</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="hidden"
                />
              </label>

              {/* SOP / PDF Upload */}
              <label className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-indigo-50/50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer transition text-center group">
                <FileText className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Dokumen SOP</span>
                <span className="text-[10px] text-slate-400">PDF / Brand Kit</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'sop_document')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Asset List Preview */}
            {inputData.uploadedAssets.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Daftar Aset Aktif
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {inputData.uploadedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {asset.type === 'image' || asset.type === 'logo' ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-9 h-9 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            {asset.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 truncate">{asset.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span className="capitalize">{asset.type.replace('_', ' ')}</span>
                            {asset.size && <span>• {asset.size}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Prompt Text & Creative Brief Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Prompt Text & Konsep Iklan</h2>
                  <p className="text-xs text-slate-500">Pilih template teruji atau ketik konsep naskah bebas</p>
                </div>
              </div>
            </div>

            {/* EXPERT PROMPT TEMPLATE DROPDOWN SELECTOR */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-200/80 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label htmlFor="select-prompt-template" className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Prompt Template Standar Pakar (Berdasarkan Kategori)</span>
                </label>
                {selectedTemplateId && (
                  <button
                    onClick={handleResetPrompt}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    title="Hapus template dan tulis bebas"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <select
                id="select-prompt-template"
                value={selectedTemplateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="w-full bg-white border border-indigo-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="">
                  ✨ -- Pilih Template Pemasaran Siap Pakai --
                </option>
                {categories.map((cat) => (
                  <optgroup key={cat} label={`📦 Kategori: ${cat}`}>
                    {EXPERT_PROMPT_TEMPLATES.filter((t) => t.category === cat).map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.icon} {tpl.title} [{tpl.badge}]
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Active Template Insight Chip */}
              {activeTemplate && (
                <div className="pt-1 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-indigo-900">
                      Target Hook 3 Detik Pertama:
                    </span>
                    <span className="font-bold px-2 py-0.5 bg-indigo-100/90 text-indigo-800 rounded-md">
                      {activeTemplate.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-950 font-medium italic bg-white/80 p-2 rounded-lg border border-indigo-100">
                    {activeTemplate.hookHeadline}
                  </p>
                </div>
              )}
            </div>

            {/* Natural Prompt Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Perintah Alami / Creative Brief
                </label>
                <span className="text-[10px] text-slate-400">
                  Dapat diedit & disesuaikan
                </span>
              </div>
              <textarea
                id="input-prompt-concept"
                rows={4}
                value={inputData.promptConcept}
                onChange={(e) => onChangeInputData({ promptConcept: e.target.value })}
                placeholder="Contoh: Buatkan video iklan UGC 15 detik untuk TikTok dengan gaya review jujur yang membandingkan facial jutaan vs serum 80rb..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none leading-relaxed"
              />
            </div>

            {/* Ad Goal Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Tujuan Iklan (Objective)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'conversion', label: 'Direct Conversion', desc: 'Fokus penjualan & keranjang kuning' },
                  { id: 'viral_ugc', label: 'Viral UGC Reach', desc: 'Hook kuat & retensi tinggi FYP' },
                  { id: 'brand_awareness', label: 'Brand Aesthetic', desc: 'Visual sinematik & prestise' },
                  { id: 'traffic', label: 'Website Traffic', desc: 'Ajakan klik link di bio' },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => onChangeInputData({ adGoal: goal.id as any })}
                    className={`p-2.5 text-left rounded-xl border text-xs transition ${
                      inputData.adGoal === goal.id
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                        : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{goal.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{goal.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Rasio Layar
                </label>
                <select
                  value={inputData.aspectRatio}
                  onChange={(e) => onChangeInputData({ aspectRatio: e.target.value as AspectRatio })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="9:16">9:16 (TikTok, Reels, Shorts)</option>
                  <option value="16:9">16:9 (Landscape YouTube)</option>
                  <option value="1:1">1:1 (Square Feed IG/FB)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Target Durasi
                </label>
                <select
                  value={inputData.duration}
                  onChange={(e) => onChangeInputData({ duration: e.target.value as AdDuration })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="15s">15 Detik (Ideal UGC TikTok)</option>
                  <option value="30s">30 Detik (Storytelling Lengkap)</option>
                  <option value="60s">60 Detik (Deep Review)</option>
                </select>
              </div>
            </div>

            {/* Language & Dialect */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Bahasa & Dialek
                </label>
                <select
                  value={inputData.targetLanguage}
                  onChange={(e) => onChangeInputData({ targetLanguage: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="id">Indonesia (Jakarta UGC Casual)</option>
                  <option value="id-jv">Indonesia (Aksen Jawa/Surabaya)</option>
                  <option value="id-su">Indonesia (Aksen Sunda Ramah)</option>
                  <option value="en">English (US Global Neutral)</option>
                  <option value="ms">Bahasa Melayu</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={inputData.selectedTone}
                  onChange={(e) => onChangeInputData({ selectedTone: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="excited_ugc">Excited UGC Review</option>
                  <option value="problem_solution">Problem & Solution</option>
                  <option value="humorous_skit">Humorous Skit / Lucu</option>
                  <option value="luxury_review">Luxury & Aesthetic</option>
                </select>
              </div>
            </div>

            {/* Navigation Buttons Row */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onProceedToAiCore}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Mulai Proses AI Core (Script, Visual & Avatar)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {onProceedToMediaAssets && (
                <button
                  onClick={onProceedToMediaAssets}
                  className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Kelola & Tag Aset di Tab Media Assets</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

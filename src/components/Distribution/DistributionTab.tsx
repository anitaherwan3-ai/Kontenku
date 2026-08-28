import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import confetti from 'canvas-confetti';
import { PippitProject, AdPlatform, ScheduledPost } from '../../types';
import { generateSocialCopyApi, fetchAiStrategyInsightsApi } from '../../services/api';

interface DistributionTabProps {
  project: PippitProject;
  onChangeProject: (newProject: Partial<PippitProject>) => void;
  onOpenExportModal: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  project,
  onChangeProject,
  onOpenExportModal,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('tiktok');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  const [customCaption, setCustomCaption] = useState(
    project.scheduledPosts.find((p) => p.platform === selectedPlatform)?.caption ||
      'Beneran gak nyangka hasilnya sebagus ini! Checkout sekarang mumpung diskon 45%! #RacunTikTok #FYP'
  );
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Generate AI Copy for the selected platform
  const handleGeneratePlatformCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const result = await generateSocialCopyApi({
        productName: project.inputData.productAnalysis?.productName || 'Produk Unggulan',
        usps: project.inputData.productAnalysis?.uniqueSellingPoints || [],
        promo: project.inputData.productAnalysis?.pricePoint || 'Diskon 45%',
        platform: selectedPlatform,
      });

      setCustomCaption(`${result.caption}\n\n${result.hashtags.join(' ')}`);
    } catch (err) {
      console.error('Error generating copy:', err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // Instant Publish simulation
  const handlePublishNow = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    const updatedPosts = project.scheduledPosts.map((p) =>
      p.platform === selectedPlatform
        ? { ...p, status: 'published' as const, caption: customCaption }
        : p
    );

    onChangeProject({ scheduledPosts: updatedPosts });
    setPublishSuccessMsg(`Video berhasil dipublikasikan secara langsung ke ${selectedPlatform.toUpperCase()}!`);
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  // Schedule Post handler
  const handleSchedulePost = () => {
    const updatedPosts = project.scheduledPosts.map((p) =>
      p.platform === selectedPlatform
        ? { ...p, status: 'scheduled' as const, caption: customCaption }
        : p
    );

    onChangeProject({ scheduledPosts: updatedPosts });
    setPublishSuccessMsg(`Jadwal postingan ke ${selectedPlatform.toUpperCase()} berhasil disimpan!`);
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  // Refresh AI Insights
  const handleRefreshInsights = async () => {
    setIsRefreshingInsights(true);
    try {
      const recs = await fetchAiStrategyInsightsApi({
        analytics: project.analytics,
        productTitle: project.inputData.productAnalysis?.productName || 'Product',
      });
      onChangeProject({
        analytics: {
          ...project.analytics,
          recommendations: recs,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  const currentPlatformPost = project.scheduledPosts.find((p) => p.platform === selectedPlatform);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-200">
            <Share2 className="w-3.5 h-3.5" />
            Layer 4: Output & Distribution Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Penerbitan Multi-Kanal & Dasbor Analitik
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Jadwalkan dan publikasikan video langsung ke TikTok, Instagram Reels, dan Facebook tanpa keluar dari platform, serta pantau metrik retensi dan rekomendasi AI.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 shrink-0"
        >
          <span>Export Master MP4 & Data</span>
        </button>
      </div>

      {publishSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {/* SECTION 1: Social Publisher & Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Platform Connector & Copy Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                <span>Penerbitan & Penjadwalan Otomatis</span>
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                API Live Connected
              </span>
            </div>

            {/* Platform Selector Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'tiktok', name: 'TikTok Shop / FYP', icon: '🎵', peak: '19:30 WIB' },
                { id: 'instagram', name: 'Instagram Reels', icon: '📸', peak: '20:15 WIB' },
                { id: 'facebook', name: 'Facebook Ads', icon: '👥', peak: '11:00 WIB' },
              ].map((p) => {
                const isSelected = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlatform(p.id as any);
                      const existing = project.scheduledPosts.find((post) => post.platform === p.id);
                      if (existing) setCustomCaption(existing.caption);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-[10px] text-slate-500">Peak: {p.peak}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">{p.name}</div>
                  </button>
                );
              })}
            </div>

            {/* AI Caption & Hashtags Generator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Teks Keterangan (Caption) & Tagar Viral {selectedPlatform.toUpperCase()}
                </label>
                <button
                  onClick={handleGeneratePlatformCopy}
                  disabled={isGeneratingCopy}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingCopy ? 'Membuat Copy...' : 'Buat Copy AI'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none leading-relaxed"
              />
            </div>

            {/* Posting Schedule Time Setting */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jadwal Penayangan Otomatis</span>
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  Rekomendasi Terbaik: Hari Ini, 19:30 WIB
                </span>
              </div>
              <input
                type="text"
                defaultValue={currentPlatformPost?.scheduledTime || '2026-08-28 19:30 WIB'}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Publishing Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                id="btn-schedule-post"
                onClick={handleSchedulePost}
                className="py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Simpan ke Jadwal Post</span>
              </button>

              <button
                id="btn-publish-now"
                onClick={handlePublishNow}
                className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Publikasikan Sekarang</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right: Live Post Mobile Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>Simulasi Tampilan Feed {selectedPlatform.toUpperCase()}</span>
            </h3>

            {/* Phone Container Preview */}
            <div className="aspect-[9/16] max-h-[460px] mx-auto rounded-3xl bg-slate-950 border-4 border-slate-300 overflow-hidden relative shadow-xl flex flex-col justify-between p-3.5">
              {/* Video Image Background */}
              <img
                src={project.storyboard[0]?.visualUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'}
                alt="Feed Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

              {/* Top Feed Bar */}
              <div className="relative z-10 flex items-center justify-between text-white text-[11px] font-bold">
                <span>LIVE</span>
                <div className="flex gap-3 text-xs">
                  <span className="opacity-60">Following</span>
                  <span className="border-b-2 border-white pb-0.5">For You</span>
                </div>
                <span>🔍</span>
              </div>

              {/* Right Side Engagement Icons */}
              <div className="relative z-10 self-end flex flex-col items-center gap-3 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/40 flex items-center justify-center text-sm">
                    ❤️
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">42.1K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/40 flex items-center justify-center text-sm">
                    💬
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">1.8K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/40 flex items-center justify-center text-sm">
                    ↗️
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">4.2K</span>
                </div>
              </div>

              {/* Bottom Post Metadata */}
              <div className="relative z-10 space-y-1.5 text-white">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">@kontenku_creator</span>
                  <span className="text-[9px] bg-indigo-600 px-1 rounded font-bold">Verified</span>
                </div>
                <p className="text-[11px] line-clamp-2 text-slate-200 leading-snug">
                  {customCaption}
                </p>

                {/* TikTok Yellow Cart Banner */}
                <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-bold text-[10px] flex items-center justify-between">
                  <span>🛍️ Beli di Keranjang Kuning Diskon 45%</span>
                  <span className="bg-slate-950 text-white px-1.5 py-0.5 rounded text-[9px]">Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: Analytics Insights & Performance Curves */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Dasbor Analitis (Analytics Insights)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Metrik performa konten, retensi penonton 0-15 detik, dan strategi berbasis data AI.
            </p>
          </div>

          <button
            onClick={handleRefreshInsights}
            disabled={isRefreshingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 rounded-xl transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingInsights ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Segarkan Analitik AI</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Tayangan (Views)</span>
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {project.analytics.overall.views.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              +28.4% vs Minggu Lalu
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Click-Through Rate (CTR)</span>
              <MousePointerClick className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {project.analytics.overall.ctr}%
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              Top 5% Kategori Skincare
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Pesanan (Conversions)</span>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {project.analytics.overall.conversions.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              Conversion Rate: 6.26%
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Estimated ROAS</span>
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {project.analytics.overall.estimatedRoas}x
            </div>
            <div className="text-[10px] text-slate-500">
              Biaya Iklan Rp 420 / Klik
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Chart: 0-15s Watch Retention Curve (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Kurva Retensi Penonton (0-15 Detik)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Garis indigo = Retensi Video KontenKU | Garis abu = Rata-rata Industri
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                Hook Retensi 3s: {project.analytics.overall.retention3s}%
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={project.analytics.retentionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="second" stroke="#94a3b8" tickFormatter={(v) => `${v}s`} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(v) => `Detik ke-${v}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="retentionPercentage"
                    name="KontenKU Video"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRetention)"
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmarkPercentage"
                    name="Benchmark Industri"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Chart: Platform ROAS & Conversions (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Performa Antar Platform</h3>
              <span className="text-[10px] text-slate-500">ROAS & Konversi</span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={project.analytics.byPlatform} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="platform" stroke="#94a3b8" tickFormatter={(v) => v.toUpperCase()} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="conversions" name="Pesanan" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="roas" name="ROAS (Multiplier)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AI Strategic Recommendations Cards */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Rekomendasi Strategi Iklan dari AI Advisor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {project.analytics.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{rec.insight}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="text-[10px] text-indigo-700 font-semibold">
                    Langkah Aksi: {rec.actionableStep}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    Dampak Potensial: {rec.potentialImpact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

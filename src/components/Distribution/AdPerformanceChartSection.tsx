import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  Layers,
  Sparkles,
  ArrowUpRight,
  Share2,
  Filter,
  Calendar,
  Zap,
  Activity,
  Award,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell
} from 'recharts';
import { PippitProject, AdPlatform } from '../../types';

interface AdPerformanceChartSectionProps {
  project: PippitProject;
  onRefreshInsights?: () => void;
  isRefreshing?: boolean;
}

export const AdPerformanceChartSection: React.FC<AdPerformanceChartSectionProps> = ({
  project,
  onRefreshInsights,
  isRefreshing = false,
}) => {
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<'all' | AdPlatform>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [activeChartTab, setActiveChartTab] = useState<'comparison' | 'daily_trend' | 'radar_strength' | 'funnel'>('comparison');

  // Platform comprehensive metrics data
  const platformComparisonData = [
    {
      platformKey: 'tiktok',
      platform: 'TikTok Shop / FYP',
      shortName: 'TikTok',
      color: '#4f46e5', // Indigo
      impressions: 485000,
      views: 395000,
      clicks: 34600,
      ctr: 7.13,
      engagements: 48900,
      engagementRate: 10.08,
      conversions: 2420,
      roas: 4.8,
      cpc: 380, // IDR
      cpm: 12500, // IDR
      shares: 6420,
      comments: 3120,
    },
    {
      platformKey: 'instagram',
      platform: 'Instagram Reels & Stories',
      shortName: 'Instagram',
      color: '#e1306c', // IG Pink
      impressions: 312000,
      views: 268000,
      clicks: 22800,
      ctr: 7.31,
      engagements: 38400,
      engagementRate: 12.31,
      conversions: 1680,
      roas: 4.2,
      cpc: 440,
      cpm: 15200,
      shares: 4190,
      comments: 2150,
    },
    {
      platformKey: 'facebook',
      platform: 'Facebook Feed & Video',
      shortName: 'Facebook',
      color: '#1877f2', // FB Blue
      impressions: 245000,
      views: 189000,
      clicks: 14200,
      ctr: 5.8,
      engagements: 19800,
      engagementRate: 8.08,
      conversions: 1040,
      roas: 3.6,
      cpc: 490,
      cpm: 14100,
      shares: 1890,
      comments: 980,
    },
  ];

  // Daily Trend Data (7 Days)
  const dailyTrendData = [
    { day: 'Senin', date: '22 Agu', tiktokViews: 52000, igViews: 38000, fbViews: 28000, totalImpressions: 118000, totalClicks: 8200, engagementRate: 9.8, ctr: 6.9 },
    { day: 'Selasa', date: '23 Agu', tiktokViews: 64000, igViews: 41000, fbViews: 31000, totalImpressions: 136000, totalClicks: 9800, engagementRate: 10.4, ctr: 7.2 },
    { day: 'Rabu', date: '24 Agu', tiktokViews: 71000, igViews: 45000, fbViews: 33000, totalImpressions: 149000, totalClicks: 11200, engagementRate: 11.2, ctr: 7.5 },
    { day: 'Kamis', date: '25 Agu', tiktokViews: 68000, igViews: 43000, fbViews: 32000, totalImpressions: 143000, totalClicks: 10400, engagementRate: 10.8, ctr: 7.3 },
    { day: 'Jumat', date: '26 Agu', tiktokViews: 88000, igViews: 54000, fbViews: 42000, totalImpressions: 184000, totalClicks: 14300, engagementRate: 12.6, ctr: 7.8 },
    { day: 'Sabtu', date: '27 Agu', tiktokViews: 98000, igViews: 59000, fbViews: 45000, totalImpressions: 202000, totalClicks: 16100, engagementRate: 13.1, ctr: 8.0 },
    { day: 'Minggu', date: '28 Agu', tiktokViews: 104000, igViews: 63000, fbViews: 49000, totalImpressions: 216000, totalClicks: 17400, engagementRate: 13.8, ctr: 8.1 },
  ];

  // Radar Performance Strengths across 5 key dimensions (Scale 0-100)
  const radarStrengthData = [
    { dimension: 'Hook Power (3s)', tiktok: 92, instagram: 84, facebook: 68, fullMark: 100 },
    { dimension: 'Engagement %', tiktok: 88, instagram: 94, facebook: 72, fullMark: 100 },
    { dimension: 'Click-Through (CTR)', tiktok: 89, instagram: 90, facebook: 70, fullMark: 100 },
    { dimension: 'Conversion Rate', tiktok: 95, instagram: 82, facebook: 76, fullMark: 100 },
    { dimension: 'ROAS Efficiency', tiktok: 94, instagram: 85, facebook: 74, fullMark: 100 },
    { dimension: 'Viral Shares', tiktok: 96, instagram: 86, facebook: 64, fullMark: 100 },
  ];

  // Conversion Funnel Data
  const funnelData = [
    { stage: '1. Total Tayangan (Impressions)', count: 1042000, percent: 100, fill: '#4f46e5' },
    { stage: '2. Ditonton >3 Detik (Engaged Views)', count: 852000, percent: 81.8, fill: '#6366f1' },
    { stage: '3. Klik Link / CTA Keranjang', count: 71600, percent: 6.87, fill: '#818cf8' },
    { stage: '4. Masuk Halaman Produk / Add to Cart', count: 21400, percent: 2.05, fill: '#a5b4fc' },
    { stage: '5. Selesai Checkout (Pesanan Berhasil)', count: 5140, percent: 0.49, fill: '#10b981' },
  ];

  // Summary Totals
  const totalImpressions = platformComparisonData.reduce((acc, p) => acc + p.impressions, 0);
  const totalClicks = platformComparisonData.reduce((acc, p) => acc + p.clicks, 0);
  const totalConversions = platformComparisonData.reduce((acc, p) => acc + p.conversions, 0);
  const avgEngagementRate = (
    platformComparisonData.reduce((acc, p) => acc + p.engagementRate, 0) / platformComparisonData.length
  ).toFixed(2);
  const avgCtr = (platformComparisonData.reduce((acc, p) => acc + p.ctr, 0) / platformComparisonData.length).toFixed(2);

  const filteredComparisonData =
    selectedPlatformFilter === 'all'
      ? platformComparisonData
      : platformComparisonData.filter((p) => p.platformKey === selectedPlatformFilter);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
      {/* Header with Filters & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Metrik Performa Iklan Antar Platform</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Recharts Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan komprehensif tayangan, rasio interaksi, jumlah klik, dan efisiensi biaya iklan untuk seluruh platform terhubung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            {[
              { id: '7d', label: '7 Hari' },
              { id: '14d', label: '14 Hari' },
              { id: '30d', label: '30 Hari' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTimeRange(t.id as any)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedTimeRange === t.id
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Platform Filter Dropdown / Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'tiktok', label: 'TikTok 🎵' },
              { id: 'instagram', label: 'IG Reels 📸' },
              { id: 'facebook', label: 'Facebook 👥' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatformFilter(p.id as any)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedPlatformFilter === p.id
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {onRefreshInsights && (
            <button
              onClick={onRefreshInsights}
              disabled={isRefreshing}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl transition shadow-xs disabled:opacity-50"
              title="Refresh Data Analitik"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 4 HIGH-LEVEL AGGREGATE STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Tayangan (Impressions)</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+34.2% dibanding periode lalu</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Tingkat Interaksi (Engagement)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {avgEngagementRate}%
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            107.1K Total Like, Komen & Share
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Klik & Rata-rata CTR</span>
            <MousePointerClick className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {totalClicks.toLocaleString()} <span className="text-xs font-semibold text-slate-500">({avgCtr}%)</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            Biaya Rata-rata Rp 436 / Klik (CPC)
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pesanan (Conversions)</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
            {totalConversions.toLocaleString()} <span className="text-xs font-semibold text-slate-500">(ROAS 4.3x)</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Omset Terekam: Rp 148.200.000
          </div>
        </div>
      </div>

      {/* CHART TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'comparison', label: '📊 Komparasi Platform (Tayangan, Klik & Interaksi)' },
          { id: 'daily_trend', label: '📈 Tren Harian & Kurva CTR' },
          { id: 'radar_strength', label: '🎯 Radar Kekuatan Iklan' },
          { id: 'funnel', label: '🛒 Corong Konversi (Audience Funnel)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChartTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-t-xl transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeChartTab === tab.id
                ? 'border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CHART RENDER VIEW */}
      <div className="space-y-6">
        
        {/* VIEW 1: Multi-Platform Bar Comparison */}
        {activeChartTab === 'comparison' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Perbandingan Metrik Utama: TikTok Shop vs Instagram Reels vs Facebook Ads
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data aktual tayangan (Views/Impressions), jumlah klik link, dan total interaksi per platform.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Tayangan
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Klik Link
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Interaksi (Like/Komen)
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredComparisonData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="shortName" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis stroke="#64748b" tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)} />
                  <Tooltip
                    formatter={(val: any, name: string) => [
                      typeof val === 'number' ? val.toLocaleString() : val,
                      name === 'impressions'
                        ? 'Total Tayangan'
                        : name === 'clicks'
                        ? 'Jumlah Klik'
                        : name === 'engagements'
                        ? 'Interaksi (Engagements)'
                        : name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="impressions" name="Tayangan (Views)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="engagements" name="Interaksi (Engagements)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="clicks" name="Jumlah Klik (Clicks)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Detailed Breakdown Mini Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {platformComparisonData.map((p) => (
                <div
                  key={p.platformKey}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">{p.platform}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      ROAS: {p.roas}x
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span>Tingkat Interaksi:</span>
                      <strong className="block text-slate-900">{p.engagementRate}%</strong>
                    </div>
                    <div>
                      <span>CTR Iklan:</span>
                      <strong className="block text-slate-900">{p.ctr}%</strong>
                    </div>
                    <div>
                      <span>Biaya / Klik (CPC):</span>
                      <strong className="block text-indigo-700">Rp {p.cpc}</strong>
                    </div>
                    <div>
                      <span>Pesanan Berhasil:</span>
                      <strong className="block text-emerald-700">{p.conversions} order</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Daily Trend & CTR ComposedChart */}
        {activeChartTab === 'daily_trend' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Kurva Tren Harian: Total Tayangan vs Tingkat Interaksi & CTR %
                </h3>
                <p className="text-[11px] text-slate-500">
                  Batang = Total Tayangan Harian | Garis = Rata-rata Engagement Rate (%) dan CTR (%)
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dailyTrendData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="#4f46e5" tickFormatter={(v) => `${v / 1000}K`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar yAxisId="left" dataKey="totalImpressions" name="Total Tayangan" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="engagementRate" name="Tingkat Interaksi (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="ctr" name="Click-Through Rate CTR (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 3: Radar Chart Strengths */}
        {activeChartTab === 'radar_strength' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarStrengthData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" stroke="#475569" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                  <Radar name="TikTok Shop" dataKey="tiktok" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                  <Radar name="Instagram Reels" dataKey="instagram" stroke="#e1306c" fill="#e1306c" fillOpacity={0.25} />
                  <Radar name="Facebook Ads" dataKey="facebook" stroke="#1877f2" fill="#1877f2" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Analisis Karakteristik Performa Platform:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <span>🎵 TikTok Shop: Jawara Konversi Langsung</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Unggul tertinggi pada <em>Hook Power</em> (92/100) dan <em>Conversion Rate</em> (95/100) karena adanya tombol Keranjang Kuning instan tanpa keluar aplikasi.
                  </p>
                </div>

                <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl space-y-1">
                  <div className="font-bold text-pink-900 flex items-center gap-1.5">
                    <span>📸 Instagram Reels: Keterlibatan (Engagement) Tertinggi</span>
                  </div>
                  <p className="text-[11px] text-pink-800 leading-relaxed">
                    Tingkat share ke Story & DM serta bookmark simpan produk mencapai 94/100 dengan CTR klik bio 7.31%.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <span>👥 Facebook Ads: Jangkauan Luas Audiens Dewasa</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Sangat efektif untuk retargeting keranjang tertinggal dan penayangan feed berformat landscape 16:9 / 1:1.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Conversion Funnel */}
        {activeChartTab === 'funnel' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Corong Konversi Pelanggan (Ad Audience Conversion Funnel)
              </h3>
              <p className="text-[11px] text-slate-500">
                Perjalanan audiens dari pertama kali melihat hook video sampai menyelesaikan pembayaran order produk.
              </p>
            </div>

            <div className="space-y-2.5 max-w-2xl mx-auto pt-2">
              {funnelData.map((f, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{f.stage}</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {f.count.toLocaleString()} <span className="text-[10px] text-slate-500">({f.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(f.percent, 3)}%`,
                        backgroundColor: f.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

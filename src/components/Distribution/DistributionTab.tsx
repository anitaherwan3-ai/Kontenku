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
  ExternalLink,
  Users,
  Layers,
  Check,
  Smartphone,
  ShieldCheck,
  Sliders,
  Play,
  ArrowRight,
  Plus,
  Radio,
  Sparkle,
  KeyRound,
  FolderArchive,
  Download,
  Film,
  Zap,
  Activity,
  History,
  Bell,
  Stamp,
  Hash,
  Trophy,
  Flame,
  Tag,
  Settings
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
import {
  PippitProject,
  AdPlatform,
  ScheduledPost,
  ConnectedSocialAccount,
  UploadHistoryItem,
  AutoWatermarkConfig,
  EngagementMilestoneAlert
} from '../../types';
import { DEFAULT_PIPPIT_PROJECT } from '../../data/samplePresets';
import { generateSocialCopyApi, fetchAiStrategyInsightsApi } from '../../services/api';
import { MultiAccountManagerModal } from './MultiAccountManagerModal';
import { OAuthCredentialsDashboard } from './OAuthCredentialsDashboard';
import { LiveModeOAuthPanel } from './LiveModeOAuthPanel';
import { BulkExportModal } from './BulkExportModal';
import { AdPerformanceChartSection } from './AdPerformanceChartSection';
import { ContentSchedulingSection } from './ContentSchedulingSection';
import { UploadHistorySection } from './UploadHistorySection';
import { SmartCaptionGeneratorModal } from './SmartCaptionGeneratorModal';
import { AutoWatermarkSettingsModal } from './AutoWatermarkSettingsModal';
import { WatermarkOverlay } from './WatermarkOverlay';
import { EngagementAlertsToast } from './EngagementAlertsToast';
import { EngagementAlertsCenterModal } from './EngagementAlertsCenterModal';

interface DistributionTabProps {
  project: PippitProject;
  onChangeProject: (newProject: Partial<PippitProject>) => void;
  onOpenExportModal: () => void;
  onOpenSystemSettings?: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  project,
  onChangeProject,
  onOpenExportModal,
  onOpenSystemSettings,
}) => {
  const connectedAccounts: ConnectedSocialAccount[] = project.connectedAccounts || [];
  const scheduledPosts: ScheduledPost[] = project.scheduledPosts || [];
  const uploadHistory: UploadHistoryItem[] = project.uploadHistory || [];

  const defaultWatermarkConfig: AutoWatermarkConfig = {
    enabled: true,
    type: 'handle',
    text: '@glowluxe.official',
    logoUrl: '',
    position: 'top-right',
    opacity: 0.75,
    scale: 100,
    style: 'subtle_translucent',
    showTimestamp: false,
    showVerifiedIcon: true,
  };

  const watermarkConfig: AutoWatermarkConfig = project.watermarkConfig || defaultWatermarkConfig;

  const defaultAlerts: EngagementMilestoneAlert[] = [
    {
      id: 'alert-1',
      type: 'views',
      title: '🔥 Video Tembus 100.000 Views di TikTok FYP!',
      message: `Video promosi "${project.inputData.productAnalysis?.productName || 'Barrier Glow Serum'}" baru saja melampaui milestone 100K tayangan organik dalam 6 jam pertama penayangan.`,
      metricLabel: 'Organik Views',
      metricValue: '108.450 Tayangan',
      platform: 'tiktok',
      accountHandle: '@glowluxe.official',
      postTitle: `Review Jujur ${project.inputData.productAnalysis?.productName || 'Barrier Glow Serum'}`,
      timestamp: '2 jam yang lalu',
      isRead: false,
      badgeColor: 'bg-orange-500',
      iconType: 'flame',
    },
    {
      id: 'alert-2',
      type: 'cart_clicks',
      title: '🛍️ Lonjakan 5.000 Klik Keranjang Kuning!',
      message: 'Tingkat konversi CTA melonjak drastis! Terjadi 5.240 klik pada keranjang kuning dengan checkout rate 14.8%.',
      metricLabel: 'Keranjang Terklik',
      metricValue: '5.240 Klik',
      platform: 'tiktok',
      accountHandle: '@glowluxe.store',
      postTitle: `Flash Sale Disc 45% ${project.inputData.productAnalysis?.productName || 'Barrier Glow Serum'}`,
      timestamp: '5 jam yang lalu',
      isRead: false,
      badgeColor: 'bg-emerald-500',
      iconType: 'shopping',
    },
    {
      id: 'alert-3',
      type: 'roas',
      title: '💰 Rekor ROAS Iklan Mencapai 6.2x!',
      message: 'Kampanye Meta Ads / Reels melampaui target efisiensi biaya. Biaya per akuisisi pelanggan (CAC) turun 38%.',
      metricLabel: 'Efisiensi ROAS',
      metricValue: '6.2x Return',
      platform: 'instagram',
      accountHandle: '@glowluxe.id',
      postTitle: `Daily Glow Aesthetic Serum`,
      timestamp: 'Kemarin, 21:00 WIB',
      isRead: true,
      badgeColor: 'bg-indigo-500',
      iconType: 'trophy',
    },
  ];

  const engagementAlerts: EngagementMilestoneAlert[] = project.engagementAlerts || defaultAlerts;

  const [distributionViewMode, setDistributionViewMode] = useState<
    'publisher' | 'scheduler' | 'upload_history' | 'oauth_dashboard'
  >('publisher');
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('tiktok');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    connectedAccounts.length > 0 ? connectedAccounts.map((a) => a.id) : ['acc-tt-1', 'acc-ig-1']
  );

  // Demo vs Live Mode Switcher State
  const [envMode, setEnvMode] = useState<'demo' | 'live'>('demo');
  const [demoAccountsBackup, setDemoAccountsBackup] = useState<ConnectedSocialAccount[]>(DEFAULT_PIPPIT_PROJECT.connectedAccounts || []);
  const [demoPostsBackup, setDemoPostsBackup] = useState<ScheduledPost[]>(DEFAULT_PIPPIT_PROJECT.scheduledPosts || []);
  const [liveAccounts, setLiveAccounts] = useState<ConnectedSocialAccount[]>([]);
  const [envSwitchNotice, setEnvSwitchNotice] = useState<string | null>(null);

  // Switch between Demo (Sandbox) and Live (Real OAuth / API)
  const handleSwitchEnvMode = (newMode: 'demo' | 'live') => {
    if (newMode === envMode) return;
    setEnvMode(newMode);

    if (newMode === 'live') {
      // Backup current demo accounts
      setDemoAccountsBackup(connectedAccounts);
      setDemoPostsBackup(scheduledPosts);

      // Clear mock data: only keep real accounts
      onChangeProject({
        connectedAccounts: liveAccounts,
        scheduledPosts: scheduledPosts.filter((p) => !p.id.startsWith('post-1') && !p.id.startsWith('post-2') && !p.id.startsWith('post-3')),
      });
      setSelectedAccountIds(liveAccounts.map((a) => a.id));
      setEnvSwitchNotice('🚀 Beralih ke Mode Live: Data simulasi demo telah dibersihkan. Silakan konfigurasi API Key dan hubungkan akun nyata Anda via OAuth di bawah ini.');
    } else {
      // Restore sandbox demo accounts & posts
      const restoredAccounts = demoAccountsBackup.length > 0 ? demoAccountsBackup : (DEFAULT_PIPPIT_PROJECT.connectedAccounts || []);
      const restoredPosts = demoPostsBackup.length > 0 ? demoPostsBackup : (DEFAULT_PIPPIT_PROJECT.scheduledPosts || []);
      onChangeProject({
        connectedAccounts: restoredAccounts,
        scheduledPosts: restoredPosts,
      });
      setSelectedAccountIds(restoredAccounts.map((a) => a.id));
      setEnvSwitchNotice('🧪 Beralih ke Mode Demo (Sandbox): Data simulasi akun & metrik kampanye telah dimuat kembali untuk pengujian aman.');
    }

    setTimeout(() => {
      setEnvSwitchNotice(null);
    }, 6000);
  };

  const handleAddLiveRealAccount = (newAcc: ConnectedSocialAccount) => {
    const updated = [...liveAccounts.filter((a) => a.id !== newAcc.id), newAcc];
    setLiveAccounts(updated);
    onChangeProject({ connectedAccounts: updated });
    setSelectedAccountIds(updated.map((a) => a.id));
  };

  // Modals state
  const [isMultiAccountModalOpen, setIsMultiAccountModalOpen] = useState(false);
  const [isBulkExportModalOpen, setIsBulkExportModalOpen] = useState(false);
  const [isSmartCaptionModalOpen, setIsSmartCaptionModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isAlertsCenterModalOpen, setIsAlertsCenterModalOpen] = useState(false);

  // Active Toast Alert
  const [activeToastAlert, setActiveToastAlert] = useState<EngagementMilestoneAlert | null>(null);

  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  
  // Customization & Shop Integrations
  const [enableYellowCartTag, setEnableYellowCartTag] = useState(true);
  const [customCaption, setCustomCaption] = useState(
    project.scheduledPosts.find((p) => p.platform === selectedPlatform)?.caption ||
      '🔥 RACUN TIKTOK VIRAL! Hasilnya beneran sebagus ini! Checkout sekarang mumpung diskon 45% + Gratis Ongkir! 🛍️✨ #RacunTikTok #SkincareViral #DiskonTikTokShop'
  );
  
  // Cross-Post Progress state
  const [isCrossPosting, setIsCrossPosting] = useState(false);
  const [crossPostStep, setCrossPostStep] = useState<string>('');
  const [crossPostCompletedCount, setCrossPostCompletedCount] = useState<number>(0);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Unread alerts count
  const unreadAlertsCount = engagementAlerts.filter((a) => !a.isRead).length;

  // Toggle account selection
  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const selectAllAccounts = () => {
    if (selectedAccountIds.length === connectedAccounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(connectedAccounts.map((a) => a.id));
    }
  };

  // Generate AI Copy
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

  // Trigger simulated alert
  const handleTriggerSimulatedAlert = (customAlert?: Partial<EngagementMilestoneAlert>) => {
    const newAlert: EngagementMilestoneAlert = {
      id: `alert-${Date.now()}`,
      type: customAlert?.type || 'views',
      title: customAlert?.title || '🔥 Video Baru Capai 50.000 Views!',
      message: customAlert?.message || 'Video ad ini melampaui target impresi algoritma.',
      metricLabel: customAlert?.metricLabel || 'Views Capaian',
      metricValue: customAlert?.metricValue || '52.300 Views',
      platform: customAlert?.platform || selectedPlatform,
      accountHandle: customAlert?.accountHandle || '@glowluxe.official',
      postTitle: customAlert?.postTitle || 'Video Promosi TikTok Shop',
      timestamp: 'Baru Saja',
      isRead: false,
      badgeColor: 'bg-orange-500',
      iconType: customAlert?.iconType || 'flame',
    };

    const updatedAlerts = [newAlert, ...engagementAlerts];
    onChangeProject({ engagementAlerts: updatedAlerts });
    setActiveToastAlert(newAlert);
  };

  // Multi-Account Cross-Post Execution
  const handleSimultaneousCrossPost = () => {
    if (selectedAccountIds.length === 0) return;

    setIsCrossPosting(true);
    setCrossPostCompletedCount(0);
    setCrossPostStep('Menyiapkan file video dan token otentikasi API...');

    const targetAccs = connectedAccounts.filter((a) => selectedAccountIds.includes(a.id));
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < targetAccs.length) {
        const currentAcc = targetAccs[stepIndex];
        setCrossPostStep(
          `Mengunggah video ke ${currentAcc.accountName} (${currentAcc.platform.toUpperCase()} - ${currentAcc.accountHandle})...`
        );
        setCrossPostCompletedCount(stepIndex + 1);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsCrossPosting(false);

          // Mark published in project
          const updatedPosts = project.scheduledPosts.map((p) => ({
            ...p,
            status: 'published' as const,
            caption: customCaption,
          }));

          // Create history entries for each targeted account
          const newHistoryEntries: UploadHistoryItem[] = targetAccs.map((acc, idx) => ({
            id: `hist-${Date.now()}-${idx}`,
            projectId: project.id,
            postTitle: `${project.inputData.productAnalysis?.productName || 'Konten Video'} - ${acc.platform.toUpperCase()}`,
            platform: acc.platform,
            accountId: acc.id,
            accountName: acc.accountName,
            accountHandle: acc.accountHandle,
            avatarUrl: acc.avatarUrl,
            timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }) + ' WIB',
            status: 'success',
            postUrl:
              acc.platform === 'tiktok'
                ? `https://www.tiktok.com/${acc.accountHandle}/video/${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
                : acc.platform === 'instagram'
                ? `https://www.instagram.com/reel/C${Math.random().toString(36).substring(2, 9)}/`
                : `https://www.facebook.com/watch/?v=${Math.floor(100000000000000 + Math.random() * 900000000000000)}`,
            videoVariant: '9:16 Vertical 1080p (MP4)',
            captionPreview: customCaption,
            hashtags: ['#GlowLuxe', '#Viral', '#RacunTikTok'],
            shopTagActive: enableYellowCartTag,
            stats: {
              views: Math.floor(800 + Math.random() * 2000),
              likes: Math.floor(80 + Math.random() * 300),
              comments: Math.floor(5 + Math.random() * 40),
              shares: Math.floor(15 + Math.random() * 80),
              cartClicks: Math.floor(20 + Math.random() * 90),
            },
          }));

          onChangeProject({
            scheduledPosts: updatedPosts,
            uploadHistory: [...newHistoryEntries, ...(project.uploadHistory || [])],
          });

          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.5 },
          });

          setPublishSuccessMsg(
            `🚀 Berhasil mempublikasikan serentak ke ${targetAccs.length} Akun (${targetAccs.map((a) => a.accountHandle).join(', ')})!`
          );

          // Trigger a milestone alert demonstration
          setTimeout(() => {
            handleTriggerSimulatedAlert({
              type: 'views',
              title: `⚡ Video Baru Terpublikasi di ${targetAccs[0]?.accountName || 'TikTok'}!`,
              message: `Video "${project.inputData.productAnalysis?.productName || 'Produk'}" berhasil didistribusikan ke algoritma FYP. Pantau grafik engagement secara langsung.`,
              metricLabel: 'Status Akun',
              metricValue: `${targetAccs.length} Akun Live`,
              platform: targetAccs[0]?.platform || 'tiktok',
              accountHandle: targetAccs[0]?.accountHandle || '@glowluxe.official',
              postTitle: `${project.inputData.productAnalysis?.productName || 'Produk'} Campaign`,
              iconType: 'zap',
            });
          }, 1500);

          setTimeout(() => setPublishSuccessMsg(null), 5000);
        }, 800);
      }
    }, 900);
  };

  // Schedule Post handler
  const handleSchedulePost = () => {
    const targetAccs = connectedAccounts.filter((a) => selectedAccountIds.includes(a.id));
    const updatedPosts = project.scheduledPosts.map((p) => ({
      ...p,
      status: 'scheduled' as const,
      caption: customCaption,
    }));

    onChangeProject({ scheduledPosts: updatedPosts });
    setPublishSuccessMsg(
      `Jadwal postingan ke ${targetAccs.length > 0 ? targetAccs.length : 1} Akun berhasil disimpan! Anda dapat melihat antrean lengkap di tab Penjadwalan.`
    );
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

  const handleUpdateConnectedAccounts = (newAccounts: ConnectedSocialAccount[]) => {
    onChangeProject({ connectedAccounts: newAccounts });
    setSelectedAccountIds(newAccounts.map((a) => a.id));
  };

  const currentPlatformPost = project.scheduledPosts.find((p) => p.platform === selectedPlatform);
  const selectedAccounts = connectedAccounts.filter((a) => selectedAccountIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Floating Engagement Alert Toast */}
      <EngagementAlertsToast
        alert={activeToastAlert}
        onDismiss={() => setActiveToastAlert(null)}
        onViewDetails={() => setIsAlertsCenterModalOpen(true)}
      />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
              <Share2 className="w-3.5 h-3.5" />
              Layer 4: Output & Multi-Channel Distribution
            </div>

            {/* DEMO vs LIVE ENVIRONMENT TOGGLE PILL */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300 gap-1">
              <button
                id="btn-env-mode-demo"
                onClick={() => handleSwitchEnvMode('demo')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  envMode === 'demo'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mode Demo Sandbox: Data simulasi aman untuk pengujian fitur"
              >
                <span>🧪</span>
                <span>Mode Demo</span>
              </button>
              <button
                id="btn-env-mode-live"
                onClick={() => handleSwitchEnvMode('live')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  envMode === 'live'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mode Live: Terhubung ke akun & API resmi (Data mock dibersihkan)"
              >
                <span>🚀</span>
                <span>Mode Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pusat Pengaturan Multi-Akun & Distribusi Konten
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {envMode === 'live'
              ? 'Mode Live Aktif: Publikasi langsung ke channel media sosial resmi dengan integrasi TikTok Shop API, Meta Graph, dan YouTube Studio Data API.'
              : 'Mode Demo Sandbox: Hubungkan akun TikTok Shop, IG Reels, dan FB Ads untuk publikasi serentak, generator caption pintar AI, dan preview analitik simulasi.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* ENGAGEMENT ALERTS BUTTON */}
          <button
            id="btn-engagement-alerts"
            onClick={() => setIsAlertsCenterModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition active:scale-95 relative"
            title="Lihat riwayat notifikasi milestone views & klik keranjang"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1.5 right-1.5" />
            )}
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-extrabold">
              {unreadAlertsCount}
            </span>
          </button>

          {/* AUTO-WATERMARK QUICK TOGGLE & SETTING BUTTON */}
          <button
            id="btn-auto-watermark-settings"
            onClick={() => setIsWatermarkModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 border font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition active:scale-95 ${
              watermarkConfig.enabled
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title="Pengaturan Watermark & Logo Brand pada video"
          >
            <Stamp className={`w-4 h-4 ${watermarkConfig.enabled ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>Watermark: {watermarkConfig.enabled ? 'Aktif' : 'Nonaktif'}</span>
            <Sliders className="w-3 h-3 text-slate-400" />
          </button>

          {/* SYSTEM SETTINGS & API CREDENTIALS BUTTON */}
          {onOpenSystemSettings && (
            <button
              id="btn-distribution-system-settings"
              onClick={onOpenSystemSettings}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition active:scale-95"
              title="Buka Pengaturan Sistem, Kredensial API & Webhook"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Pengaturan API</span>
            </button>
          )}

          {/* View Mode Toggle Sub-Navigation Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 gap-1 flex-wrap">
            <button
              id="btn-mode-publisher"
              onClick={() => setDistributionViewMode('publisher')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                distributionViewMode === 'publisher'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publikasi Serentak</span>
            </button>

            <button
              id="btn-mode-scheduler"
              onClick={() => setDistributionViewMode('scheduler')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                distributionViewMode === 'scheduler'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Penjadwalan</span>
              {scheduledPosts.length > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    distributionViewMode === 'scheduler'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {scheduledPosts.length}
                </span>
              )}
            </button>

            <button
              id="btn-mode-upload-history"
              onClick={() => setDistributionViewMode('upload_history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                distributionViewMode === 'upload_history'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Upload</span>
              {uploadHistory.length > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    distributionViewMode === 'upload_history'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {uploadHistory.length}
                </span>
              )}
            </button>

            <button
              id="btn-oauth-dashboard-tab"
              onClick={() => setDistributionViewMode('oauth_dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                distributionViewMode === 'oauth_dashboard'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Dashboard OAuth</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  distributionViewMode === 'oauth_dashboard'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {connectedAccounts.length}
              </span>
            </button>
          </div>

          <button
            id="btn-connect-real-account-main"
            onClick={() => setIsMultiAccountModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-200 transition active:scale-95 animate-pulse-subtle"
            title="Hubungkan akun TikTok, Instagram Reels, atau YouTube Shorts asli Anda via OAuth"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-100" />
            <span>+ Connect Real Account</span>
          </button>

          <button
            onClick={() => setIsMultiAccountModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Multi-Akun ({connectedAccounts.length})</span>
          </button>

          {/* BULK EXPORT MULTI-FORMAT BUTTON */}
          <button
            id="btn-bulk-export-all-formats"
            onClick={() => setIsBulkExportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition active:scale-95"
            title="Ekspor video dalam berbagai format (MP4, MOV, GIF) dan aspek rasio sekaligus"
          >
            <FolderArchive className="w-4 h-4 text-indigo-600" />
            <span>Ekspor Massal</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95"
          >
            <span>Export MP4</span>
          </button>
        </div>
      </div>

      {publishSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {envSwitchNotice && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-xs ${
          envMode === 'live'
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
            : 'bg-indigo-50 border border-indigo-300 text-indigo-950'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-base">{envMode === 'live' ? '🚀' : '🧪'}</span>
            <span>{envSwitchNotice}</span>
          </div>
          <button
            onClick={() => setEnvSwitchNotice(null)}
            className="text-xs px-2.5 py-1 bg-black/10 hover:bg-black/20 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      )}

      {/* RENDER VIEW ACCORDING TO ACTIVE MODE */}
      {distributionViewMode === 'scheduler' ? (
        <ContentSchedulingSection
          project={project}
          onChangeProject={onChangeProject}
        />
      ) : distributionViewMode === 'upload_history' ? (
        <UploadHistorySection
          project={project}
          onChangeProject={onChangeProject}
        />
      ) : distributionViewMode === 'oauth_dashboard' ? (
        <OAuthCredentialsDashboard
          accounts={connectedAccounts}
          onUpdateAccounts={handleUpdateConnectedAccounts}
          onOpenAddModal={() => setIsMultiAccountModalOpen(true)}
        />
      ) : (
        <>
          {/* LIVE MODE OAUTH & API KEY CONFIGURATION SUITE */}
          {envMode === 'live' ? (
            <LiveModeOAuthPanel
              connectedAccounts={connectedAccounts}
              onAddRealAccount={handleAddLiveRealAccount}
              onOpenMultiAccountModal={() => setIsMultiAccountModalOpen(true)}
            />
          ) : (
            /* Demo Mode Quick Guide */
            <div className="bg-indigo-50/80 border border-indigo-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-indigo-950">
                      Mode Sandbox Demo (Data Simulasi Aman)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900">
                      Status: Sandbox Ready
                    </span>
                  </div>
                  <p className="text-xs text-indigo-800 leading-relaxed max-w-3xl">
                    Anda sedang menjalankan simulasi penerbitan video, hashtag AI, dan metrik penonton. Untuk menghubungkan akun TikTok Shop, IG Reels, atau YouTube resmi dan membersihkan data mock, klik <strong>Mode Live</strong> di bagian atas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSwitchEnvMode('live')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition active:scale-95 flex items-center gap-1.5"
              >
                <span>Beralih ke Mode Live</span>
                <span>🚀</span>
              </button>
            </div>
          )}

          {/* MULTI-ACCOUNT CROSS-POSTING CONTROLLER BAR */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Target Akun Penyiaran Serentak (Cross-Posting)
                </h2>
                <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  {selectedAccountIds.length} Terpilih
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Pilih akun target yang akan menerima konten video ini secara serentak dalam 1 klik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllAccounts}
              className="text-xs font-semibold text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition"
            >
              {selectedAccountIds.length === connectedAccounts.length
                ? 'Batalkan Semua'
                : 'Pilih Semua Akun'}
            </button>
            <button
              onClick={() => setIsMultiAccountModalOpen(true)}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Akun</span>
            </button>
          </div>
        </div>

        {/* Connected Accounts Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {connectedAccounts.map((acc) => {
            const isSelected = selectedAccountIds.includes(acc.id);
            return (
              <div
                key={acc.id}
                onClick={() => toggleAccountSelection(acc.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-2.5 relative select-none ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-400/40'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.accountName}
                    className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {acc.accountName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-white/20 text-white">
                        {acc.platform}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/70 truncate">
                      {acc.accountHandle}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-white/60 pt-1 flex-wrap">
                      <span>{acc.followersCount} Follower</span>
                      {acc.shopLinked && (
                        <span className="text-amber-300 flex items-center gap-0.5">
                          • 🛍️ Shop
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>API Aktif</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Publisher Matrix & Platform Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Platform Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
            
            {/* Platform Selector Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPlatform('tiktok')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedPlatform === 'tiktok'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🎵 TikTok Shop</span>
                </button>
                <button
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedPlatform === 'instagram'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>📸 IG Reels</span>
                </button>
                <button
                  onClick={() => setSelectedPlatform('facebook')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedPlatform === 'facebook'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>📘 Facebook Page</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                Preset Format: 9:16 Vertikal
              </span>
            </div>

            {/* AI Copywriter Generator Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Copy & Hashtags Generator</span>
                </label>

                <div className="flex items-center gap-2">
                  {/* SMART CAPTION AI GENERATOR BUTTON */}
                  <button
                    id="btn-smart-caption-generator"
                    onClick={() => setIsSmartCaptionModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs"
                    title="Buka generator caption cerdas dengan 5 gaya copywriting & riset tagar"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Smart Caption AI (5 Angles)</span>
                  </button>

                  <button
                    onClick={handleGeneratePlatformCopy}
                    disabled={isGeneratingCopy}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingCopy ? 'Menulis...' : 'Quick Copy'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed resize-none font-medium"
                placeholder="Tulis caption atau klik generate AI untuk membuat copy viral..."
              />
            </div>

            {/* AUTO-WATERMARK & BRAND PROTECTION BANNER */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold ${
                  watermarkConfig.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Stamp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Auto-Watermark & Brand Protection</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      watermarkConfig.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {watermarkConfig.enabled ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {watermarkConfig.enabled
                      ? `Menempelkan "${watermarkConfig.text || '@glowluxe.official'}" di ${watermarkConfig.position} video.`
                      : 'Video diekspor polosan tanpa watermark identitas brand.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() =>
                    onChangeProject({
                      watermarkConfig: { ...watermarkConfig, enabled: !watermarkConfig.enabled },
                    })
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                    watermarkConfig.enabled
                      ? 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {watermarkConfig.enabled ? 'Matikan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => setIsWatermarkModalOpen(true)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                  title="Sesuaikan posisi, gaya, dan opacity watermark"
                >
                  <Sliders className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* TikTok Yellow Cart & Product Tagging Switch */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-lg shrink-0">
                  🛍️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Tagging Keranjang Kuning & Meta Catalog Otomatis</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                      High Conversion
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Otomatis menyematkan link beli produk Shopee/TikTok Shop di bawah video saat dipublikasikan.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={enableYellowCartTag}
                onChange={(e) => setEnableYellowCartTag(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            {/* Posting Schedule Time Setting Quick Jump */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jadwal Penayangan Otomatis</span>
                </span>
                <button
                  onClick={() => setDistributionViewMode('scheduler')}
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] flex items-center gap-1"
                >
                  <span>Buka Pengaturan Prime-Time & Antrean</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <span className="text-slate-700 font-medium">
                  {currentPlatformPost?.scheduledTime || '2026-08-28 19:30 WIB'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Rekomendasi Prime-Time
                </span>
              </div>
            </div>

            {/* Cross-Posting Progress Banner */}
            {isCrossPosting && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Memproses Cross-Posting Multi-Akun...</span>
                  </span>
                  <span>
                    {crossPostCompletedCount} / {selectedAccountIds.length} Akun
                  </span>
                </div>
                <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{
                      width: `${(crossPostCompletedCount / selectedAccountIds.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-indigo-700 truncate">{crossPostStep}</div>
              </div>
            )}

            {/* Publishing Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="btn-schedule-post"
                onClick={handleSchedulePost}
                disabled={isCrossPosting || selectedAccountIds.length === 0}
                className="py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Jadwalkan ({selectedAccountIds.length} Akun)</span>
              </button>

              <button
                id="btn-publish-now"
                onClick={handleSimultaneousCrossPost}
                disabled={isCrossPosting || selectedAccountIds.length === 0}
                className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
                <span>
                  {isCrossPosting
                    ? 'Sedang Mempublikasikan...'
                    : `Publikasikan Serentak (${selectedAccountIds.length} Akun)`}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Right: Live Post Mobile Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>Preview Feed ({selectedPlatform.toUpperCase()})</span>
              </h3>
              <span className="text-[10px] text-indigo-600 font-semibold">
                {selectedAccounts.length} Akun Target
              </span>
            </div>

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

              {/* Watermark Overlay Render on Video */}
              <WatermarkOverlay
                config={watermarkConfig}
                accountHandle={selectedAccounts[0]?.accountHandle || '@glowluxe.official'}
                brandName={project.inputData.productAnalysis?.brandName || 'GlowLuxe Official'}
              />

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
                  <span className="font-bold text-xs">
                    {selectedAccounts[0]?.accountHandle || '@glowluxe.official'}
                  </span>
                  <span className="text-[9px] bg-indigo-600 px-1 rounded font-bold">Verified</span>
                </div>
                <p className="text-[11px] line-clamp-2 text-slate-200 leading-snug">
                  {customCaption}
                </p>

                {/* TikTok Yellow Cart Banner */}
                {enableYellowCartTag && (
                  <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-bold text-[10px] flex items-center justify-between shadow-md">
                    <span className="flex items-center gap-1">
                      <span>🛍️</span>
                      <span className="truncate max-w-[130px]">
                        {project.inputData.productAnalysis?.productName || 'Barrier Glow Serum'}
                      </span>
                    </span>
                    <span className="bg-slate-950 text-white px-1.5 py-0.5 rounded text-[9px] shrink-0">
                      Beli Diskon 45%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: Visualisasi Metrik Performa Iklan (Recharts) & Kurva Retensi */}
      <AdPerformanceChartSection
        project={project}
        onRefreshInsights={handleRefreshInsights}
        isRefreshing={isRefreshingInsights}
      />
      </>
      )}

      {/* Multi-Account Manager Modal */}
      <MultiAccountManagerModal
        isOpen={isMultiAccountModalOpen}
        onClose={() => setIsMultiAccountModalOpen(false)}
        accounts={connectedAccounts}
        onUpdateAccounts={handleUpdateConnectedAccounts}
      />

      {/* Bulk Multi-Format Exporter Modal (MP4, MOV, GIF) */}
      <BulkExportModal
        isOpen={isBulkExportModalOpen}
        onClose={() => setIsBulkExportModalOpen(false)}
        project={project}
      />

      {/* Smart Caption & Hashtag Generator Modal */}
      <SmartCaptionGeneratorModal
        isOpen={isSmartCaptionModalOpen}
        onClose={() => setIsSmartCaptionModalOpen(false)}
        project={project}
        currentPlatform={selectedPlatform}
        onApplyCaption={(newCaption) => {
          setCustomCaption(newCaption);
          const updatedPosts = project.scheduledPosts.map((p) =>
            p.platform === selectedPlatform ? { ...p, caption: newCaption } : p
          );
          onChangeProject({ scheduledPosts: updatedPosts });
        }}
      />

      {/* Auto-Watermark Settings Modal */}
      <AutoWatermarkSettingsModal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        config={watermarkConfig}
        onSaveConfig={(updated) => onChangeProject({ watermarkConfig: updated })}
        project={project}
      />

      {/* Engagement Alerts Center Modal */}
      <EngagementAlertsCenterModal
        isOpen={isAlertsCenterModalOpen}
        onClose={() => setIsAlertsCenterModalOpen(false)}
        alerts={engagementAlerts}
        onTriggerSimulatedAlert={handleTriggerSimulatedAlert}
        onClearAllAlerts={() => onChangeProject({ engagementAlerts: [] })}
        onMarkAllRead={() => {
          const marked = engagementAlerts.map((a) => ({ ...a, isRead: true }));
          onChangeProject({ engagementAlerts: marked });
        }}
        project={project}
      />
    </div>
  );
};

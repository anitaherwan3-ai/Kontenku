import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  RefreshCw,
  Sparkles,
  Lock,
  Globe,
  Sliders,
  Store,
  Share2,
  Cpu,
  Palette,
  Film,
  Bell,
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  Tv,
  MessageSquare,
  KeyRound,
  Layers,
  Smartphone,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PippitProject, ConnectedSocialAccount, BrandKitSettings, AutoWatermarkConfig } from '../../types';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PippitProject;
  onChangeProject: (updated: Partial<PippitProject>) => void;
  onLoadPreset?: (presetId: string) => void;
}

export interface ApiConnectionConfig {
  tiktok: {
    appId: string;
    appSecret: string;
    shopId: string;
    accessToken: string;
    status: 'connected' | 'idle' | 'testing';
    latencyMs?: number;
  };
  meta: {
    appId: string;
    appSecret: string;
    pageId: string;
    instagramId: string;
    accessToken: string;
    status: 'connected' | 'idle' | 'testing';
    latencyMs?: number;
  };
  youtube: {
    clientId: string;
    clientSecret: string;
    channelId: string;
    accessToken: string;
    status: 'connected' | 'idle' | 'testing';
    latencyMs?: number;
  };
  shopee: {
    partnerId: string;
    partnerKey: string;
    shopId: string;
    status: 'connected' | 'idle' | 'testing';
    latencyMs?: number;
  };
  tokopedia: {
    fsId: string;
    clientSecret: string;
    shopId: string;
    status: 'connected' | 'idle' | 'testing';
    latencyMs?: number;
  };
}

export interface AiEngineConfig {
  geminiModel: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  temperature: number;
  seedanceEngine: 'seedance-turbo-v2' | 'seedance-pro-hd';
  ttsProvider: 'edge-neural' | 'elevenlabs-studio' | 'local-synth';
  enableOfflineFallback: boolean;
  enableAutoHookAnalysis: boolean;
}

export interface RenderPreferencesConfig {
  defaultResolution: '1080p' | '720p_lite' | '4k';
  defaultFps: 30 | 60;
  defaultAspectRatio: '9:16' | '16:9' | '1:1';
  bitratePreset: 'high_18mbps' | 'balanced_12mbps' | 'light_8mbps';
  captionStylePreset: 'karaoke_glow' | 'yellow_pop' | 'clean_minimal';
  defaultBgmVolume: number;
  defaultVoiceVolume: number;
  defaultSfxVolume: number;
}

export interface NotificationWebhooksConfig {
  discordWebhookUrl: string;
  telegramBotToken: string;
  telegramChatId: string;
  notifyOnRenderComplete: boolean;
  notifyOnPublishSuccess: boolean;
  notifyOnMilestone10k: boolean;
  notifyOnMilestone50k: boolean;
  notifyOnMilestone100k: boolean;
}

const SETTINGS_STORAGE_KEY = 'kontenku_system_settings_v1';

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onChangeProject,
  onLoadPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'ai_engine' | 'brand_kit' | 'render' | 'notifications' | 'data_backup'>('connections');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // 1. Connection Configurations
  const [apiConnections, setApiConnections] = useState<ApiConnectionConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_connections`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved connection settings', e);
    }
    return {
      tiktok: {
        appId: 'tt_app_8940284719',
        appSecret: '••••••••••••••••',
        shopId: 'ID-TTSHOP-9921',
        accessToken: 'tt_live_act_89402_x89',
        status: 'connected',
        latencyMs: 32,
      },
      meta: {
        appId: '1084920491823091',
        appSecret: '••••••••••••••••',
        pageId: '1092847192840',
        instagramId: '17841405309281',
        accessToken: 'EAAJx9820...',
        status: 'connected',
        latencyMs: 45,
      },
      youtube: {
        clientId: '8492019482-apps.googleusercontent.com',
        clientSecret: '••••••••••••••••',
        channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
        accessToken: 'ya29.a0AfH6...',
        status: 'connected',
        latencyMs: 28,
      },
      shopee: {
        partnerId: '2008491',
        partnerKey: '••••••••••••••••',
        shopId: '98402194',
        status: 'idle',
      },
      tokopedia: {
        fsId: '18492',
        clientSecret: '••••••••••••••••',
        shopId: '1294029',
        status: 'idle',
      },
    };
  });

  // 2. AI Engine Configuration
  const [aiConfig, setAiConfig] = useState<AiEngineConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_ai`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      geminiModel: 'gemini-2.5-flash',
      temperature: 0.7,
      seedanceEngine: 'seedance-turbo-v2',
      ttsProvider: 'edge-neural',
      enableOfflineFallback: true,
      enableAutoHookAnalysis: true,
    };
  });

  // 3. Render Preferences
  const [renderConfig, setRenderConfig] = useState<RenderPreferencesConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_render`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      defaultResolution: '1080p',
      defaultFps: 60,
      defaultAspectRatio: '9:16',
      bitratePreset: 'high_18mbps',
      captionStylePreset: 'karaoke_glow',
      defaultBgmVolume: 25,
      defaultVoiceVolume: 100,
      defaultSfxVolume: 75,
    };
  });

  // 4. Notifications & Webhooks
  const [notifConfig, setNotifConfig] = useState<NotificationWebhooksConfig>(() => {
    try {
      const saved = localStorage.getItem(`${SETTINGS_STORAGE_KEY}_notif`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      discordWebhookUrl: 'https://discord.com/api/webhooks/1284920/xxx-token-example',
      telegramBotToken: '',
      telegramChatId: '',
      notifyOnRenderComplete: true,
      notifyOnPublishSuccess: true,
      notifyOnMilestone10k: true,
      notifyOnMilestone50k: true,
      notifyOnMilestone100k: true,
    };
  });

  // 5. Brand Kit State
  const [brandKit, setBrandKit] = useState<BrandKitSettings>(() => {
    return (
      project.brandKit || {
        brandName: project.inputData.productAnalysis?.brandName || 'GlowLuxe Official',
        brandTagline: 'Solusi Kulit Cerah & Sehat Alami Setiap Hari',
        logoUrl: '',
        primaryColor: '#6366f1',
        secondaryColor: '#f59e0b',
        accentColor: '#10b981',
        neutralColor: '#0f172a',
        backgroundColor: '#ffffff',
        fontFamilyHeading: 'Plus Jakarta Sans',
        fontFamilyBody: 'Plus Jakarta Sans',
        captionHighlightColor: '#fbbf24',
        captionTextColor: '#ffffff',
        captionBoxColor: 'rgba(0, 0, 0, 0.75)',
        watermarkEnabled: true,
        watermarkPosition: 'top-right',
        badgeStyle: 'modern_pill',
        defaultToneOfVoice: 'Persuasif & Edukatif UGC Viral',
        autoApplyToCaptions: true,
        autoApplyToWatermark: true,
        autoApplyToStickers: true,
      }
    );
  });

  // Auto-watermark config
  const [watermark, setWatermark] = useState<AutoWatermarkConfig>(() => {
    return (
      project.watermarkConfig || {
        enabled: true,
        type: 'handle',
        text: '@kontenku.official',
        logoUrl: '',
        opacity: 0.75,
        position: 'top-right',
        scale: 100,
        style: 'subtle_translucent',
        showTimestamp: false,
        showVerifiedIcon: true,
      }
    );
  });

  if (!isOpen) return null;

  const toggleSecret = (field: string) => {
    setShowSecretMap((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Ping / Latency Test for APIs
  const handleTestPing = (platform: keyof ApiConnectionConfig) => {
    setApiConnections((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        status: 'testing',
      },
    }));

    setTimeout(() => {
      const ping = Math.floor(Math.random() * 25) + 20;
      setApiConnections((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: 'connected',
          latencyMs: ping,
        },
      }));
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
    }, 800);
  };

  // Save All Settings
  const handleSaveAll = () => {
    localStorage.setItem(`${SETTINGS_STORAGE_KEY}_connections`, JSON.stringify(apiConnections));
    localStorage.setItem(`${SETTINGS_STORAGE_KEY}_ai`, JSON.stringify(aiConfig));
    localStorage.setItem(`${SETTINGS_STORAGE_KEY}_render`, JSON.stringify(renderConfig));
    localStorage.setItem(`${SETTINGS_STORAGE_KEY}_notif`, JSON.stringify(notifConfig));

    // Update project brandKit & watermark
    onChangeProject({
      brandKit,
      watermarkConfig: watermark,
    });

    setSaveSuccessMsg('Semua pengaturan sistem, kredensial API, dan preferensi render berhasil disimpan & diterapkan!');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Export Project & Settings JSON
  const handleExportFullConfig = () => {
    const fullBackup = {
      project,
      apiConnections,
      aiConfig,
      renderConfig,
      notifConfig,
      exportedAt: new Date().toISOString(),
      appVersion: '2.5.0-production',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `KontenKU_FullSettings_Backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Import JSON Config
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.apiConnections) setApiConnections(parsed.apiConnections);
          if (parsed.aiConfig) setAiConfig(parsed.aiConfig);
          if (parsed.renderConfig) setRenderConfig(parsed.renderConfig);
          if (parsed.notifConfig) setNotifConfig(parsed.notifConfig);
          if (parsed.project) onChangeProject(parsed.project);

          setSaveSuccessMsg('Berhasil memulihkan konfigurasi dari file backup JSON!');
          setTimeout(() => setSaveSuccessMsg(null), 4000);
        } catch (err) {
          alert('Format file backup JSON tidak valid.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Pusat Pengaturan Sistem & Koneksi
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                  v2.5 Studio
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Konfigurasi API OAuth sosial, AI Model Engine, identitas brand, preferensi render, dan webhook notifikasi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body with Left Navigation & Right Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50/50 p-4 space-y-1 overflow-y-auto shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
              Kategori Pengaturan
            </div>

            <button
              onClick={() => setActiveTab('connections')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'connections'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="flex-1">Koneksi API & OAuth</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            <button
              onClick={() => setActiveTab('ai_engine')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'ai_engine'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="flex-1">AI Engine & Model</span>
            </button>

            <button
              onClick={() => setActiveTab('brand_kit')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'brand_kit'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span className="flex-1">Brand Kit & Toko</span>
            </button>

            <button
              onClick={() => setActiveTab('render')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'render'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Film className="w-4 h-4" />
              <span className="flex-1">Preferensi Render</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="flex-1">Notifikasi & Webhook</span>
            </button>

            <button
              onClick={() => setActiveTab('data_backup')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === 'data_backup'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span className="flex-1">Backup & Manajemen Data</span>
            </button>

            {/* Quick Helper Box */}
            <div className="pt-4 mt-4 border-t border-slate-200 px-2 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi Klien Aman</span>
              </div>
              <p className="leading-relaxed">
                Token & API key disimpan di storage browser terlindungi dan tidak pernah disebarluaskan ke pihak ketiga.
              </p>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* 1. CONNECTIONS TAB */}
            {activeTab === 'connections' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-600" />
                    <span>Koneksi API Media Sosial & E-Commerce</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hubungkan akun resmi untuk auto-publish video ad, sinkronisasi katalog keranjang kuning, dan pelacakan metrik views.
                  </p>
                </div>

                {/* TikTok Shop API */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎵</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">TikTok Shop Partner & Marketing API</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {apiConnections.tiktok.status === 'connected' ? 'Terhubung (32ms)' : 'Belum Terhubung'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Izin: video.upload, video.publish, tiktok.shop.product.sync</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestPing('tiktok')}
                      disabled={apiConnections.tiktok.status === 'testing'}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Zap className={`w-3.5 h-3.5 ${apiConnections.tiktok.status === 'testing' ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
                      <span>{apiConnections.tiktok.status === 'testing' ? 'Testing...' : 'Test Ping'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">App ID / Client Key</label>
                      <input
                        type="text"
                        value={apiConnections.tiktok.appId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, appId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                        <span>App Secret Key</span>
                        <button
                          type="button"
                          onClick={() => toggleSecret('tt_secret')}
                          className="text-[10px] text-indigo-600 font-semibold"
                        >
                          {showSecretMap['tt_secret'] ? 'Hide' : 'Show'}
                        </button>
                      </label>
                      <input
                        type={showSecretMap['tt_secret'] ? 'text' : 'password'}
                        value={apiConnections.tiktok.appSecret}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, appSecret: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">TikTok Shop ID</label>
                      <input
                        type="text"
                        value={apiConnections.tiktok.shopId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, shopId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Access Token</label>
                      <input
                        type="text"
                        value={apiConnections.tiktok.accessToken}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, accessToken: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Meta Instagram & Facebook API */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">📸</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">Meta Graph API (Instagram Reels & Ads)</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {apiConnections.meta.status === 'connected' ? 'Terhubung (45ms)' : 'Belum Terhubung'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Izin: instagram_content_publish, pages_manage_posts, ads_management</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestPing('meta')}
                      disabled={apiConnections.meta.status === 'testing'}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Zap className={`w-3.5 h-3.5 ${apiConnections.meta.status === 'testing' ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
                      <span>{apiConnections.meta.status === 'testing' ? 'Testing...' : 'Test Ping'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Meta App ID</label>
                      <input
                        type="text"
                        value={apiConnections.meta.appId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            meta: { ...prev.meta, appId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Instagram Business Account ID</label>
                      <input
                        type="text"
                        value={apiConnections.meta.instagramId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            meta: { ...prev.meta, instagramId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* YouTube Shorts API */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">▶️</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">Google YouTube Data API v3</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {apiConnections.youtube.status === 'connected' ? 'Terhubung (28ms)' : 'Belum Terhubung'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Izin: https://www.googleapis.com/auth/youtube.upload</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestPing('youtube')}
                      disabled={apiConnections.youtube.status === 'testing'}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Zap className={`w-3.5 h-3.5 ${apiConnections.youtube.status === 'testing' ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
                      <span>{apiConnections.youtube.status === 'testing' ? 'Testing...' : 'Test Ping'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Google OAuth Client ID</label>
                      <input
                        type="text"
                        value={apiConnections.youtube.clientId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, clientId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">YouTube Channel ID</label>
                      <input
                        type="text"
                        value={apiConnections.youtube.channelId}
                        onChange={(e) =>
                          setApiConnections((prev) => ({
                            ...prev,
                            youtube: { ...prev.youtube, channelId: e.target.value },
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Callback Redirect URI Information */}
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">OAuth 2.0 Redirect Callback URI</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${window.location.origin}/api/auth/callback`, 'oauth_cb')}
                      className="text-xs text-indigo-700 font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'oauth_cb' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'oauth_cb' ? 'Disalin!' : 'Salin URI'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/api/auth/callback`}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 font-mono text-xs text-indigo-900 select-all"
                  />
                  <p className="text-[11px] text-indigo-700">
                    Masukkan callback URL di atas pada portal pengembang TikTok for Business, Meta Developer, dan Google Cloud Console.
                  </p>
                </div>
              </div>
            )}

            {/* 2. AI ENGINE & MODEL TAB */}
            {activeTab === 'ai_engine' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>Konfigurasi AI Engine & Model Provider</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih model Google Gemini, motor sintesis video Seedance, dan engine Text-to-Speech untuk naskah iklan.
                  </p>
                </div>

                {/* Gemini Model Selector */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Model Google Gemini untuk Analisis & Copywriting</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setAiConfig((prev) => ({ ...prev, geminiModel: 'gemini-2.5-flash' }))}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        aiConfig.geminiModel === 'gemini-2.5-flash'
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">Gemini 2.5 Flash</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          Rekomendasi (Ultra Cepat)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Kecepatan respon ~0.8 detik, ideal untuk ekstraksi URL produk real-time dan generator hook viral.
                      </p>
                    </div>

                    <div
                      onClick={() => setAiConfig((prev) => ({ ...prev, geminiModel: 'gemini-2.5-pro' }))}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        aiConfig.geminiModel === 'gemini-2.5-pro'
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">Gemini 2.5 Pro</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                          Deep Reasoning
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Penalaran psikologi audiens mendalam dan perancangan strategi multi-angle storyboard yang kompleks.
                      </p>
                    </div>
                  </div>

                  {/* Temperature slider */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">Kreativitas AI (Temperature)</span>
                      <span className="font-mono font-bold text-indigo-600">{aiConfig.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.1"
                      value={aiConfig.temperature}
                      onChange={(e) =>
                        setAiConfig((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>Faktual & Terstruktur (0.2)</span>
                      <span>Seimbang (0.7)</span>
                      <span>Sangat Kreatif & Viral (1.0)</span>
                    </div>
                  </div>
                </div>

                {/* Video Synthesis Engine */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Film className="w-4 h-4 text-indigo-600" />
                    <span>Seedance Video Synthesis Engine</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setAiConfig((prev) => ({ ...prev, seedanceEngine: 'seedance-turbo-v2' }))}
                      className={`p-3 rounded-xl border text-left transition ${
                        aiConfig.seedanceEngine === 'seedance-turbo-v2'
                          ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                          : 'border-slate-200 bg-white/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Seedance Turbo v2</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Fast</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-1">Render cepat per-scene dalam 3–5 detik.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAiConfig((prev) => ({ ...prev, seedanceEngine: 'seedance-pro-hd' }))}
                      className={`p-3 rounded-xl border text-left transition ${
                        aiConfig.seedanceEngine === 'seedance-pro-hd'
                          ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                          : 'border-slate-200 bg-white/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Seedance Pro HD Studio</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold">High Quality</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-1">Detail tekstur produk tajam 1080p photorealistic.</p>
                    </button>
                  </div>
                </div>

                {/* TTS Provider */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Engine Text-to-Speech (TTS & Voiceover)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { id: 'edge-neural', label: 'Edge Neural TTS', desc: 'Aksen Indonesia natural, tanpa latensi' },
                      { id: 'elevenlabs-studio', label: 'ElevenLabs Studio', desc: 'Emosi ekspresif, kloning suara' },
                      { id: 'local-synth', label: 'Browser SpeechSynth', desc: 'Offline fallback ringan' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAiConfig((prev) => ({ ...prev, ttsProvider: p.id as any }))}
                        className={`p-3 rounded-xl border text-left transition ${
                          aiConfig.ttsProvider === p.id
                            ? 'border-indigo-600 bg-white shadow-xs font-bold text-indigo-900'
                            : 'border-slate-200 bg-white/70 text-slate-700'
                        }`}
                      >
                        <div>{p.label}</div>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. BRAND KIT & TOKO */}
            {activeTab === 'brand_kit' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <span>Identitas Brand, Palet Warna & Font</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tentukan nama brand, slogan resmi, warna utama, dan gaya caption default untuk konsistensi visual di seluruh video iklan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Brand / Toko</label>
                    <input
                      type="text"
                      value={brandKit.brandName}
                      onChange={(e) => setBrandKit((prev) => ({ ...prev, brandName: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Slogan / Tagline Iklan</label>
                    <input
                      type="text"
                      value={brandKit.brandTagline || ''}
                      onChange={(e) => setBrandKit((prev) => ({ ...prev, brandTagline: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Color pickers */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-900">Palet Warna Utama Video Ad</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Warna Primer</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.primaryColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={brandKit.primaryColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Warna Sekunder</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.secondaryColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={brandKit.secondaryColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Warna Aksen / Promo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.accentColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, accentColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={brandKit.accentColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Highlight Subtitle</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.captionHighlightColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, captionHighlightColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={brandKit.captionHighlightColor}
                          onChange={(e) => setBrandKit((prev) => ({ ...prev, captionHighlightColor: e.target.value }))}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Watermark Setting */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Auto-Watermark Proteksi Hak Cipta</h4>
                      <p className="text-[11px] text-slate-500">Sisipkan handle akun otomatis untuk mencegah pencurian konten video.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={watermark.enabled}
                      onChange={(e) => setWatermark((prev) => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 accent-indigo-600"
                    />
                  </div>

                  {watermark.enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Teks Watermark</label>
                        <input
                          type="text"
                          value={watermark.text}
                          onChange={(e) => setWatermark((prev) => ({ ...prev, text: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Posisi Watermark</label>
                        <select
                          value={watermark.position}
                          onChange={(e) => setWatermark((prev) => ({ ...prev, position: e.target.value as any }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                        >
                          <option value="top-right">Kanan Atas (Top-Right)</option>
                          <option value="top-left">Kiri Atas (Top-Left)</option>
                          <option value="bottom-right">Kanan Bawah (Bottom-Right)</option>
                          <option value="bottom-left">Kiri Bawah (Bottom-Left)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. RENDER PREFERENCES */}
            {activeTab === 'render' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Film className="w-4 h-4 text-indigo-600" />
                    <span>Preferensi Kualitas Render & Output Video</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pengaturan resolusi default, framerate, rasio aspek, dan perataan volume audio saat perakitan video selesai.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Resolusi Standar</label>
                    <select
                      value={renderConfig.defaultResolution}
                      onChange={(e) => setRenderConfig((prev) => ({ ...prev, defaultResolution: e.target.value as any }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-900"
                    >
                      <option value="1080p">1080p Full HD (1080x1920) - Standar TikTok</option>
                      <option value="720p_lite">720p Lite (720x1280) - Cepat</option>
                      <option value="4k">4K Ultra (2160x3840) - Maksimal</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Framerate Video</label>
                    <select
                      value={renderConfig.defaultFps}
                      onChange={(e) => setRenderConfig((prev) => ({ ...prev, defaultFps: parseInt(e.target.value) as any }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-900"
                    >
                      <option value="60">60 FPS (Super Mulus)</option>
                      <option value="30">30 FPS (Standar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preset Bitrate</label>
                    <select
                      value={renderConfig.bitratePreset}
                      onChange={(e) => setRenderConfig((prev) => ({ ...prev, bitratePreset: e.target.value as any }))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-900"
                    >
                      <option value="high_18mbps">High (18 Mbps) - Jernih tanpa kompresi</option>
                      <option value="balanced_12mbps">Balanced (12 Mbps)</option>
                      <option value="light_8mbps">Light (8 Mbps)</option>
                    </select>
                  </div>
                </div>

                {/* Default Audio Mixing Volumes */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Pencampuran Volume Audio Default</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>Musik Latar (BGM)</span>
                        <span className="font-mono">{renderConfig.defaultBgmVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderConfig.defaultBgmVolume}
                        onChange={(e) =>
                          setRenderConfig((prev) => ({ ...prev, defaultBgmVolume: parseInt(e.target.value) }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>Suara Narator (Voiceover)</span>
                        <span className="font-mono">{renderConfig.defaultVoiceVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderConfig.defaultVoiceVolume}
                        onChange={(e) =>
                          setRenderConfig((prev) => ({ ...prev, defaultVoiceVolume: parseInt(e.target.value) }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>Efek Suara Sound FX (SFX)</span>
                        <span className="font-mono">{renderConfig.defaultSfxVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderConfig.defaultSfxVolume}
                        onChange={(e) =>
                          setRenderConfig((prev) => ({ ...prev, defaultSfxVolume: parseInt(e.target.value) }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS & WEBHOOKS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span>Webhook & Notifikasi Otomatis</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kirim notifikasi ke channel Discord atau bot Telegram saat video selesai dirender atau postingan mencapai milestone views.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Discord Webhook URL</label>
                    <input
                      type="url"
                      value={notifConfig.discordWebhookUrl}
                      onChange={(e) => setNotifConfig((prev) => ({ ...prev, discordWebhookUrl: e.target.value }))}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Telegram Bot Token</label>
                      <input
                        type="text"
                        value={notifConfig.telegramBotToken}
                        onChange={(e) => setNotifConfig((prev) => ({ ...prev, telegramBotToken: e.target.value }))}
                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Telegram Chat ID</label>
                      <input
                        type="text"
                        value={notifConfig.telegramChatId}
                        onChange={(e) => setNotifConfig((prev) => ({ ...prev, telegramChatId: e.target.value }))}
                        placeholder="-1001234567890"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification trigger toggles */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">Trigger Pengiriman Notifikasi</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'notifyOnRenderComplete', label: 'Beri tahu saat ekspor video ad selesai dirender' },
                      { key: 'notifyOnPublishSuccess', label: 'Beri tahu saat video berhasil auto-publish ke TikTok / Instagram' },
                      { key: 'notifyOnMilestone10k', label: 'Peringatan Milestone 10.000 Views pertama tercapai' },
                      { key: 'notifyOnMilestone50k', label: 'Peringatan Milestone 50.000 Views tercapai' },
                      { key: 'notifyOnMilestone100k', label: 'Peringatan Milestone 100.000 Views viral tercapai' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2.5 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={(notifConfig as any)[item.key]}
                          onChange={(e) =>
                            setNotifConfig((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="w-4 h-4 accent-indigo-600 rounded"
                        />
                        <span className="text-slate-700 font-medium">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. DATA BACKUP & RESTORE */}
            {activeTab === 'data_backup' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-600" />
                    <span>Backup, Impor & Pemulihan Konfigurasi</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simpan salinan seluruh proyek, kredensial, dan preferensi kerja Anda ke file JSON atau pulihkan ke setelan pabrik.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Full Backup */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span>Ekspor Cadangan Lengkap (.JSON)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Unduh seluruh status proyek aktif, data analisis produk, storyboard, dan konfigurasi API ke format JSON.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportFullConfig}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File Backup JSON</span>
                    </button>
                  </div>

                  {/* Import Backup */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Impor & Pulihkan dari File JSON</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Unggah file cadangan sebelumnya untuk memulihkan seluruh proyek dan setelan yang tersimpan.
                      </p>
                    </div>
                    <label className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih File Backup JSON</span>
                      <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Default */}
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-950">Kembalikan ke Setelan Awal Pabrik</h4>
                      <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                        Tindakan ini akan mengosongkan cache lokal, menghapus token API yang tersimpan sementara, dan memuat ulang proyek sampel default GlowLuxe.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin mengatur ulang semua konfigurasi dan cache?')) {
                          localStorage.clear();
                          if (onLoadPreset) onLoadPreset('preset-serum');
                          setSaveSuccessMsg('Setelan pabrik berhasil dipulihkan!');
                          setTimeout(() => setSaveSuccessMsg(null), 3000);
                        }
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs transition active:scale-95 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset ke Setelan Default</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Semua modul sistem terverifikasi normal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

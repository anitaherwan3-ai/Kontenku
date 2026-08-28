import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  Trash2,
  Edit3,
  Copy,
  ChevronRight,
  TrendingUp,
  Share2,
  RefreshCw,
  Sliders,
  Check,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PippitProject, ScheduledPost, ConnectedSocialAccount, AdPlatform, UploadHistoryItem } from '../../types';

interface ContentSchedulingSectionProps {
  project: PippitProject;
  onChangeProject: (patch: Partial<PippitProject>) => void;
  onPostPublished?: (historyItem: UploadHistoryItem) => void;
}

// Prime-Time Slot Presets by Platform
interface PrimeTimeSlot {
  id: string;
  time: string; // e.g. "19:30"
  label: string;
  trafficBoost: string; // e.g. "+94% Traffic"
  description: string;
  peakCategory: string;
  iconType: 'flame' | 'star' | 'sun' | 'moon';
}

const PRIME_TIME_PRESETS: Record<AdPlatform, PrimeTimeSlot[]> = {
  tiktok: [
    {
      id: 'tt-prime-1',
      time: '19:30',
      label: 'Prime-Time Malam (Puncak Live & FYP)',
      trafficBoost: '+94% Engagement',
      description: 'Waktu santai pengguna setelah makan malam, algoritma TikTok Shop mendorong konten katalog keranjang kuning secara maksimal.',
      peakCategory: 'Beauty, Fashion & Gadget',
      iconType: 'flame'
    },
    {
      id: 'tt-prime-2',
      time: '12:15',
      label: 'Lunch Break & Flash Sale Siang',
      trafficBoost: '+68% CTR',
      description: 'Jam istirahat kantor/kampus, audiens aktif scroll konten unboxing cepat dan promo diskon terbatas.',
      peakCategory: 'F&B, Skincare & Lifestyle',
      iconType: 'sun'
    },
    {
      id: 'tt-prime-3',
      time: '21:00',
      label: 'Late-Night Impulse Buying',
      trafficBoost: '+82% Checkout',
      description: 'Puncak pembelian impulsif keranjang kuning sebelum tidur. Konversi checkout tertinggi di kategori skincare.',
      peakCategory: 'Self-care & Night Routine',
      iconType: 'moon'
    }
  ],
  instagram: [
    {
      id: 'ig-prime-1',
      time: '20:15',
      label: 'Reels Explore Prime Evening',
      trafficBoost: '+88% Views',
      description: 'Algoritma Instagram Reels memprioritaskan video estetis dengan save & share rate tinggi di jam santai malam.',
      peakCategory: 'Lifestyle, Aesthetics & Tutorial',
      iconType: 'flame'
    },
    {
      id: 'ig-prime-2',
      time: '17:30',
      label: 'Commute Hours (Pulang Kerja)',
      trafficBoost: '+72% Engagement',
      description: 'Audiens mengecek feed dan story saat dalam perjalanan pulang atau menunggu transportasi.',
      peakCategory: 'Short Tips & Transformation',
      iconType: 'sun'
    },
    {
      id: 'ig-prime-3',
      time: '08:30',
      label: 'Morning Mood Booster',
      trafficBoost: '+54% Saves',
      description: 'Waktu inspirasi pagi hari, cocok untuk konten rutinitas harian dan quotes inspiratif produk.',
      peakCategory: 'Morning Routine & Wellness',
      iconType: 'sun'
    }
  ],
  facebook: [
    {
      id: 'fb-prime-1',
      time: '19:00',
      label: 'Family & Community Evening',
      trafficBoost: '+77% Conversions',
      description: 'Audiens dewasa 25-45 tahun aktif membaca deskripsi lengkap dan mengklik link website resmi/katalog toko.',
      peakCategory: 'Family Care, Household & BPOM Products',
      iconType: 'flame'
    },
    {
      id: 'fb-prime-2',
      time: '11:00',
      label: 'Midday Coffee Break Ads',
      trafficBoost: '+65% Link Clicks',
      description: 'Traffic stabil untuk kampanye Advantage+ Ads dengan format video carousel dan testimoni medis.',
      peakCategory: 'Health & Professional Care',
      iconType: 'sun'
    },
    {
      id: 'fb-prime-3',
      time: '15:30',
      label: 'Afternoon Tea Scroll',
      trafficBoost: '+58% Engagement',
      description: 'Waktu jeda kerja sore, interaksi grup dan kolom komentar Facebook Page mengalami kenaikan.',
      peakCategory: 'Community Reviews & Discussions',
      iconType: 'sun'
    }
  ],
  youtube_shorts: [
    {
      id: 'yt-prime-1',
      time: '18:00',
      label: 'YouTube Shorts Prime Evening',
      trafficBoost: '+91% Retention',
      description: 'Waktu penonton aktif mengecek feed Shorts di aplikasi mobile YouTube.',
      peakCategory: 'Product Breakdown & Deep Dive',
      iconType: 'flame'
    },
    {
      id: 'yt-prime-2',
      time: '12:00',
      label: 'Lunch Hour Shorts Browse',
      trafficBoost: '+64% Subscribers',
      description: 'Penonton mencari ringkasan video pendek saat jam makan siang.',
      peakCategory: 'Tutorial & Skit',
      iconType: 'sun'
    }
  ]
};

export const ContentSchedulingSection: React.FC<ContentSchedulingSectionProps> = ({
  project,
  onChangeProject,
  onPostPublished
}) => {
  const connectedAccounts = project.connectedAccounts || [];
  const scheduledPosts = project.scheduledPosts || [];

  // Form State
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('tiktok');
  const [targetAccountId, setTargetAccountId] = useState<string>(
    connectedAccounts.find((a) => a.platform === selectedPlatform)?.id || connectedAccounts[0]?.id || 'acc-tt-1'
  );
  
  // Date & Time state (Default to today's date)
  const todayStr = '2026-08-28';
  const tomorrowStr = '2026-08-29';
  const dayAfterStr = '2026-08-30';

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('19:30');
  const [timezone, setTimezone] = useState<string>('WIB');
  const [autoPublishToggle, setAutoPublishToggle] = useState<boolean>(true);
  const [customCaption, setCustomCaption] = useState<string>(
    scheduledPosts.find((p) => p.platform === selectedPlatform)?.caption ||
    'Beneran gak nyangka hasilnya sebagus ini! Yang punya masalah bekas jerawat item wajib cobain mumpung diskon 45%! #GlowLuxe #SerumViral #FYP'
  );
  const [videoVariant, setVideoVariant] = useState<string>('9:16 Vertical (1080p H.264)');
  const [isPublishingDirectly, setIsPublishingDirectly] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Switch platform and auto-select appropriate account and prime-time
  const handlePlatformChange = (platform: AdPlatform) => {
    setSelectedPlatform(platform);
    const matchedAccount = connectedAccounts.find((a) => a.platform === platform);
    if (matchedAccount) {
      setTargetAccountId(matchedAccount.id);
    }
    const defaultPrime = PRIME_TIME_PRESETS[platform][0].time;
    setSelectedTime(defaultPrime);

    const matchedPost = scheduledPosts.find((p) => p.platform === platform);
    if (matchedPost) {
      setCustomCaption(matchedPost.caption);
    }
  };

  // Apply Prime-Time preset directly
  const handleApplyPrimeTime = (slot: PrimeTimeSlot) => {
    setSelectedTime(slot.time);
    showToast(`⏰ Jam Prime-Time ${slot.time} ${timezone} (${slot.label}) berhasil diterapkan!`);
  };

  // Handle Save / Add Schedule
  const handleSaveSchedule = () => {
    const targetAccount = connectedAccounts.find((a) => a.id === targetAccountId);
    const formattedScheduleString = `${selectedDate} ${selectedTime} ${timezone}`;
    
    // Find prime tag
    const matchedPrime = PRIME_TIME_PRESETS[selectedPlatform].find((p) => p.time === selectedTime);
    const primeTag = matchedPrime
      ? `${selectedPlatform.toUpperCase()} Prime: ${matchedPrime.time} ${timezone}`
      : `Kustom: ${selectedTime} ${timezone}`;

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      platform: selectedPlatform,
      scheduledTime: formattedScheduleString,
      scheduledDate: selectedDate,
      scheduledTimeOnly: selectedTime,
      caption: customCaption,
      hashtags: ['#GlowLuxe', '#Viral', '#FYP', '#PromoSpesial'],
      status: 'scheduled',
      targetAudienceName: `${selectedPlatform.toUpperCase()} Audiens Tersegmentasi`,
      thumbnailUrl: project.storyboard[0]?.visualUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      accountId: targetAccount?.id || targetAccountId,
      accountHandle: targetAccount?.accountHandle || `@${selectedPlatform}.official`,
      primeTimeTag: primeTag,
      autoPublishEnabled: autoPublishToggle,
      videoVariant: videoVariant
    };

    // Filter out existing post for same platform if replacing or append
    const existingIndex = scheduledPosts.findIndex(
      (p) => p.platform === selectedPlatform && p.accountId === targetAccountId
    );

    let updatedList: ScheduledPost[];
    if (existingIndex >= 0) {
      updatedList = [...scheduledPosts];
      updatedList[existingIndex] = newPost;
    } else {
      updatedList = [newPost, ...scheduledPosts];
    }

    onChangeProject({ scheduledPosts: updatedList });
    showToast(`✅ Jadwal postingan untuk ${targetAccount?.accountHandle || selectedPlatform} berhasil disimpan untuk ${formattedScheduleString}!`);
  };

  // Immediate Publish from Queue
  const handlePublishNow = (post: ScheduledPost) => {
    setIsPublishingDirectly(post.id);
    const targetAcc = connectedAccounts.find((a) => a.id === post.accountId) || connectedAccounts[0];

    setTimeout(() => {
      // Update post status to published
      const updatedList = scheduledPosts.map((p) =>
        p.id === post.id ? { ...p, status: 'published' as const } : p
      );

      // Create a history item
      const newHistoryItem: UploadHistoryItem = {
        id: `hist-${Date.now()}`,
        projectId: project.id,
        postTitle: `${project.inputData.productAnalysis?.productName || 'Produk'} - ${post.platform.toUpperCase()}`,
        platform: post.platform,
        accountId: targetAcc?.id || 'acc-tt-1',
        accountName: targetAcc?.accountName || 'Akun Resmi',
        accountHandle: targetAcc?.accountHandle || '@official',
        avatarUrl: targetAcc?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }) + ' WIB',
        status: 'success',
        postUrl:
          post.platform === 'tiktok'
            ? `https://www.tiktok.com/${targetAcc?.accountHandle || '@glowluxe'}/video/${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
            : post.platform === 'instagram'
            ? `https://www.instagram.com/reel/C${Math.random().toString(36).substring(2, 9)}/`
            : `https://www.facebook.com/watch/?v=${Math.floor(100000000000000 + Math.random() * 900000000000000)}`,
        videoVariant: post.videoVariant || '9:16 Vertical 1080p (MP4)',
        captionPreview: post.caption,
        hashtags: post.hashtags,
        shopTagActive: true,
        stats: {
          views: 1200,
          likes: 95,
          comments: 12,
          shares: 28,
          cartClicks: 45
        }
      };

      const updatedHistory = [newHistoryItem, ...(project.uploadHistory || [])];

      onChangeProject({
        scheduledPosts: updatedList,
        uploadHistory: updatedHistory
      });

      if (onPostPublished) {
        onPostPublished(newHistoryItem);
      }

      setIsPublishingDirectly(null);
      showToast(`🚀 Konten berhasil diunggah langsung ke ${targetAcc?.accountHandle || post.platform}!`);
    }, 1200);
  };

  // Delete from Queue
  const handleDeletePost = (id: string) => {
    const updated = scheduledPosts.filter((p) => p.id !== id);
    onChangeProject({ scheduledPosts: updated });
    showToast('🗑️ Jadwal postingan telah dihapus dari antrean.');
  };

  // Toggle Auto-publish on scheduled post
  const handleToggleAutoPublish = (id: string) => {
    const updated = scheduledPosts.map((p) =>
      p.id === id ? { ...p, autoPublishEnabled: !p.autoPublishEnabled } : p
    );
    onChangeProject({ scheduledPosts: updated });
  };

  const currentPlatformAccounts = connectedAccounts.filter((a) => a.platform === selectedPlatform);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <Clock className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Automated Prime-Time Scheduler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Penjadwalan Konten Otomatis & Jam Prime-Time
          </h2>
          <p className="text-sm text-indigo-200/90 leading-relaxed">
            Atur waktu tayang terbaik per platform menggunakan algoritma rekomendasi jam ramai penonton. Konten akan otomatis diunggah ke TikTok Shop, IG Reels, dan FB Ads tanpa perlu upload manual.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              🌙
            </div>
            <div>
              <div className="text-xs font-bold text-white">TikTok Peak: 19:30 WIB</div>
              <div className="text-[11px] text-emerald-300 font-semibold">+94% Lonjakan Live Shop</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
              ⭐
            </div>
            <div>
              <div className="text-xs font-bold text-white">IG Reels Peak: 20:15 WIB</div>
              <div className="text-[11px] text-pink-300 font-semibold">+88% Explore Distribution</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              💼
            </div>
            <div>
              <div className="text-xs font-bold text-white">FB Ads Peak: 19:00 WIB</div>
              <div className="text-[11px] text-blue-300 font-semibold">+77% Purchase Intent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Schedule Form & Prime Presets, Right Active Schedule Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT CONFIGURATION PANEL (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
            
            {/* Step 1: Platform Picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>1. Pilih Platform & Akun Target</span>
              </label>

              {/* Platform Pills */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePlatformChange('tiktok')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedPlatform === 'tiktok'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>🎵</span> TikTok
                    </span>
                    {selectedPlatform === 'tiktok' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Video 9:16 + Keranjang</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformChange('instagram')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedPlatform === 'instagram'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>📸</span> IG Reels
                    </span>
                    {selectedPlatform === 'instagram' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Reels Feed + Tag Produk</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlatformChange('facebook')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedPlatform === 'facebook'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      <span>📘</span> Facebook
                    </span>
                    {selectedPlatform === 'facebook' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Advantage+ Ads & Page</span>
                </button>
              </div>

              {/* Target Account Selector */}
              {currentPlatformAccounts.length > 0 ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        currentPlatformAccounts.find((a) => a.id === targetAccountId)?.avatarUrl ||
                        currentPlatformAccounts[0]?.avatarUrl
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {currentPlatformAccounts.find((a) => a.id === targetAccountId)?.accountName ||
                          currentPlatformAccounts[0]?.accountName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {currentPlatformAccounts.find((a) => a.id === targetAccountId)?.accountHandle ||
                          currentPlatformAccounts[0]?.accountHandle} • {currentPlatformAccounts[0]?.followersCount} Follower
                      </div>
                    </div>
                  </div>

                  <select
                    value={targetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shrink-0"
                  >
                    {currentPlatformAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountHandle} ({acc.brandTag || acc.accountType})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-semibold">
                  Belum ada akun {selectedPlatform.toUpperCase()} yang terhubung. Hubungkan akun di tab Multi-Akun.
                </div>
              )}
            </div>

            {/* Step 2: Prime-Time Presets Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>2. Rekomendasi Jam Prime-Time ({selectedPlatform.toUpperCase()})</span>
                </label>
                <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                  AI Traffic Engine
                </span>
              </div>

              <div className="space-y-2.5">
                {PRIME_TIME_PRESETS[selectedPlatform].map((slot) => {
                  const isSelectedTime = selectedTime === slot.time;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleApplyPrimeTime(slot)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelectedTime
                          ? 'border-amber-500 bg-amber-50/50 shadow-2xs ring-2 ring-amber-400/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-extrabold text-xs">
                            {slot.time} {timezone}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{slot.label}</span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {slot.trafficBoost}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
                          {slot.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 self-start sm:self-center ${
                          isSelectedTime
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelectedTime ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Terpilih</span>
                          </>
                        ) : (
                          <>
                            <span>Terapkan</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Date & Custom Time Picker */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>3. Pemilih Tanggal & Waktu Tayang Fleksibel</span>
              </label>

              {/* Quick Date Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedDate === todayStr
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Hari Ini (28 Agu)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedDate === tomorrowStr
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Besok (29 Agu)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(dayAfterStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedDate === dayAfterStr
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Lusa (30 Agu)
                </button>
              </div>

              {/* Custom Date and Time Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                    Tanggal Penayangan
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                    Jam & Menit
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                    Zona Waktu
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="WIB">WIB (Jakarta, GMT+7)</option>
                    <option value="WITA">WITA (Bali, Makassar, GMT+8)</option>
                    <option value="WIT">WIT (Papua, GMT+9)</option>
                  </select>
                </div>
              </div>

              {/* Countdown Preview Banner */}
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-900 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Jadwal Terpilih: <strong className="font-extrabold">{selectedDate} pukul {selectedTime} {timezone}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0">
                  ⚡ Auto-Publish Aktif
                </span>
              </div>
            </div>

            {/* Step 4: Caption & Video Variant */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>4. Caption & Format Video Varian</span>
              </label>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Varian Format Video
                </label>
                <select
                  value={videoVariant}
                  onChange={(e) => setVideoVariant(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="9:16 Vertical (1080p H.264)">9:16 Vertikal - 1080p H.264 (TikTok & IG Reels)</option>
                  <option value="1:1 Square (1080p H.264)">1:1 Kotak - 1080p H.264 (Facebook Carousel & IG Feed)</option>
                  <option value="16:9 Landscape (1080p H.264)">16:9 Lanskap - 1080p (YouTube & Website)</option>
                  <option value="9:16 Vertical (4K UltraHD MOV)">9:16 Vertikal - 4K UltraHD MOV (Master)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Caption Postingan
                </label>
                <textarea
                  rows={3}
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed resize-none font-medium"
                />
              </div>

              {/* Auto Publish Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Eksekusi Auto-Publish Cloud Server
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Otomatis panggil API platform saat jam penayangan tiba tanpa perlu konfirmasi manual.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPublishToggle}
                  onChange={(e) => setAutoPublishToggle(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                id="btn-save-schedule-action"
                type="button"
                onClick={handleSaveSchedule}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-200 transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Simpan Jadwal Postingan ({selectedDate} @ {selectedTime} {timezone})</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT SCHEDULE QUEUE & LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Antrean Terjadwal ({scheduledPosts.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar konten yang siap tayang otomatis di jam prime-time.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live Queue
              </span>
            </div>

            {/* Scheduled Posts List */}
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Belum Ada Jadwal Antrean</div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Gunakan form di sebelah kiri untuk memilih platform, jam prime-time, dan simpan jadwal konten pertama Anda.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                {scheduledPosts.map((post) => {
                  const targetAcc = connectedAccounts.find((a) => a.id === post.accountId) || connectedAccounts[0];
                  const isPublishingThis = isPublishingDirectly === post.id;
                  const isPublished = post.status === 'published';

                  return (
                    <div
                      key={post.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        isPublished
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Top Header of Item */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={targetAcc?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {post.accountHandle || targetAcc?.accountHandle || `@${post.platform}.official`}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                {post.platform}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {post.videoVariant || '9:16 Vertical 1080p'}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Terbit</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 shrink-0">
                            <Clock className="w-3 h-3 text-indigo-600" />
                            <span>Terjadwal</span>
                          </span>
                        )}
                      </div>

                      {/* Scheduled Time Banner */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{post.scheduledTime}</span>
                        </div>
                        {post.primeTimeTag && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate max-w-[140px]">
                            {post.primeTimeTag}
                          </span>
                        )}
                      </div>

                      {/* Caption Snippet */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-white p-2 rounded-lg border border-slate-100">
                        {post.caption}
                      </p>

                      {/* Item Bottom Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={post.autoPublishEnabled !== false}
                            onChange={() => handleToggleAutoPublish(post.id)}
                            className="w-3.5 h-3.5 text-indigo-600 rounded"
                          />
                          <span>Auto-Publish</span>
                        </label>

                        <div className="flex items-center gap-1.5">
                          {!isPublished && (
                            <button
                              type="button"
                              onClick={() => handlePublishNow(post)}
                              disabled={isPublishingThis}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 disabled:opacity-50"
                              title="Unggah langsung sekarang tanpa menunggu jadwal"
                            >
                              {isPublishingThis ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin text-white" />
                                  <span>Mengunggah...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3" />
                                  <span>Publish Sekarang</span>
                                </>
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Info Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tips Algoritma Penjadwalan 2026:</span>
              </div>
              <p>
                Menjadwalkan video 15-30 menit sebelum jam prime-time memungkinkan sistem CDN TikTok dan Meta melakukan transkoding resolusi HD terlebih dahulu sehingga video langsung masuk feed For You tepat di menit puncak.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

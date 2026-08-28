import React, { useState, useMemo } from 'react';
import {
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Download,
  Trash2,
  Share2,
  TrendingUp,
  Eye,
  ShoppingBag,
  Heart,
  MessageSquare,
  Sparkles,
  Terminal,
  Code,
  X,
  AlertTriangle,
  RotateCcw,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PippitProject, UploadHistoryItem, AdPlatform } from '../../types';

interface UploadHistorySectionProps {
  project: PippitProject;
  onChangeProject: (patch: Partial<PippitProject>) => void;
}

export const UploadHistorySection: React.FC<UploadHistorySectionProps> = ({
  project,
  onChangeProject
}) => {
  const historyList = project.uploadHistory || [];

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'scheduled' | 'processing'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | AdPlatform>('all');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDiagnosticItem, setSelectedDiagnosticItem] = useState<UploadHistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered list computation
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      // Search match
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.captionPreview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.errorCode && item.errorCode.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status match
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      // Platform match
      const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [historyList, searchQuery, statusFilter, platformFilter]);

  // Aggregate Stats
  const totalCount = historyList.length;
  const successCount = historyList.filter((h) => h.status === 'success').length;
  const failedCount = historyList.filter((h) => h.status === 'failed').length;
  const totalViews = historyList.reduce((acc, curr) => acc + (curr.stats?.views || 0), 0);
  const totalCartClicks = historyList.reduce((acc, curr) => acc + (curr.stats?.cartClicks || 0), 0);

  // Copy Post URL
  const handleCopyUrl = (item: UploadHistoryItem) => {
    if (item.postUrl) {
      navigator.clipboard.writeText(item.postUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
      showToast('📋 Link postingan berhasil disalin ke clipboard!');
    }
  };

  // Retry Failed Upload
  const handleRetryUpload = (item: UploadHistoryItem) => {
    setRetryingId(item.id);

    // Simulate real retry via platform API
    setTimeout(() => {
      const newPostUrl =
        item.platform === 'tiktok'
          ? `https://www.tiktok.com/${item.accountHandle}/video/${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`
          : item.platform === 'instagram'
          ? `https://www.instagram.com/reel/C${Math.random().toString(36).substring(2, 9)}/`
          : `https://www.facebook.com/watch/?v=${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;

      const updated = historyList.map((h) => {
        if (h.id === item.id) {
          return {
            ...h,
            status: 'success' as const,
            timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }) + ' WIB',
            postUrl: newPostUrl,
            errorCode: undefined,
            errorMessage: undefined,
            retryCount: (h.retryCount || 0) + 1,
            stats: {
              views: 850,
              likes: 64,
              comments: 8,
              shares: 19,
              cartClicks: 32
            }
          };
        }
        return h;
      });

      onChangeProject({ uploadHistory: updated });
      setRetryingId(null);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(`🎉 Berhasil mengunggah ulang ke ${item.accountHandle}! Status berubah menjadi Sukses.`);
    }, 1500);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Platform', 'Akun', 'Waktu', 'Status', 'Judul', 'Link', 'Kode Error', 'Pesan Error', 'Views', 'Klik Keranjang'];
    const rows = historyList.map((h) => [
      `"${h.id}"`,
      `"${h.platform}"`,
      `"${h.accountHandle}"`,
      `"${h.timestamp}"`,
      `"${h.status}"`,
      `"${h.postTitle.replace(/"/g, '""')}"`,
      `"${h.postUrl || ''}"`,
      `"${h.errorCode || ''}"`,
      `"${(h.errorMessage || '').replace(/"/g, '""')}"`,
      h.stats?.views || 0,
      h.stats?.cartClicks || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riwayat-distribusi-${project.id}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📊 Log riwayat berhasil diunduh dalam format CSV.');
  };

  // Clear single history item
  const handleDeleteItem = (id: string) => {
    const updated = historyList.filter((h) => h.id !== id);
    onChangeProject({ uploadHistory: updated });
    showToast('🗑️ Entri riwayat telah dihapus.');
  };

  // Add dummy test log
  const handleAddTestLog = (status: 'success' | 'failed') => {
    const testItem: UploadHistoryItem = {
      id: `hist-${Date.now()}`,
      projectId: project.id,
      postTitle: `Campaign UGC ${status === 'success' ? 'Review GlowLuxe' : 'Flash Sale Video'}`,
      platform: 'tiktok',
      accountId: 'acc-tt-1',
      accountName: 'GlowLuxe Official TikTok Shop',
      accountHandle: '@glowluxe.official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }) + ' WIB',
      status: status,
      postUrl: status === 'success' ? 'https://www.tiktok.com/@glowluxe.official/video/73919928301928' : undefined,
      videoVariant: '9:16 Vertical 1080p (MP4)',
      captionPreview: 'Promo terbatas beli 1 dapat 2 hanya saat live hari ini! Cek keranjang kuning sekarang.',
      hashtags: ['#SerumViral', '#DiskonGila'],
      shopTagActive: true,
      errorCode: status === 'failed' ? 'TIKTOK_API_RATE_LIMIT_EXCEEDED' : undefined,
      errorMessage: status === 'failed' ? 'Batas kuota unggahan API TikTok Shop tercapai untuk hari ini. Coba kembali dalam 15 menit.' : undefined,
      stats: status === 'success' ? { views: 3400, likes: 290, comments: 24, shares: 62, cartClicks: 110 } : undefined
    };

    onChangeProject({ uploadHistory: [testItem, ...historyList] });
    showToast(`📝 Entri log uji coba (${status.toUpperCase()}) ditambahkan.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header with Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Unggahan</span>
            <History className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[10px] text-slate-500 font-semibold">Seluruh Multi-Akun</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sukses Terbit</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">{successCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            {totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}% Sukses Rate
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Gagal / Perlu Aksi</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-700">{failedCount}</div>
          <div className="text-[10px] text-rose-600 font-semibold">
            {failedCount > 0 ? 'Tersedia tombol Retry' : 'Semua Berjalan Lancar'}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Tayangan (Views)</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-indigo-700 font-semibold">Akumulasi Post Aktif</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Klik Keranjang</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700">
            {totalCartClicks.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-800 font-semibold">Konversi TikTok & IG Shop</div>
        </div>
      </div>

      {/* Main Table & Filter Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm">
        
        {/* Top Control Bar: Search & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>Log Riwayat Distribusi Multi-Akun (Upload History)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Audit lengkap keberhasilan dan kegagalan unggahan ke akun TikTok Shop, IG Reels, dan FB Pages beserta kode diagnostik API.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl transition shadow-2xs"
              title="Unduh riwayat unggahan ke format CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => handleAddTestLog('failed')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl transition"
              title="Simulasi penambahan log gagal untuk uji coba fitur retry"
            >
              <span>+ Simulasi Gagal</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box (6 cols) */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, caption, handle akun, atau error code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">Semua Status ({historyList.length})</option>
              <option value="success">✅ Sukses Terbit ({successCount})</option>
              <option value="failed">❌ Gagal Upload ({failedCount})</option>
              <option value="scheduled">📅 Terjadwal</option>
              <option value="processing">⏳ Diproses</option>
            </select>
          </div>

          {/* Platform Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">Semua Platform</option>
              <option value="tiktok">🎵 TikTok Shop</option>
              <option value="instagram">📸 Instagram Reels</option>
              <option value="facebook">📘 Facebook Pages / Ads</option>
            </select>
          </div>

        </div>

        {/* History Table / Card List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Tidak Ada Riwayat Distribusi</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' || platformFilter !== 'all'
                ? 'Tidak ada data yang cocok dengan kriteria filter yang Anda pilih.'
                : 'Belum ada riwayat postingan. Gunakan tab Publikasi Serentak atau Penjadwalan untuk mengunggah konten.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredHistory.map((item) => {
              const isRetrying = retryingId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition space-y-3.5 ${
                    item.status === 'failed'
                      ? 'border-rose-300 bg-rose-50/40'
                      : item.status === 'success'
                      ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      : 'border-indigo-200 bg-indigo-50/30'
                  }`}
                >
                  {/* Top Bar: Account info & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    
                    {/* Account & Platform Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-900 truncate">
                            {item.accountName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            ({item.accountHandle})
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {item.platform}
                          </span>
                          {item.shopTagActive && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              🛍️ Shop Tagged
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{item.timestamp}</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{item.videoVariant}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Diagnostic Trigger */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      {item.status === 'success' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sukses Terbit</span>
                        </span>
                      )}

                      {item.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Gagal Upload</span>
                        </span>
                      )}

                      {item.status === 'scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Terjadwal</span>
                        </span>
                      )}

                      {item.status === 'processing' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>Sedang Diproses</span>
                        </span>
                      )}

                      {/* Technical Diagnostic JSON button */}
                      <button
                        onClick={() => setSelectedDiagnosticItem(item)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition"
                        title="Lihat Log Diagnostik API (Raw JSON)"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Caption & Post Content Body */}
                  <div className="space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-extrabold text-slate-900">{item.postTitle}</div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.captionPreview}
                    </p>
                  </div>

                  {/* Error Notification Banner if Failed */}
                  {item.status === 'failed' && (
                    <div className="p-3.5 bg-rose-100/90 border border-rose-300 rounded-xl space-y-2 text-rose-900 text-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            <span>Kode Error: {item.errorCode || 'UNKNOWN_DISTRIBUTION_ERROR'}</span>
                            {item.retryCount && item.retryCount > 0 && (
                              <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 rounded font-bold">
                                Pernah di-retry {item.retryCount}x
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                            {item.errorMessage || 'Terjadi kendala pada otorisasi API media sosial target.'}
                          </p>
                        </div>
                      </div>

                      {/* Retry Button */}
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => handleRetryUpload(item)}
                          disabled={isRetrying}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                          <span>{isRetrying ? 'Mencoba Mengunggah Ulang...' : 'Coba Unggah Ulang (Retry Upload)'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Live Stats & Links if Success */}
                  {item.status === 'success' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                      
                      {/* Metric Numbers */}
                      {item.stats && (
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-indigo-600" />
                            <strong>{item.stats.views.toLocaleString()}</strong> Views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <strong>{item.stats.likes.toLocaleString()}</strong> Likes
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                            <strong>{item.stats.cartClicks.toLocaleString()}</strong> Klik Beli
                          </span>
                        </div>
                      )}

                      {/* Action links */}
                      <div className="flex items-center gap-2">
                        {item.postUrl && (
                          <>
                            <button
                              onClick={() => handleCopyUrl(item)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                              title="Salin Tautan Postingan"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Tersalin' : 'Salin URL'}</span>
                            </button>

                            <a
                              href={item.postUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Buka Postingan</span>
                            </a>
                          </>
                        )}

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Hapus Entri Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Raw Diagnostic JSON Modal */}
      {selectedDiagnosticItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm text-slate-100">
                  Log Audit Diagnostik API ({selectedDiagnosticItem.platform.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDiagnosticItem(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Payload transaksi API, HTTP response code, dan token scope yang terekam di server:
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
              {JSON.stringify(selectedDiagnosticItem, null, 2)}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedDiagnosticItem, null, 2));
                  showToast('📋 Log JSON berhasil disalin!');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin JSON</span>
              </button>
              <button
                onClick={() => setSelectedDiagnosticItem(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Check,
  Layers,
  Tag,
  KeyRound,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConnectedSocialAccount, AdPlatform } from '../../types';

interface MultiAccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedSocialAccount[];
  onUpdateAccounts: (accounts: ConnectedSocialAccount[]) => void;
}

export const MultiAccountManagerModal: React.FC<MultiAccountManagerModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onUpdateAccounts,
}) => {
  const [filterPlatform, setFilterPlatform] = useState<'all' | AdPlatform>('all');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newPlatform, setNewPlatform] = useState<AdPlatform>('tiktok');
  const [newHandle, setNewHandle] = useState('');
  const [newName, setNewName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'business' | 'creator' | 'personal'>('business');
  const [newBrandTag, setNewBrandTag] = useState('');
  const [newLinkShop, setNewLinkShop] = useState(true);
  const [connectingProgress, setConnectingProgress] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter((acc) =>
    filterPlatform === 'all' ? true : acc.platform === filterPlatform
  );

  const handleConnectNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim() || !newName.trim()) return;

    setConnectingProgress(true);

    setTimeout(() => {
      const generatedAvatar =
        newPlatform === 'tiktok'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : newPlatform === 'instagram'
          ? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';

      const newAccountObj: ConnectedSocialAccount = {
        id: `acc-${newPlatform}-${Date.now()}`,
        platform: newPlatform,
        accountName: newName.trim(),
        accountHandle: newHandle.startsWith('@') ? newHandle.trim() : `@${newHandle.trim()}`,
        avatarUrl: generatedAvatar,
        accountType: newAccountType,
        followersCount: `${(Math.random() * 80 + 10).toFixed(1)}K`,
        status: 'connected',
        shopLinked: newLinkShop,
        brandTag: newBrandTag.trim() || `${newPlatform.toUpperCase()} Store Profile`,
        category: newPlatform === 'tiktok' ? 'TikTok E-Commerce' : newPlatform === 'instagram' ? 'Instagram Shopping' : 'Facebook Fanspage',
        productCatalogLinked: newLinkShop ? `${newPlatform.toUpperCase()} Catalog Sync #${Math.floor(Math.random() * 89999 + 10000)}` : undefined,
        autoSyncOrders: true,
        tokenExpiresAt: '2026-12-31',
      };

      const updated = [newAccountObj, ...accounts];
      onUpdateAccounts(updated);
      setConnectingProgress(false);
      setIsAddingAccount(false);
      setNewHandle('');
      setNewName('');
      setNewBrandTag('');
      setSuccessToast(`Akun ${newAccountObj.accountHandle} berhasil ditautkan secara resmi!`);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => setSuccessToast(null), 3500);
    }, 1200);
  };

  const handleDeleteAccount = (id: string) => {
    const updated = accounts.filter((a) => a.id !== id);
    onUpdateAccounts(updated);
  };

  const handleRefreshToken = (id: string) => {
    const updated = accounts.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status: 'connected' as const,
          tokenExpiresAt: '2026-12-31',
        };
      }
      return a;
    });
    onUpdateAccounts(updated);
    setSuccessToast('Akses token OAuth berhasil diperbarui (Valid s/d Des 2026).');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Pusat Integrasi Multi-Akun Media Sosial</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                OAuth 2.0 Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kelola beberapa akun TikTok, Instagram Reels, dan Facebook Fanspage dalam satu dashboard terpadu.
            </p>
          </div>
        </div>

        {/* Toast Alert */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Action Toolbar: Filter Tabs & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: `Semua (${accounts.length})` },
              { id: 'tiktok', label: `🎵 TikTok (${accounts.filter((a) => a.platform === 'tiktok').length})` },
              { id: 'instagram', label: `📸 Instagram (${accounts.filter((a) => a.platform === 'instagram').length})` },
              { id: 'facebook', label: `👥 Facebook (${accounts.filter((a) => a.platform === 'facebook').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPlatform(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterPlatform === tab.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingAccount(!isAddingAccount)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingAccount ? 'Batal Tambah' : 'Tautkan Akun Baru'}</span>
          </button>
        </div>

        {/* FORM: Add New Account Wizard (Collapsible) */}
        {isAddingAccount && (
          <form
            onSubmit={handleConnectNewAccount}
            className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Otentikasi & Hubungkan Akun Media Sosial Baru</span>
              </h4>
              <span className="text-[10px] text-indigo-700 font-medium">Auto-Sync Keranjang Belanja</span>
            </div>

            {/* Platform Choice */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'tiktok', label: 'TikTok for Business / Shop', icon: '🎵', badge: 'TikTok Shop Direct' },
                { id: 'instagram', label: 'Instagram Reels & Shop', icon: '📸', badge: 'Meta Commerce' },
                { id: 'facebook', label: 'Facebook Business Page', icon: '👥', badge: 'Page & Ads Manager' },
              ].map((plt) => (
                <button
                  key={plt.id}
                  type="button"
                  onClick={() => setNewPlatform(plt.id as AdPlatform)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    newPlatform === plt.id
                      ? 'bg-white border-indigo-600 text-indigo-950 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{plt.icon}</span>
                    {newPlatform === plt.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-xs font-bold">{plt.label}</div>
                  <span className="text-[9px] text-slate-500">{plt.badge}</span>
                </button>
              ))}
            </div>

            {/* Account Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Username / Handle Akun (@) *
                </label>
                <input
                  type="text"
                  required
                  placeholder={newPlatform === 'tiktok' ? '@toko_skincare_official' : newPlatform === 'instagram' ? '@racunskincare.id' : 'GlowLuxe Official Page'}
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nama Tampilan Brand / Toko *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: GlowLuxe Indonesia Cabang Bandung"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Tipe Akun
                </label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="business">Business / Official Store</option>
                  <option value="creator">Creator / Affiliate Showcase</option>
                  <option value="personal">Personal / Test Account</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Label Brand Tag (Pengelompokan)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tim Affiliate A, Toko Cadangan"
                  value={newBrandTag}
                  onChange={(e) => setNewBrandTag(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Shop Integration Toggle */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Tautkan Keranjang Belanja ({newPlatform === 'tiktok' ? 'TikTok Shop Yellow Cart' : 'Instagram Product Tagging'})
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Otomatis sinkronkan ID katalog produk agar tautan belanja langsung muncul saat video dipublikasikan.
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={newLinkShop}
                onChange={(e) => setNewLinkShop(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAccount(false)}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={connectingProgress}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {connectingProgress ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengautentikasi API...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Hubungkan Akun Resmi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* LIST OF CONNECTED ACCOUNTS */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredAccounts.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <Smartphone className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Tidak ada akun di kategori ini</div>
              <p className="text-[11px] text-slate-500">
                Klik tombol "Tautkan Akun Baru" di atas untuk menambahkan akun TikTok, Instagram, atau Facebook.
              </p>
            </div>
          ) : (
            filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-xs"
              >
                {/* Account Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.accountName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 shadow-xs">
                      {acc.platform === 'tiktok' ? '🎵' : acc.platform === 'instagram' ? '📸' : '👥'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {acc.accountName}
                      </span>
                      {acc.brandTag && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {acc.brandTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{acc.accountHandle}</span>
                      <span>•</span>
                      <span>{acc.followersCount} Followers</span>
                      <span>•</span>
                      <span className="capitalize">{acc.accountType}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      {acc.shopLinked && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          <ShoppingBag className="w-2.5 h-2.5" />
                          <span>{acc.productCatalogLinked || 'Katalog Belanja Aktif'}</span>
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400">
                        Token Exp: {acc.tokenExpiresAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 sm:self-center self-end">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Terhubung</span>
                  </span>

                  <button
                    onClick={() => handleRefreshToken(acc.id)}
                    title="Perbarui Token OAuth"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    title="Hapus / Putuskan Akun"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total Jangkauan Terkoneksi: <strong>{accounts.length} Akun</strong> (Est. ~604K Audiens)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};

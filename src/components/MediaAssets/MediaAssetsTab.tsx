import React, { useState } from 'react';
import {
  FolderKanban,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  FileText,
  Upload,
  Plus,
  Trash2,
  Tag,
  Scissors,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GripVertical,
  Layers,
  Search,
  Filter,
  Download,
  Zap,
  HelpCircle,
  X
} from 'lucide-react';
import { UploadedAsset, StoryboardScene, PippitProject } from '../../types';
import { removeBackgroundApi } from '../../services/api';

interface MediaAssetsTabProps {
  project: PippitProject;
  onChangeUploadedAssets: (assets: UploadedAsset[]) => void;
  onChangeStoryboard: (storyboard: StoryboardScene[]) => void;
  onProceedToAiCore: () => void;
}

const STOCK_LIBRARY_PRESETS: Array<{
  name: string;
  type: UploadedAsset['type'];
  url: string;
  size: string;
  tags: string[];
}> = [
  {
    name: 'glow-serum-dropper-4k.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    size: '2.4 MB',
    tags: ['Hero Product', 'Dropper', '4K Macro']
  },
  {
    name: 'glass-skin-dewy-model.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    size: '1.8 MB',
    tags: ['Model UGC', 'Skin Demo', 'Glowing']
  },
  {
    name: 'mechanical-keyboard-rgb.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    size: '3.1 MB',
    tags: ['Tech Setup', 'RGB Neon', 'Desk Aesthetic']
  },
  {
    name: 'insulated-tumbler-frost.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    size: '2.1 MB',
    tags: ['Lifestyle', 'Cold Retention', 'Kitchenware']
  },
  {
    name: 'brand-badge-official-gold.png',
    type: 'logo',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    size: '220 KB',
    tags: ['Brand Logo', 'Gold Emblem', 'Official']
  },
  {
    name: 'unboxing-broll-asmr.mp4',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    size: '6.4 MB',
    tags: ['B-roll Action', 'ASMR Unboxing', 'Hands On']
  }
];

export const MediaAssetsTab: React.FC<MediaAssetsTabProps> = ({
  project,
  onChangeUploadedAssets,
  onChangeStoryboard,
  onProceedToAiCore,
}) => {
  const assets = project.inputData.uploadedAssets || [];
  const scenes = project.storyboard || [];

  // Filter & Search State
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'image' | 'video' | 'logo' | 'sop_document'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag & Drop State
  const [draggedAsset, setDraggedAsset] = useState<UploadedAsset | null>(null);
  const [hoveredSceneId, setHoveredSceneId] = useState<string | null>(null);
  const [justDroppedSceneId, setJustDroppedSceneId] = useState<string | null>(null);
  const [isDragOverUploadZone, setIsDragOverUploadZone] = useState(false);

  // New Tag Input State
  const [editingTagAssetId, setEditingTagAssetId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  // AI Background Remover State
  const [processingBgAssetId, setProcessingBgAssetId] = useState<string | null>(null);

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<UploadedAsset | null>(null);

  // Collect all unique tags across assets
  const allUniqueTags = Array.from(
    new Set(
      assets.flatMap((a) => a.tags || [])
    )
  );

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesType = selectedTypeFilter === 'all' || asset.type === selectedTypeFilter;
    const matchesTag = selectedTagFilter === 'all' || (asset.tags && asset.tags.includes(selectedTagFilter));
    const matchesSearch =
      searchQuery.trim() === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.tags && asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesType && matchesTag && matchesSearch;
  });

  // Handle Drag Start from Asset Card
  const handleDragStart = (e: React.DragEvent, asset: UploadedAsset) => {
    setDraggedAsset(asset);
    e.dataTransfer.setData('text/plain', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedAsset(null);
    setHoveredSceneId(null);
  };

  // Handle Drop onto a Scene Slot
  const handleDropOnScene = (sceneId: string, assetToInsert?: UploadedAsset) => {
    const asset = assetToInsert || draggedAsset;
    if (!asset) return;

    const updatedStoryboard = scenes.map((sc) => {
      if (sc.id === sceneId) {
        return {
          ...sc,
          visualUrl: asset.url,
        };
      }
      return sc;
    });

    onChangeStoryboard(updatedStoryboard);
    setJustDroppedSceneId(sceneId);
    setTimeout(() => setJustDroppedSceneId(null), 2500);
  };

  // Quick 1-Click Insert from Dropdown
  const handleDirectInsertToScene = (asset: UploadedAsset, sceneId: string) => {
    handleDropOnScene(sceneId, asset);
  };

  // Add Custom Tag to an Asset
  const handleAddTag = (assetId: string) => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().replace(/^#/, '');

    const updatedAssets = assets.map((a) => {
      if (a.id === assetId) {
        const currentTags = a.tags || [];
        if (!currentTags.includes(cleanTag)) {
          return { ...a, tags: [...currentTags, cleanTag] };
        }
      }
      return a;
    });

    onChangeUploadedAssets(updatedAssets);
    setNewTagInput('');
    setEditingTagAssetId(null);
  };

  // Remove Tag from an Asset
  const handleRemoveTag = (assetId: string, tagToRemove: string) => {
    const updatedAssets = assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          tags: (a.tags || []).filter((t) => t !== tagToRemove),
        };
      }
      return a;
    });
    onChangeUploadedAssets(updatedAssets);
  };

  // Remove Asset
  const handleRemoveAsset = (id: string) => {
    const updated = assets.filter((a) => a.id !== id);
    onChangeUploadedAssets(updated);
  };

  // Handle Local File Upload
  const handleFilesUploaded = (files: FileList | null, defaultType: UploadedAsset['type'] = 'image') => {
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const newAssets: UploadedAsset[] = fileList.map((file, idx) => {
      let detectedType: UploadedAsset['type'] = defaultType;
      if (file.type.startsWith('video/')) detectedType = 'video';
      else if (file.type === 'image/png' && (file.name.toLowerCase().includes('logo') || file.name.toLowerCase().includes('icon'))) detectedType = 'logo';
      else if (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')) detectedType = 'sop_document';

      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        type: detectedType,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        processed: true,
        tags: [detectedType === 'image' ? 'Product Photo' : detectedType === 'video' ? 'B-roll' : detectedType === 'logo' ? 'Brand Logo' : 'Document'],
      };
    });

    onChangeUploadedAssets([...assets, ...newAssets]);
  };

  // Add Preset from Stock Library
  const handleAddStockPreset = (preset: typeof STOCK_LIBRARY_PRESETS[0]) => {
    const newAsset: UploadedAsset = {
      id: `stock-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: preset.name,
      type: preset.type,
      url: preset.url,
      size: preset.size,
      processed: true,
      tags: [...preset.tags],
    };
    onChangeUploadedAssets([...assets, newAsset]);
  };

  // AI Background Removal for Asset
  const handleRemoveBackground = async (asset: UploadedAsset) => {
    setProcessingBgAssetId(asset.id);
    try {
      const res = await removeBackgroundApi({
        imageUrl: asset.url,
        backgroundPreset: 'transparent_png',
      });

      const updated = assets.map((a) => {
        if (a.id === asset.id) {
          return {
            ...a,
            url: res.transparentPngUrl || a.url,
            bgRemovedUrl: res.transparentPngUrl,
            tags: [...(a.tags || []), 'BG Removed'],
          };
        }
        return a;
      });
      onChangeUploadedAssets(updated);
    } catch (err) {
      console.error('BG removal failed:', err);
    } finally {
      setProcessingBgAssetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-200">
            <FolderKanban className="w-3.5 h-3.5" />
            Media Assets & Creative Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen & Penataan Aset Kreatif
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Kelola foto produk, logo merek, dan klip video B-roll. Berikan tag penanda dan <strong>drag-and-drop</strong> aset visual langsung ke slot adegan <em>storyboard</em> di bawah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProceedToAiCore}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 shrink-0"
          >
            <span>Lanjut ke AI Core Processing</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* STORYBOARD DROP DOCK (Target Adegan Video) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Dock Penyisipan Adegan (Drag & Drop Target)</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Tarik aset gambar/video dari perpustakaan di bawah dan jatuhkan tepat di kartu adegan yang diinginkan.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5 text-indigo-600" />
            <span>{scenes.length} Slot Adegan Aktif</span>
          </div>
        </div>

        {/* Scene Cards Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {scenes.map((scene) => {
            const isHovered = hoveredSceneId === scene.id;
            const isJustDropped = justDroppedSceneId === scene.id;

            return (
              <div
                key={scene.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setHoveredSceneId(scene.id);
                }}
                onDragLeave={() => setHoveredSceneId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setHoveredSceneId(null);
                  handleDropOnScene(scene.id);
                }}
                className={`relative p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-2.5 ${
                  isJustDropped
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                    : isHovered
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 scale-[1.02]'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {scene.sceneNumber}
                      </span>
                      <span className="capitalize">{scene.sceneType}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {scene.durationSeconds}s
                    </span>
                  </div>

                  {/* Thumbnail Drop Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center group/thumb">
                    {scene.visualUrl ? (
                      <img
                        src={scene.visualUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">Tarik Aset Kesini</span>
                      </div>
                    )}

                    {/* Drag Over Overlay */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-indigo-600/80 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bold animate-pulse">
                        <Upload className="w-5 h-5 mb-1" />
                        <span>Lepaskan Aset!</span>
                      </div>
                    )}

                    {/* Just Dropped Success Badge */}
                    {isJustDropped && (
                      <div className="absolute inset-0 bg-emerald-600/85 flex flex-col items-center justify-center text-white text-xs font-bold">
                        <CheckCircle2 className="w-5 h-5 mb-1" />
                        <span>Visual Terpasang!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2 italic leading-tight">
                  "{scene.voiceoverText || scene.onScreenText}"
                </div>

                <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[110px] font-medium">
                    {scene.visualPrompt ? 'AI Visual Sync' : 'Custom Upload'}
                  </span>
                  <span className="text-indigo-600 font-semibold">Drop Zone</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASSET REPOSITORY CONTROLS & STOCK PRESETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Upload Zone & Stock Presets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverUploadZone(true);
            }}
            onDragLeave={() => setIsDragOverUploadZone(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverUploadZone(false);
              handleFilesUploaded(e.dataTransfer.files);
            }}
            className={`bg-white border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
              isDragOverUploadZone
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Unggah Aset Visual Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tarik & lepas file gambar produk, logo PNG, atau video B-roll dari komputermu
              </p>
            </div>

            <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95">
              <span>Pilih File Dari Komputer</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={(e) => handleFilesUploaded(e.target.files)}
                className="hidden"
              />
            </label>

            <span className="text-[10px] text-slate-400">
              Mendukung JPG, PNG (Transparan), WebP, MP4, MOV (Maks. 50MB)
            </span>
          </div>

          {/* Stock E-Commerce Asset Presets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Preset Stock E-Commerce
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                1-Klik Tambah
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {STOCK_LIBRARY_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 border border-slate-300 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate text-left">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {preset.name}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <span className="capitalize">{preset.type}</span>
                        <span>•</span>
                        <span>{preset.size}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddStockPreset(preset)}
                    className="p-1.5 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-slate-200 rounded-lg transition shadow-2xs shrink-0"
                    title="Tambahkan ke daftar aset saya"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip Banner */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1 text-xs">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Tips Konversi Visual:</span>
            </div>
            <p className="text-indigo-800 leading-relaxed text-[11px]">
              Gunakan foto <strong>Texture Macro</strong> untuk Scene Demo tekstur produk, dan letakkan <strong>Brand Logo Transparan</strong> di pojok video untuk meningkatkan <em>brand recall</em> hingga 38%.
            </p>
          </div>

        </div>

        {/* Right Side: Media Asset Gallery, Tag Filter & Manager (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Filter, Search & Tag Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Type Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Semua Aset', count: assets.length },
                  { id: 'image', label: 'Foto Produk', count: assets.filter((a) => a.type === 'image').length },
                  { id: 'video', label: 'B-roll Video', count: assets.filter((a) => a.type === 'video').length },
                  { id: 'logo', label: 'Logo Brand', count: assets.filter((a) => a.type === 'logo').length },
                  { id: 'sop_document', label: 'Dokumen', count: assets.filter((a) => a.type === 'sop_document').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTypeFilter(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                      selectedTypeFilter === tab.id
                        ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-200/70 rounded-full font-medium">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau tag aset..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tag Filter Chips Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                <Tag className="w-3 h-3" />
                Tag:
              </span>

              <button
                onClick={() => setSelectedTagFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition shrink-0 ${
                  selectedTagFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Tag
              </button>

              {allUniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition shrink-0 flex items-center gap-1 ${
                    selectedTagFilter === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
                  }`}
                >
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Cards Grid */}
          {filteredAssets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tidak ada aset yang sesuai</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba ubah filter pencarian atau unggah file media baru dari panel sebelah kiri.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isProcessingBg = processingBgAssetId === asset.id;
                const isEditingTag = editingTagAssetId === asset.id;

                return (
                  <div
                    key={asset.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, asset)}
                    onDragEnd={handleDragEnd}
                    className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-2xl p-3.5 space-y-3 transition flex flex-col justify-between group cursor-grab active:cursor-grabbing"
                  >
                    <div className="space-y-2.5">
                      {/* Asset Media Preview Box */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group/preview">
                        {asset.type === 'image' || asset.type === 'logo' ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover/preview:scale-105 transition"
                            referrerPolicy="no-referrer"
                          />
                        ) : asset.type === 'video' ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                            <video
                              src={asset.url}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute w-8 h-8 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-md">
                              <Video className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-1">
                            <FileText className="w-8 h-8" />
                            <span className="text-[10px] font-semibold text-slate-500">PDF / Brand Kit</span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase ${
                            asset.type === 'image'
                              ? 'bg-indigo-600 text-white'
                              : asset.type === 'video'
                              ? 'bg-purple-600 text-white'
                              : asset.type === 'logo'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-white'
                          }`}>
                            {asset.type.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Drag Indicator Overlay on Hover */}
                        <div className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xs flex items-center gap-1 text-[10px] font-medium">
                          <GripVertical className="w-3.5 h-3.5" />
                          <span>Tarik ke Scene</span>
                        </div>

                        {/* Quick View Button */}
                        <button
                          onClick={() => setPreviewAsset(asset)}
                          className="absolute bottom-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-sm opacity-0 group-hover/preview:opacity-100 transition"
                          title="Lihat Detail & Ukuran Asli"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          {asset.size && <span>{asset.size}</span>}
                          {asset.duration && <span>• {asset.duration}s</span>}
                        </div>
                      </div>

                      {/* Tag Pills Manager */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1">
                          {(asset.tags || []).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md border border-slate-200"
                            >
                              <span>#{t}</span>
                              <button
                                onClick={() => handleRemoveTag(asset.id, t)}
                                className="text-slate-400 hover:text-rose-600 transition"
                                title="Hapus tag"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}

                          {!isEditingTag && (
                            <button
                              onClick={() => {
                                setEditingTagAssetId(asset.id);
                                setNewTagInput('');
                              }}
                              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 px-1.5 py-0.5 rounded border border-dashed border-indigo-200 hover:bg-indigo-50 transition flex items-center gap-0.5"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Tag</span>
                            </button>
                          )}
                        </div>

                        {/* Inline Tag Input */}
                        {isEditingTag && (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="text"
                              autoFocus
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTag(asset.id);
                                if (e.key === 'Escape') setEditingTagAssetId(null);
                              }}
                              placeholder="Nama tag baru..."
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => handleAddTag(asset.id)}
                              className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingTagAssetId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 text-[10px]"
                            >
                              Batal
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      {/* Direct Insert to Scene Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleDirectInsertToScene(asset, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="flex-1 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-800 rounded-xl px-2 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>
                          + Sisipkan ke Adegan...
                        </option>
                        {scenes.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            Adegan #{sc.sceneNumber} ({sc.sceneType})
                          </option>
                        ))}
                      </select>

                      {/* AI Background Remover */}
                      {asset.type === 'image' && (
                        <button
                          onClick={() => handleRemoveBackground(asset)}
                          disabled={isProcessingBg}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-xl transition shadow-2xs"
                          title="Hapus Background dengan AI"
                        >
                          <Scissors className={`w-3.5 h-3.5 ${isProcessingBg ? 'animate-spin text-indigo-600' : ''}`} />
                        </button>
                      )}

                      {/* Delete Asset */}
                      <button
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Hapus Aset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* ASSET PREVIEW & INSPECTION MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
                  {previewAsset.name}
                </h3>
              </div>

              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Res Preview */}
            <div className="aspect-video max-h-80 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              {previewAsset.type === 'video' ? (
                <video
                  src={previewAsset.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Details & Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tipe File</span>
                <span className="font-bold text-slate-800 uppercase">{previewAsset.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ukuran File</span>
                <span className="font-bold text-slate-800">{previewAsset.size || '1.8 MB'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tag Penanda</span>
                <span className="font-medium text-indigo-700">
                  {previewAsset.tags?.map((t) => `#${t}`).join(' ') || 'Belum ada tag'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
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

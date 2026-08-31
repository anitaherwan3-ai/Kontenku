import React from 'react';
import {
  Sparkles,
  Layers,
  FolderKanban,
  Cpu,
  Film,
  Share2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  Palette,
  Settings
} from 'lucide-react';
import { PippitProject } from '../types';
import { DEMO_PRESET_PRODUCTS } from '../data/samplePresets';

interface NavbarProps {
  activeTab: 'input' | 'media' | 'aicore' | 'quickedit' | 'distribution';
  setActiveTab: (tab: 'input' | 'media' | 'aicore' | 'quickedit' | 'distribution') => void;
  project: PippitProject;
  onLoadPreset: (presetId: string) => void;
  onOpenExportModal: () => void;
  onOpenBrandSettings?: () => void;
  onOpenSystemSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  project,
  onLoadPreset,
  onOpenExportModal,
  onOpenBrandSettings,
  onOpenSystemSettings,
}) => {
  const tabs = [
    { id: 'input', label: '1. Input Layer', sub: 'Sumber & URL', icon: Layers },
    { id: 'media', label: '2. Media Assets', sub: 'Aset, Tag & Slot', icon: FolderKanban },
    { id: 'aicore', label: '3. AI Core Processing', sub: 'Script & Avatar', icon: Cpu },
    { id: 'quickedit', label: '4. Quick Edit Studio', sub: 'Canvas & SFX', icon: Film },
    { id: 'distribution', label: '5. Distribusi', sub: 'Jadwal & Analitik', icon: Share2 },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:min-h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100 text-white">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  KontenKU
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[180px] sm:max-w-xs md:max-w-[220px] font-medium">
                {project.title}
              </p>
            </div>
          </div>

          {/* Stepper Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="leading-tight">{tab.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Stepper Navigation */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={tab.label}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label.split('.')[1]}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Settings */}
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            
            {/* System Settings & API Connections Button */}
            {onOpenSystemSettings && (
              <button
                id="btn-open-system-settings"
                onClick={onOpenSystemSettings}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-2xs transition active:scale-95"
                title="Pengaturan Sistem, Kredensial API & Model AI"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Pengaturan</span>
              </button>
            )}

            {/* Brand Kit */}
            {onOpenBrandSettings && (
              <button
                id="btn-brand-kit-settings"
                onClick={onOpenBrandSettings}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-xs font-bold text-indigo-700 rounded-xl shadow-2xs transition active:scale-95"
                title="Atur Palet Warna & Font Brand"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Brand Kit</span>
              </button>
            )}

            {/* Mobile Preset Selector */}
            <div className="sm:hidden min-w-[140px] flex-1">
              <label htmlFor="mobile-preset-selector" className="sr-only">
                Pilih preset demo
              </label>
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-indigo-600" />
                <select
                  id="mobile-preset-selector"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      onLoadPreset(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-bold text-slate-700 shadow-2xs outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">Preset Demo</option>
                  {DEMO_PRESET_PRODUCTS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Demo Preset Selector */}
            <div className="relative hidden sm:block group">
              <button
                id="btn-preset-selector"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-2xs transition"
                title="Pilih Contoh Produk Demo"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Preset Demo</span>
                <span className="sm:hidden text-[11px] font-bold">Preset</span>
              </button>
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in">
                <div className="text-[10px] font-black text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Pilih Contoh Produk
                </div>
                {DEMO_PRESET_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onLoadPreset(p.id)}
                    className="w-full text-left px-2.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-xl flex items-center justify-between group/item transition"
                  >
                    <span className="truncate pr-2 font-semibold">{p.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-indigo-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Export CTA */}
            <button
              id="btn-export-ad"
              onClick={onOpenExportModal}
              className="flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-200 transition active:scale-95 sm:flex-none"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Video</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 border-t border-slate-200 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-max items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label.split('.')[1]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

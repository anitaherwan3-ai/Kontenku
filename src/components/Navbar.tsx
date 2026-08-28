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
  CheckCircle2
} from 'lucide-react';
import { PippitProject } from '../types';
import { DEMO_PRESET_PRODUCTS } from '../data/samplePresets';

interface NavbarProps {
  activeTab: 'input' | 'media' | 'aicore' | 'quickedit' | 'distribution';
  setActiveTab: (tab: 'input' | 'media' | 'aicore' | 'quickedit' | 'distribution') => void;
  project: PippitProject;
  onLoadPreset: (presetId: string) => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  project,
  onLoadPreset,
  onOpenExportModal,
}) => {
  const tabs = [
    { id: 'input', label: '1. Input Layer', sub: 'Sumber & URL', icon: Layers },
    { id: 'media', label: '2. Media Assets', sub: 'Aset, Tag & Slot', icon: FolderKanban },
    { id: 'aicore', label: '3. AI Core Processing', sub: 'Script & Avatar', icon: Cpu },
    { id: 'quickedit', label: '4. Quick Edit Studio', sub: 'Canvas & SFX', icon: Film },
    { id: 'distribution', label: '5. Distribusi', sub: 'Jadwal & Analitik', icon: Share2 },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100 text-white">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  KontenKU
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md">
                  AI Video Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs font-medium">
                {project.title}
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="leading-tight">{tab.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Stepper Navigation (Icons + Short Labels) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
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

          {/* Quick Actions & Presets */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Preset Selector */}
            <div className="relative group hidden sm:block">
              <button
                id="btn-preset-selector"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg shadow-xs transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Preset</span>
              </button>
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Pilih Contoh Produk
                </div>
                {DEMO_PRESET_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onLoadPreset(p.id)}
                    className="w-full text-left px-2.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-lg flex items-center justify-between group/item transition"
                  >
                    <span className="truncate pr-2 font-medium">{p.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-indigo-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Export Ad Button */}
            <button
              id="btn-export-ad"
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm shadow-indigo-200 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export Video</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-200 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
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

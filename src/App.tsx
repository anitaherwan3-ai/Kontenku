import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InputLayerTab } from './components/InputLayer/InputLayerTab';
import { MediaAssetsTab } from './components/MediaAssets/MediaAssetsTab';
import { AiCoreTab } from './components/AiCore/AiCoreTab';
import { QuickEditTab } from './components/QuickEditStudio/QuickEditTab';
import { DistributionTab } from './components/Distribution/DistributionTab';
import { ExportModal } from './components/Modals/ExportModal';
import { BrandSettingsModal } from './components/Modals/BrandSettingsModal';
import { SystemSettingsModal } from './components/Modals/SystemSettingsModal';
import { PippitProject, InputLayerData, StoryboardScene, DigitalAvatar, TTSSettings, UploadedAsset } from './types';
import { INITIAL_DEFAULT_PROJECT, DEMO_PRESET_PRODUCTS, SAMPLE_AVATARS } from './data/samplePresets';
import { RenderQueueProvider } from './context/RenderQueueContext';
import { BackgroundRenderDock } from './components/Common/BackgroundRenderDock';

export default function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'media' | 'aicore' | 'quickedit' | 'distribution'>('input');
  const [project, setProject] = useState<PippitProject>(INITIAL_DEFAULT_PROJECT);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);

  // Partial update helper
  const handleUpdateProject = (fields: Partial<PippitProject>) => {
    setProject((prev) => ({
      ...prev,
      ...fields,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateInputData = (newInputData: Partial<InputLayerData>) => {
    setProject((prev) => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        ...newInputData,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateUploadedAssets = (newAssets: UploadedAsset[]) => {
    setProject((prev) => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        uploadedAssets: newAssets,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateStoryboard = (newStoryboard: StoryboardScene[]) => {
    setProject((prev) => ({
      ...prev,
      storyboard: newStoryboard,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateAvatar = (avatar: DigitalAvatar) => {
    setProject((prev) => ({
      ...prev,
      selectedAvatar: avatar,
      ttsSettings: {
        ...prev.ttsSettings,
        voiceId: avatar.defaultVoice,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateTtsSettings = (settings: Partial<TTSSettings>) => {
    setProject((prev) => ({
      ...prev,
      ttsSettings: {
        ...prev.ttsSettings,
        ...settings,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Load demo preset product
  const handleLoadPreset = (presetId: string) => {
    const found = DEMO_PRESET_PRODUCTS.find((p) => p.id === presetId);
    if (!found) return;

    if (presetId === 'preset-serum') {
      setProject(INITIAL_DEFAULT_PROJECT);
    } else if (presetId === 'preset-keyboard') {
      setProject((prev) => ({
        ...prev,
        title: 'VortexStrike CyberKey Gaming Setup Ad Campaign',
        inputData: {
          ...prev.inputData,
          productUrl: found.url,
          productAnalysis: found.analysis,
          promptConcept: 'Video review mechanical keyboard wireless RGB dengan sound test creamy thocky dan setup meja minimalis.',
          adGoal: 'conversion',
          selectedTone: 'excited_ugc',
        },
        selectedAvatar: SAMPLE_AVATARS[1], // Rian Tech Reviewer
        storyboard: [
          {
            id: 'scene-kb-1',
            sceneNumber: 1,
            sceneType: 'hook',
            durationSeconds: 3,
            voiceoverText: 'Setup meja lo masih berantakan kabel? Ini rahasia keyboard wireless paling aesthetic dengan sound test paling satisfying!',
            avatarAction: 'Mengetik dengan cepat lalu menghadapkan keyboard RGB ke kamera',
            visualPrompt: 'POV desk setup: Neon RGB cyber lighting, custom keycaps, clean dark oak desk aesthetic, 9:16 vertical view',
            visualUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            onScreenText: '🔥 SETUP MEJA RAPI TANPA KABEL! Sound Thock 100%',
            cameraMovement: 'zoom_in',
            transition: 'zoom_blur',
            bgSoundEffect: 'Whoosh',
          },
          {
            id: 'scene-kb-2',
            sceneNumber: 2,
            sceneType: 'demo',
            durationSeconds: 4,
            voiceoverText: 'Dengerin suaranya! Gateron Yellow switch udah pre-lubed dari pabrik. Tri-mode wireless bisa connect ke 3 device sekaligus.',
            avatarAction: 'Menekan tombol pelan-pelan untuk memperdengarkan suara switch',
            visualPrompt: 'Ultra macro shot: Finger pressing mechanical keycap, smooth RGB light dispersion under switch, cinematic slow-mo',
            visualUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
            onScreenText: '🎧 Gateron Yellow Switch (Tri-Mode Bluetooth 5.3)',
            cameraMovement: 'pan_right',
            transition: 'cut',
            bgSoundEffect: 'Keyboard Thock ASMR',
          },
          {
            id: 'scene-kb-3',
            sceneNumber: 3,
            sceneType: 'cta',
            durationSeconds: 3,
            voiceoverText: 'Lagi ada promo voucher diskon 50 ribu khusus checkout hari ini di keranjang kuning!',
            avatarAction: 'Menunjuk ke keranjang kuning sambil tersenyum',
            visualPrompt: 'Pulsing TikTok Yellow Cart sticker with stock countdown timer',
            visualUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
            onScreenText: '👇 KLIK KERANJANG KUNING (GRATIS ONGKIR)',
            cameraMovement: 'dynamic_shake',
            transition: 'glitch',
            bgSoundEffect: 'Cash Register Cha-Ching',
          },
        ],
      }));
    } else if (presetId === 'preset-tumbler') {
      setProject((prev) => ({
        ...prev,
        title: 'HydroPulse Smart Tumbler Ice Retention Viral Ad',
        inputData: {
          ...prev.inputData,
          productUrl: found.url,
          productAnalysis: found.analysis,
          promptConcept: 'Iklan eksperimen es batu dibiarkan di dalam mobil 36 jam untuk membuktikan ketahanan dingin HydroPulse Tumbler.',
          adGoal: 'viral_ugc',
          selectedTone: 'excited_ugc',
        },
        selectedAvatar: SAMPLE_AVATARS[3], // Kang Budi
        storyboard: [
          {
            id: 'scene-tb-1',
            sceneNumber: 1,
            sceneType: 'hook',
            durationSeconds: 3,
            voiceoverText: 'Beneran gak sih es batu di tumbler ini gak mencair 36 jam meski dijemur di mobil panas?! Yuk kita buktikan!',
            avatarAction: 'Membuka tutup tumbler dengan ekspresi penasaran',
            visualPrompt: 'Bright outdoor daylight: Thermometer showing 38 degrees Celsius, frost mist emerging from opened steel tumbler',
            visualUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
            onScreenText: '❄️ EKSPERIMEN ES BATU 36 JAM! Meleleh gak ya?!',
            cameraMovement: 'zoom_in',
            transition: 'zoom_blur',
            bgSoundEffect: 'Record Scratch',
          },
          {
            id: 'scene-tb-2',
            sceneNumber: 2,
            sceneType: 'demo',
            durationSeconds: 4,
            voiceoverText: 'Dan hasilnya es batunya masih utuh! Bahan Stainless 316 Medical Grade bikin es kopi dingin segar seharian tanpa bocor!',
            avatarAction: 'Menuang air es dingin segar dengan bunyi es gemerincing',
            visualPrompt: 'Crisp water splash slow motion with solid ice cubes clinking inside insulated tumbler',
            visualUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
            onScreenText: '✨ Stainless 316 Medical Grade (Dingin 36 Jam)',
            cameraMovement: 'pan_right',
            transition: 'cut',
            bgSoundEffect: 'Ice Clink Sound',
          },
          {
            id: 'scene-tb-3',
            sceneNumber: 3,
            sceneType: 'cta',
            durationSeconds: 3,
            voiceoverText: 'Lagi ada promo Beli 1 Dapat 2 gratis sedotan stainless. Klik keranjang kuning sekarang!',
            avatarAction: 'Menunjuk keranjang kuning di kiri bawah',
            visualPrompt: 'Limited promo banner with buy 1 get 1 badge and yellow cart pulsing',
            visualUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
            onScreenText: '👇 BELI 1 DAPAT 2 (KLIK KERANJANG KUNING)',
            cameraMovement: 'dynamic_shake',
            transition: 'glitch',
            bgSoundEffect: 'Ding Sparkle',
          },
        ],
      }));
    }
  };

  return (
    <RenderQueueProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
        {/* Top Studio Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          project={project}
          onLoadPreset={handleLoadPreset}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenBrandSettings={() => setIsBrandModalOpen(true)}
          onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        />

        {/* Main Content View Switcher */}
        <main className="flex-1 pb-28 sm:pb-32">
          {activeTab === 'input' && (
            <InputLayerTab
              inputData={project.inputData}
              onChangeInputData={handleUpdateInputData}
              onProceedToAiCore={() => setActiveTab('aicore')}
              onProceedToMediaAssets={() => setActiveTab('media')}
            />
          )}

          {activeTab === 'media' && (
            <MediaAssetsTab
              project={project}
              onChangeUploadedAssets={handleUpdateUploadedAssets}
              onChangeStoryboard={handleUpdateStoryboard}
              onProceedToAiCore={() => setActiveTab('aicore')}
            />
          )}

          {activeTab === 'aicore' && (
            <AiCoreTab
              project={project}
              onChangeStoryboard={handleUpdateStoryboard}
              onChangeAvatar={handleUpdateAvatar}
              onChangeTtsSettings={handleUpdateTtsSettings}
              onProceedToQuickEdit={() => setActiveTab('quickedit')}
              onChangeProject={handleUpdateProject}
            />
          )}

          {activeTab === 'quickedit' && (
            <QuickEditTab
              project={project}
              onChangeProject={handleUpdateProject}
              onProceedToDistribution={() => setActiveTab('distribution')}
              onOpenBrandSettings={() => setIsBrandModalOpen(true)}
            />
          )}

          {activeTab === 'distribution' && (
            <DistributionTab
              project={project}
              onChangeProject={handleUpdateProject}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center justify-center gap-2 font-medium sm:justify-start">
              <span className="text-slate-900 font-bold">KontenKU</span>
              <span>• E-Commerce Video Ad & Content Studio</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500 sm:justify-end">
              <span>Link-to-Video</span>
              <span>Seedance Engine</span>
              <span>Digital Avatars</span>
              <span>Auto-Publish TikTok & Reels</span>
            </div>
          </div>
        </footer>

        {/* Export & Download Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          project={project}
          onChangeProject={handleUpdateProject}
        />

        {/* Brand Kit & Project Visual Settings Modal */}
        <BrandSettingsModal
          isOpen={isBrandModalOpen}
          onClose={() => setIsBrandModalOpen(false)}
          project={project}
          onChangeProject={handleUpdateProject}
        />

        {/* System Settings, OAuth APIs, AI Engine & Webhooks Modal */}
        <SystemSettingsModal
          isOpen={isSystemSettingsOpen}
          onClose={() => setIsSystemSettingsOpen(false)}
          project={project}
          onChangeProject={handleUpdateProject}
          onLoadPreset={handleLoadPreset}
        />

        {/* Non-Blocking Background Render Queue Dock */}
        <BackgroundRenderDock />
      </div>
    </RenderQueueProvider>
  );
}

import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Target,
  ArrowLeftRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Plus,
  Share2,
  Copy,
  Layers,
  Wand2,
  Eye,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { HookVariant, PippitProject, StoryboardScene } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface MultiHookGeneratorSectionProps {
  project: PippitProject;
  onChangeStoryboard: (newScenes: StoryboardScene[]) => void;
  onChangeProject?: (newProject: Partial<PippitProject>) => void;
}

export const MultiHookGeneratorSection: React.FC<MultiHookGeneratorSectionProps> = ({
  project,
  onChangeStoryboard,
  onChangeProject,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    project.selectedHookId || project.hookVariants?.[0]?.id || 'hook-preset-1'
  );
  const [isGeneratingNewHooks, setIsGeneratingNewHooks] = useState(false);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);
  const [activePreviewHook, setActivePreviewHook] = useState<HookVariant | null>(null);

  const hookList = project.hookVariants || [];

  const handleApplyHookToScene1 = (hook: HookVariant) => {
    soundSynth.playSound('pop');
    setSelectedVariantId(hook.id);

    // Update Scene 1 in storyboard
    const updatedScenes = project.storyboard.map((scene, idx) => {
      if (idx === 0 || scene.sceneType === 'hook') {
        return {
          ...scene,
          voiceoverText: hook.voiceoverText,
          onScreenText: hook.onScreenText,
          visualPrompt: hook.visualPrompt,
          visualUrl: hook.visualUrl || scene.visualUrl,
        };
      }
      return scene;
    });

    onChangeStoryboard(updatedScenes);

    if (onChangeProject) {
      onChangeProject({
        selectedHookId: hook.id,
      });
    }
  };

  const handleGenerateFreshHooks = () => {
    setIsGeneratingNewHooks(true);
    soundSynth.playSound('whoosh');

    setTimeout(() => {
      const prodName = project.inputData.productAnalysis?.productName || 'Produk Favorit';
      const newCustomHook: HookVariant = {
        id: `hook-gen-${Date.now()}`,
        angleType: 'curiosity_gap',
        angleTitle: 'AI Generated: High-Energy Curiosity Gap',
        voiceoverText: `Kalian jangan kaget ya kalau ${prodName} ini viral banget di TikTok Shop, liat deh apa yang terjadi pas dicoba!`,
        onScreenText: `🔥 RAHASIA VIRAL: ${prodName.toUpperCase().slice(0, 24)}`,
        visualPrompt: `Energetic UGC creator unboxing with bright studio background, 9:16 vertical ratio, eye-catching text overlay`,
        visualUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        predictedRetention3s: 93.8,
        predictedCtrLift: '+36.2% CTR',
        psychologicalTrigger: 'Curiosity Spike & Algorithmic Hook',
        tags: ['AI Generated', 'Viral FYP', 'High CTR'],
      };

      const updatedList = [newCustomHook, ...hookList];
      if (onChangeProject) {
        onChangeProject({
          hookVariants: updatedList,
          selectedHookId: newCustomHook.id,
        });
      }
      handleApplyHookToScene1(newCustomHook);
      setIsGeneratingNewHooks(false);
    }, 1200);
  };

  const handleCopyHookScript = (hook: HookVariant) => {
    const text = `[HOOK VARIATION: ${hook.angleTitle}]\nOn-Screen: ${hook.onScreenText}\nVoiceover: ${hook.voiceoverText}\nVisual Seedance: ${hook.visualPrompt}`;
    navigator.clipboard.writeText(text);
    setCopiedHookId(hook.id);
    setTimeout(() => setCopiedHookId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Multi-Hook A/B Test Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            1 Video, 5 Variasi Hook A/B Testing
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
            80% penonton TikTok memutuskan lanjut nonton di 3 detik pertama. Pilih hook terbaik atau uji split-test di TikTok Ads untuk melipatgandakan ROAS.
          </p>
        </div>

        <button
          onClick={handleGenerateFreshHooks}
          disabled={isGeneratingNewHooks}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isGeneratingNewHooks ? 'animate-spin' : ''}`} />
          <span>{isGeneratingNewHooks ? 'Membuat Hook AI...' : 'Generate 5 Hook Baru'}</span>
        </button>
      </div>

      {/* Grid of 5 Hook Angle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hookList.map((hook, index) => {
          const isSelected = selectedVariantId === hook.id;

          // Color accents per angle
          let badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
          let icon = '🎯';
          if (hook.angleType === 'curiosity_gap') {
            badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
            icon = '😱';
          } else if (hook.angleType === 'price_shock') {
            badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
            icon = '🔥';
          } else if (hook.angleType === 'problem_agitation') {
            badgeColor = 'bg-orange-100 text-orange-900 border-orange-300';
            icon = '🛑';
          } else if (hook.angleType === 'social_proof') {
            badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            icon = '⭐';
          } else if (hook.angleType === 'skeptical_reverse') {
            badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
            icon = '🤔';
          }

          return (
            <div
              key={hook.id}
              className={`rounded-3xl border-2 p-5 transition-all duration-200 flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-600 shadow-xl ring-4 ring-indigo-500/10'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Angle Label & Predicted Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        {hook.angleTitle}
                      </div>
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 ${badgeColor}`}
                      >
                        Varian #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Retention Pill */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-600 flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{hook.predictedCtrLift}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Retensi 3s: {hook.predictedRetention3s}%
                    </div>
                  </div>
                </div>

                {/* On Screen Banner */}
                <div className="bg-slate-950 text-amber-300 p-2.5 rounded-xl text-xs font-mono font-bold tracking-tight shadow-inner border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans mb-0.5">
                    Teks Layar (0-3 Detik):
                  </div>
                  {hook.onScreenText}
                </div>

                {/* Voiceover Script */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Naskah Suara (Voiceover):
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{hook.voiceoverText}"
                  </p>
                </div>

                {/* Psychological Trigger Note */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/80">
                  <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">
                    <strong>Trigger:</strong> {hook.psychologicalTrigger}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleApplyHookToScene1(hook)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Hook Utama Aktif</span>
                    </>
                  ) : (
                    <span>Terapkan ke Video</span>
                  )}
                </button>

                <button
                  onClick={() => handleCopyHookScript(hook)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="Salin Naskah Hook"
                >
                  {copiedHookId === hook.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Test Tip Box */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Tips Iklan Berkonversi Tinggi (TikTok Ads & Meta):</strong> Ekspor video dengan 3 variasi hook berbeda (Varian 1: Price Shock, Varian 2: Curiosity, Varian 3: Relatable Problem) lalu unggah sebagai 3 ad creatives dalam 1 AdSet. AI platform akan otomatis mengarahkan 80% anggaran ke hook dengan CTR tertinggi.
        </div>
      </div>
    </div>
  );
};

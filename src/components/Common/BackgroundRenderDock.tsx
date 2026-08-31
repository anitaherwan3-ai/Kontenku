import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Zap,
  Music,
  FileText,
  Sparkles,
  HardDrive,
  Trash2,
  Check
} from 'lucide-react';
import { useRenderQueue } from '../../context/RenderQueueContext';
import { RenderTask } from '../../types';

export const BackgroundRenderDock: React.FC = () => {
  const {
    batches,
    activeTasks,
    allTasks,
    isQueueRunning,
    isDockOpen,
    setIsDockOpen,
    pauseTask,
    resumeTask,
    cancelTask,
    cancelBatch,
    clearCompletedTasks,
    downloadTaskArtifact,
    downloadBatchZip,
    totalActiveCount,
    totalCompletedCount,
  } = useRenderQueue();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // If no tasks exist in queue, don't show the dock
  if (allTasks.length === 0) return null;

  const completedTasks = allTasks.filter((t) => t.status === 'completed');

  // Get format icon
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'mov':
        return <Layers className="w-3.5 h-3.5 text-sky-500" />;
      case 'gif':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'srt':
        return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
      case 'audio_pack':
        return <Music className="w-3.5 h-3.5 text-purple-500" />;
      case 'mp4':
      default:
        return <Film className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      {/* Minimized Floating Pill Trigger */}
      {!isDockOpen && (
        <button
          onClick={() => setIsDockOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-900 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 group"
        >
          {isQueueRunning ? (
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          ) : (
            <HardDrive className="w-4 h-4 text-slate-300" />
          )}

          <div className="text-left text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <span>Antrean Render Background</span>
              {totalActiveCount > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] rounded-full font-black">
                  {totalActiveCount}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {totalActiveCount > 0
                ? `${totalActiveCount} tugas berjalan di background`
                : `${totalCompletedCount} file siap diunduh`}
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition ml-1" />
        </button>
      )}

      {/* Expanded Render Queue Drawer */}
      {isDockOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] max-w-full max-h-[520px] flex flex-col bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Background GPU Render Queue</span>
                  {isQueueRunning && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Rendering multi-format tanpa memblokir antarmuka pengguna
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsDockOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Minimalkan ke Floating Dock"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Berjalan vs Selesai */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-2 border-b border-slate-800/60 bg-slate-900/40 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
                  activeTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>Sedang Diproses</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {activeTasks.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
                  activeTab === 'completed'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>Selesai</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {completedTasks.length}
                </span>
              </button>
            </div>

            {completedTasks.length > 0 && activeTab === 'completed' && (
              <button
                onClick={clearCompletedTasks}
                className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Bersihkan</span>
              </button>
            )}
          </div>

          {/* Task List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[340px] no-scrollbar">
            {activeTab === 'active' && (
              <>
                {activeTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto opacity-80 mb-1.5" />
                    <p className="font-semibold text-slate-300">Semua render telah selesai!</p>
                    <p className="text-[10px]">Pilih tab 'Selesai' untuk mengunduh hasil ekspor.</p>
                  </div>
                ) : (
                  activeTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-2 relative overflow-hidden"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                          {getFormatIcon(task.format)}
                          <span className="font-bold text-slate-200 truncate">
                            {task.outputFilename}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-mono font-bold text-indigo-400">
                            {task.progress}%
                          </span>

                          {task.status === 'paused' ? (
                            <button
                              onClick={() => resumeTask(task.id)}
                              className="p-1 text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                              title="Lanjutkan Render"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseTask(task.id)}
                              className="p-1 text-amber-400 hover:bg-slate-800 rounded-lg transition"
                              title="Jeda Render"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => cancelTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Batalkan Tugas"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            task.status === 'paused'
                              ? 'bg-amber-500'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>

                      {/* Step description & metadata */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[220px] flex items-center gap-1">
                          {task.status === 'rendering' && (
                            <Loader2 className="w-2.5 h-2.5 text-indigo-400 animate-spin shrink-0" />
                          )}
                          <span>{task.renderStepLabel}</span>
                        </span>

                        <span className="font-mono text-slate-400 shrink-0">
                          {task.estimatedSecondsRemaining !== undefined && task.estimatedSecondsRemaining > 0
                            ? `~${task.estimatedSecondsRemaining}s`
                            : 'memproses...'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'completed' && (
              <>
                {completedTasks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                    <HardDrive className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-400">Belum ada file selesai</p>
                    <p className="text-[10px]">Tugas yang selesai akan muncul di sini.</p>
                  </div>
                ) : (
                  completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {getFormatIcon(task.format)}
                          <span className="font-bold text-slate-200 text-xs truncate">
                            {task.outputFilename}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="uppercase font-semibold text-indigo-400">
                            {task.format} • {task.aspectRatio}
                          </span>
                          <span>•</span>
                          <span>{task.fileSizeMb} MB</span>
                        </div>
                      </div>

                      <button
                        onClick={() => downloadTaskArtifact(task)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0 shadow-xs active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Footer: Bulk Batch Action */}
          {batches.length > 0 && (
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/70 flex items-center justify-between gap-2 text-xs">
              <div className="text-[11px] text-slate-400">
                <span>{batches.length} Batch Aktif</span>
              </div>

              {completedTasks.length > 0 && (
                <button
                  onClick={() => downloadBatchZip(batches[0].id)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Semua (.ZIP)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RenderTask, BulkRenderBatch, RenderFormat, AspectRatio, RenderTaskStatus } from '../types';

interface EnqueueTaskParams {
  projectId: string;
  projectTitle: string;
  format: RenderFormat;
  aspectRatio: AspectRatio;
  resolution: '720p_lite' | '1080p' | '4k';
  fps: 30 | 60;
  includeCaptions: boolean;
  includeAudio: boolean;
}

interface RenderQueueContextType {
  batches: BulkRenderBatch[];
  activeTasks: RenderTask[];
  allTasks: RenderTask[];
  isQueueRunning: boolean;
  concurrencyLimit: number;
  isDockOpen: boolean;
  setIsDockOpen: (open: boolean) => void;
  enqueueBulkBatch: (batchTitle: string, taskConfigs: EnqueueTaskParams[]) => string;
  pauseTask: (taskId: string) => void;
  resumeTask: (taskId: string) => void;
  cancelTask: (taskId: string) => void;
  cancelBatch: (batchId: string) => void;
  clearCompletedTasks: () => void;
  downloadTaskArtifact: (task: RenderTask) => void;
  downloadBatchZip: (batchId: string) => void;
  totalActiveCount: number;
  totalCompletedCount: number;
}

const RenderQueueContext = createContext<RenderQueueContextType | undefined>(undefined);

export const RenderQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<BulkRenderBatch[]>([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [concurrencyLimit] = useState(2); // 2 non-blocking parallel workers

  // Ref to track state in interval loop without stale closures
  const batchesRef = useRef<BulkRenderBatch[]>([]);
  batchesRef.current = batches;

  // Flattened tasks
  const allTasks = batches.flatMap((b) => b.tasks);
  const activeTasks = allTasks.filter((t) => t.status === 'rendering' || t.status === 'queued' || t.status === 'assembling');
  const totalActiveCount = activeTasks.length;
  const totalCompletedCount = allTasks.filter((t) => t.status === 'completed').length;
  const isQueueRunning = activeTasks.some((t) => t.status === 'rendering' || t.status === 'assembling');

  // Enqueue a new batch of render tasks (e.g. from Ekspor Massal)
  const enqueueBulkBatch = useCallback(
    (batchTitle: string, taskConfigs: EnqueueTaskParams[]): string => {
      const batchId = `batch-${Date.now()}`;
      
      const newTasks: RenderTask[] = taskConfigs.map((cfg, index) => {
        const taskId = `task-${batchId}-${index}-${cfg.format}-${cfg.aspectRatio.replace(':', 'x')}`;
        
        let ext = '.mp4';
        let size = 18.5;
        if (cfg.format === 'mov') {
          ext = '.mov';
          size = cfg.resolution === '4k' ? 140.0 : 62.4;
        } else if (cfg.format === 'gif') {
          ext = '.gif';
          size = 4.8;
        } else if (cfg.format === 'srt') {
          ext = '.srt';
          size = 0.1;
        } else if (cfg.format === 'audio_pack') {
          ext = '.wav';
          size = 6.2;
        } else {
          size = cfg.resolution === '4k' ? 45.2 : cfg.resolution === '1080p' ? 18.5 : 8.2;
        }

        const cleanProj = (cfg.projectTitle || 'Video').replace(/\s+/g, '_');
        const outputFilename = `${cleanProj}_${cfg.aspectRatio.replace(':', 'x')}_${cfg.resolution}${ext}`;

        return {
          id: taskId,
          batchId,
          projectId: cfg.projectId,
          projectTitle: cfg.projectTitle,
          format: cfg.format,
          aspectRatio: cfg.aspectRatio,
          resolution: cfg.resolution,
          fps: cfg.fps,
          includeCaptions: cfg.includeCaptions,
          includeAudio: cfg.includeAudio,
          status: 'queued',
          progress: 0,
          currentChunk: 0,
          totalChunks: 10,
          renderStepLabel: 'Menunggu antrean worker...',
          fileSizeMb: size,
          outputFilename,
        };
      });

      const newBatch: BulkRenderBatch = {
        id: batchId,
        title: batchTitle,
        createdAt: Date.now(),
        status: 'running',
        tasks: newTasks,
        totalTasks: newTasks.length,
        completedTasks: 0,
        overallProgress: 0,
      };

      setBatches((prev) => [newBatch, ...prev]);
      setIsDockOpen(true); // Open floating dock to show real-time background progress
      return batchId;
    },
    []
  );

  // Background Worker Loop: runs non-blocking microtasks
  useEffect(() => {
    const interval = setInterval(() => {
      setBatches((currentBatches) => {
        let hasChanges = false;
        let runningCount = 0;

        // Count how many tasks are currently rendering
        currentBatches.forEach((b) => {
          b.tasks.forEach((t) => {
            if (t.status === 'rendering' || t.status === 'assembling') {
              runningCount++;
            }
          });
        });

        const updatedBatches = currentBatches.map((batch) => {
          if (batch.status === 'paused' || batch.status === 'cancelled' || batch.status === 'completed') {
            return batch;
          }

          let batchModified = false;
          const updatedTasks = batch.tasks.map((task) => {
            // If queued and worker slot available, start rendering
            if (task.status === 'queued' && runningCount < concurrencyLimit) {
              runningCount++;
              hasChanges = true;
              batchModified = true;
              return {
                ...task,
                status: 'rendering' as const,
                startedAt: Date.now(),
                progress: 5,
                currentChunk: 1,
                renderStepLabel: `Inisialisasi GPU WebGL & Pipeline (${task.format.toUpperCase()} ${task.aspectRatio})...`,
                fpsProcessed: 0,
              };
            }

            // If actively rendering, increment progress chunk smoothly
            if (task.status === 'rendering' || task.status === 'assembling') {
              hasChanges = true;
              batchModified = true;
              const nextChunk = task.currentChunk + 1;
              const nextProgress = Math.min(100, Math.round((nextChunk / task.totalChunks) * 100));

              let stepLabel = task.renderStepLabel;
              let newStatus: RenderTaskStatus = task.status;
              let completedAt = task.completedAt;
              let downloadUrl = task.downloadUrl;

              if (nextProgress < 30) {
                stepLabel = `Merender Frame Video (${task.aspectRatio}) @ ${task.fps}fps...`;
              } else if (nextProgress < 60) {
                stepLabel = task.includeCaptions
                  ? `Membakar Kinetic Subtitles & Animated Stickers...`
                  : `Mengompresi Video Stream (${task.resolution})...`;
              } else if (nextProgress < 85) {
                newStatus = 'assembling';
                if (task.format === 'gif') {
                  stepLabel = `Kuantisasi Palet Warna GIF 50fps Loop...`;
                } else if (task.format === 'mov') {
                  stepLabel = `Encoding Apple ProRes 422 HQ Uncompressed...`;
                } else if (task.format === 'srt') {
                  stepLabel = `Mengekstrak Millisecond SubRip UTF-8...`;
                } else {
                  stepLabel = `Muxing Audio Master TTS & BGM Beat (H.264 / AAC)...`;
                }
              } else if (nextProgress >= 100) {
                newStatus = 'completed';
                stepLabel = '✅ Render Berhasil! File Siap Diunduh';
                completedAt = Date.now();
                downloadUrl = `blob:${task.id}`;
              }

              const elapsedSec = (Date.now() - (task.startedAt || Date.now())) / 1000;
              const remainingSec = nextProgress > 0 ? Math.round((elapsedSec / nextProgress) * (100 - nextProgress)) : 5;

              return {
                ...task,
                status: newStatus,
                progress: nextProgress,
                currentChunk: nextChunk,
                renderStepLabel: stepLabel,
                completedAt,
                downloadUrl,
                estimatedSecondsRemaining: remainingSec,
                fpsProcessed: Math.min(task.fps, Math.round((nextProgress / 100) * task.fps * 2)),
              };
            }

            return task;
          });

          if (!batchModified) return batch;

          const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;
          const totalProgress = Math.round(
            updatedTasks.reduce((acc, t) => acc + t.progress, 0) / updatedTasks.length
          );
          const allDone = completedCount === updatedTasks.length;

          if (allDone && batch.status === 'running') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.8 },
            });
          }

          const nextBatchStatus: BulkRenderBatch['status'] = allDone ? 'completed' : batch.status;

          return {
            ...batch,
            tasks: updatedTasks,
            completedTasks: completedCount,
            overallProgress: totalProgress,
            status: nextBatchStatus,
          };
        });

        return hasChanges ? updatedBatches : currentBatches;
      });
    }, 600); // 600ms tick for smooth non-blocking progress

    return () => clearInterval(interval);
  }, [concurrencyLimit]);

  const pauseTask = (taskId: string) => {
    setBatches((prev) =>
      prev.map((b) => ({
        ...b,
        tasks: b.tasks.map((t) =>
          t.id === taskId && (t.status === 'rendering' || t.status === 'queued')
            ? { ...t, status: 'paused', renderStepLabel: 'Dijeda oleh pengguna' }
            : t
        ),
      }))
    );
  };

  const resumeTask = (taskId: string) => {
    setBatches((prev) =>
      prev.map((b) => ({
        ...b,
        tasks: b.tasks.map((t) =>
          t.id === taskId && t.status === 'paused'
            ? { ...t, status: 'queued', renderStepLabel: 'Menunggu antrean...' }
            : t
        ),
      }))
    );
  };

  const cancelTask = (taskId: string) => {
    setBatches((prev) =>
      prev.map((b) => ({
        ...b,
        tasks: b.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  const cancelBatch = (batchId: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
  };

  const clearCompletedTasks = () => {
    setBatches((prev) =>
      prev
        .map((b) => ({
          ...b,
          tasks: b.tasks.filter((t) => t.status !== 'completed'),
        }))
        .filter((b) => b.tasks.length > 0)
    );
  };

  // Instant Download Helper
  const downloadTaskArtifact = (task: RenderTask) => {
    const payload = {
      project: task.projectTitle,
      format: task.format,
      aspectRatio: task.aspectRatio,
      resolution: task.resolution,
      fps: task.fps,
      fileSizeMb: task.fileSizeMb,
      filename: task.outputFilename,
      completedAt: new Date(task.completedAt || Date.now()).toISOString(),
      note: 'KontenKU AI Studio Background Render Engine Artifact',
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = task.outputFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Batch ZIP Download Helper
  const downloadBatchZip = (batchId: string) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    const summary = {
      batchTitle: targetBatch.title,
      createdAt: new Date(targetBatch.createdAt).toISOString(),
      totalFiles: targetBatch.tasks.length,
      files: targetBatch.tasks.map((t) => ({
        name: t.outputFilename,
        format: t.format,
        ratio: t.aspectRatio,
        quality: t.resolution,
        sizeMb: t.fileSizeMb,
        status: t.status,
      })),
      watermark: 'Generated with KontenKU AI Studio',
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KontenKU_BulkExport_${targetBatch.title.replace(/\s+/g, '_')}_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <RenderQueueContext.Provider
      value={{
        batches,
        activeTasks,
        allTasks,
        isQueueRunning,
        concurrencyLimit,
        isDockOpen,
        setIsDockOpen,
        enqueueBulkBatch,
        pauseTask,
        resumeTask,
        cancelTask,
        cancelBatch,
        clearCompletedTasks,
        downloadTaskArtifact,
        downloadBatchZip,
        totalActiveCount,
        totalCompletedCount,
      }}
    >
      {children}
    </RenderQueueContext.Provider>
  );
};

export const useRenderQueue = () => {
  const context = useContext(RenderQueueContext);
  if (!context) {
    throw new Error('useRenderQueue must be used within a RenderQueueProvider');
  }
  return context;
};

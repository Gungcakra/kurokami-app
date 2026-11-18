import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  clearAllDownloads,
  downloadChapterAsPdf,
  openDownloadedChapter,
  removeDownload as removeDownloadFile,
  syncDownloads,
} from "../utils/downloadHelper";

const DownloadContext = createContext(null);

/**
 * Menyimpan state unduhan di satu tempat supaya daftar chapter (di Detail
 * maupun di dalam reader) dan tab Download melihat progress yang sama.
 * Unduhan dijalankan satu per satu lewat antrean sederhana.
 */
export const DownloadProvider = ({ children }) => {
  const [downloads, setDownloads] = useState([]);
  const [tasks, setTasks] = useState({});
  const [ready, setReady] = useState(false);

  const queueRef = useRef([]);
  const runningRef = useRef(false);
  const currentJobRef = useRef(null);
  const downloadedIdsRef = useRef(new Set());

  const applyDownloads = useCallback((list) => {
    downloadedIdsRef.current = new Set(list.map((item) => item.chapterId));
    setDownloads(list);
  }, []);

  const refresh = useCallback(async () => {
    const list = await syncDownloads();
    applyDownloads(list);
    setReady(true);
    return list;
  }, [applyDownloads]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTask = useCallback((chapterId, patch) => {
    setTasks((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], ...patch },
    }));
  }, []);

  const clearTask = useCallback((chapterId) => {
    setTasks((prev) => {
      const next = { ...prev };
      delete next[chapterId];
      return next;
    });
  }, []);

  const runQueue = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    while (queueRef.current.length > 0) {
      const job = queueRef.current.shift();
      const chapterId = job.chapter.chapter_id;

      if (job.cancelled) {
        clearTask(chapterId);
        continue;
      }

      currentJobRef.current = job;
      updateTask(chapterId, { status: "running", progress: 0, error: null });

      try {
        const meta = await downloadChapterAsPdf({
          chapter: job.chapter,
          manhwaTitle: job.manhwaTitle,
          shouldCancel: () => job.cancelled,
          onProgress: ({ progress, phase, page, totalPages }) =>
            updateTask(chapterId, {
              status: "running",
              progress,
              phase,
              page,
              totalPages,
            }),
        });

        setDownloads((prev) => {
          const next = [
            meta,
            ...prev.filter((item) => item.chapterId !== chapterId),
          ];
          downloadedIdsRef.current = new Set(next.map((i) => i.chapterId));
          return next;
        });
        clearTask(chapterId);
      } catch (error) {
        if (error?.cancelled) {
          clearTask(chapterId);
        } else {
          console.error("Download Error:", error);
          updateTask(chapterId, {
            status: "error",
            error: error?.message || "Gagal mengunduh chapter",
          });
        }
      } finally {
        currentJobRef.current = null;
      }
    }

    runningRef.current = false;
  }, [clearTask, updateTask]);

  const startDownload = useCallback(
    (chapter, manhwaTitle) => {
      const chapterId = chapter?.chapter_id;
      if (!chapterId) return;
      if (downloadedIdsRef.current.has(chapterId)) return;
      if (queueRef.current.some((job) => job.chapter.chapter_id === chapterId)) {
        return;
      }

      const current = currentJobRef.current;
      if (current?.chapter.chapter_id === chapterId && !current.cancelled) {
        return;
      }

      queueRef.current.push({ chapter, manhwaTitle, cancelled: false });
      updateTask(chapterId, {
        status: "queued",
        progress: 0,
        phase: "queued",
        error: null,
      });
      runQueue();
    },
    [runQueue, updateTask]
  );

  const cancelDownload = useCallback(
    (chapterId) => {
      if (!chapterId) return;

      queueRef.current = queueRef.current.filter(
        (job) => job.chapter.chapter_id !== chapterId
      );

      if (currentJobRef.current?.chapter.chapter_id === chapterId) {
        currentJobRef.current.cancelled = true;
      }

      clearTask(chapterId);
    },
    [clearTask]
  );

  const removeDownload = useCallback(
    async (chapterId) => {
      const list = await removeDownloadFile(chapterId);
      applyDownloads(list);
      return list;
    },
    [applyDownloads]
  );

  const clearDownloads = useCallback(async () => {
    const list = await clearAllDownloads();
    applyDownloads(list);
    return list;
  }, [applyDownloads]);

  const isDownloaded = useCallback(
    (chapterId) => downloads.some((item) => item.chapterId === chapterId),
    [downloads]
  );

  const totalSize = useMemo(
    () => downloads.reduce((sum, item) => sum + (item.size || 0), 0),
    [downloads]
  );

  const value = useMemo(
    () => ({
      downloads,
      tasks,
      ready,
      totalSize,
      isDownloaded,
      startDownload,
      cancelDownload,
      removeDownload,
      clearDownloads,
      openDownload: openDownloadedChapter,
      refresh,
    }),
    [
      downloads,
      tasks,
      ready,
      totalSize,
      isDownloaded,
      startDownload,
      cancelDownload,
      removeDownload,
      clearDownloads,
      refresh,
    ]
  );

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownload harus dipakai di dalam DownloadProvider");
  }
  return context;
};

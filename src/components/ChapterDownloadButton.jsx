import React, { memo, useCallback } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";

import { useDownload } from "../context/DownloadContext";

/**
 * Tombol unduh per chapter. Satu tombol menangani semua kondisi:
 * belum diunduh, antre, sedang berjalan, gagal, dan sudah tersimpan.
 */
const ChapterDownloadButton = memo(({ chapter, manhwaTitle, onNotify }) => {
  const { downloads, tasks, startDownload, cancelDownload, openDownload } =
    useDownload();

  const chapterId = chapter?.chapter_id;
  const task = tasks[chapterId];
  const saved = downloads.find((item) => item.chapterId === chapterId);
  const isActive = task?.status === "running" || task?.status === "queued";

  const handlePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isActive) {
      cancelDownload(chapterId);
      return;
    }

    if (saved) {
      try {
        await openDownload(saved);
      } catch (e) {
        onNotify?.({
          title: "Gagal Membuka",
          message: e?.message || "File PDF tidak dapat dibuka",
          type: "error",
        });
      }
      return;
    }

    startDownload(chapter, manhwaTitle);
  }, [
    chapter,
    chapterId,
    isActive,
    manhwaTitle,
    onNotify,
    openDownload,
    cancelDownload,
    saved,
    startDownload,
  ]);

  if (task?.status === "running") {
    const percent = Math.round((task.progress || 0) * 100);
    return (
      <TouchableOpacity
        onPress={handlePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="w-9 items-center justify-center mr-2"
      >
        <ActivityIndicator size="small" color="#EF4444" />
        <Text className="text-zinc-500 text-[8px] font-black mt-0.5">
          {percent}%
        </Text>
      </TouchableOpacity>
    );
  }

  if (task?.status === "queued") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="w-9 items-center justify-center mr-2"
      >
        <Ionicons name="time-outline" size={18} color="#71717A" />
        <Text className="text-zinc-600 text-[8px] font-black mt-0.5">ANTRE</Text>
      </TouchableOpacity>
    );
  }

  if (task?.status === "error") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="w-9 items-center justify-center mr-2"
      >
        <Ionicons name="refresh" size={18} color="#EF4444" />
        <Text className="text-red-500 text-[8px] font-black mt-0.5">ULANG</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="w-9 items-center justify-center mr-2"
    >
      <View
        className={`p-2 rounded-xl ${
          saved ? "bg-red-500/10" : "bg-zinc-soft"
        }`}
      >
        <Ionicons
          name={saved ? "document-text" : "download-outline"}
          size={16}
          color={saved ? "#EF4444" : "#71717A"}
        />
      </View>
    </TouchableOpacity>
  );
});

export default ChapterDownloadButton;

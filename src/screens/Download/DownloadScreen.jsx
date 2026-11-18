import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

import { useDownload } from "../../context/DownloadContext";
import { formatBytes } from "../../utils/downloadHelper";
import Alert from "../../components/Alert";

const PHASE_LABEL = {
  prepare: "Mengambil data chapter",
  download: "Menyusun halaman",
  save: "Menyimpan file",
  queued: "Menunggu antrean",
};

export default function DownloadScreen() {
  const insets = useSafeAreaInsets();
  const {
    downloads,
    tasks,
    ready,
    totalSize,
    refresh,
    removeDownload,
    clearDownloads,
    cancelDownload,
    openDownload,
  } = useDownload();

  const [refreshing, setRefreshing] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const activeTasks = Object.entries(tasks).filter(
    ([, task]) => task?.status === "running" || task?.status === "queued"
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleOpen = async (item) => {
    try {
      await openDownload(item);
    } catch (e) {
      setShowAlert({
        show: true,
        title: "Gagal Membuka",
        message: e?.message || "File PDF tidak dapat dibuka",
        type: "error",
      });
    }
  };

  const handleDeleteAction = async () => {
    try {
      if (itemToDelete) {
        await removeDownload(itemToDelete.chapterId);
      } else {
        await clearDownloads();
      }
    } catch (e) {
      setShowAlert({
        show: true,
        title: "Gagal Menghapus",
        message: e?.message || "File tidak dapat dihapus",
        type: "error",
      });
    } finally {
      setShowConfirmAlert(false);
      setItemToDelete(null);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-10">
        <Animatable.View animation="fadeIn" duration={1000}>
          <View className="flex-row items-center mb-4">
            <View className="h-[2px] w-8 bg-red-600 mr-3" />
            <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
              OFFLINE LIBRARY
            </Text>
          </View>
          <View className="flex-row justify-between items-end">
            <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
              Unduhan{"\n"}
              <Text className="text-zinc-700">Chapter.</Text>
            </Text>
            {downloads.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setItemToDelete(null);
                  setShowConfirmAlert(true);
                }}
                className="mb-2 bg-zinc-900 p-2 rounded-xl border border-white/5"
              >
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          {downloads.length > 0 && (
            <View className="flex-row items-center mt-3">
              <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px]">
                {downloads.length} Chapter
              </Text>
              <Text className="text-zinc-700 mx-2 text-[10px]">•</Text>
              <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px]">
                {formatBytes(totalSize)}
              </Text>
            </View>
          )}
        </Animatable.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#EF4444"
          />
        }
      >
        <View className="px-6">
          {/* SEDANG DIUNDUH */}
          {activeTasks.length > 0 && (
            <View className="mb-6">
              <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px] mb-3 ml-2">
                Sedang Diproses
              </Text>
              {activeTasks.map(([chapterId, task]) => (
                <View
                  key={chapterId}
                  className="bg-zinc-900/40 p-4 rounded-[24px] border border-white/[0.03] mb-3"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1 pr-3">
                      <ActivityIndicator size="small" color="#EF4444" />
                      <Text
                        numberOfLines={1}
                        className="text-white font-bold text-xs ml-3 flex-1"
                      >
                        {PHASE_LABEL[task.phase] || "Memproses"}
                        {task.page && task.totalPages
                          ? ` ${task.page}/${task.totalPages}`
                          : ""}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => cancelDownload(chapterId)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      className="bg-zinc-800 p-2 rounded-full"
                    >
                      <Ionicons name="close" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-red-600 rounded-full"
                      style={{
                        width: `${Math.round((task.progress || 0) * 100)}%`,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {downloads.length > 0
            ? downloads.map((item, index) => (
                <Animatable.View
                  key={item.chapterId}
                  animation="fadeInUp"
                  delay={Math.min(index, 8) * 50}
                  className="mb-4"
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleOpen(item)}
                    className="bg-zinc-900/40 flex-row items-center p-3 rounded-[28px] border border-white/[0.03]"
                  >
                    <View>
                      <Image
                        source={{ uri: item.thumbnail }}
                        style={{ width: 110, height: 75 }}
                        className="rounded-[18px] bg-zinc-800"
                        contentFit="cover"
                        transition={500}
                      />
                      <View className="absolute -top-1 -left-1 bg-red-600 px-2 py-0.5 rounded-full border-2 border-[#0F0F12]">
                        <Text className="text-white text-[8px] font-black uppercase">
                          PDF
                        </Text>
                      </View>
                    </View>

                    <View className="flex-1 ml-4 justify-center py-1">
                      <Text
                        numberOfLines={2}
                        className="text-white font-black text-sm leading-5 tracking-tight pr-2"
                      >
                        {item.manhwaTitle}
                      </Text>
                      <View className="flex-row items-center mt-1.5">
                        <Text className="text-white bg-red-700/40 font-black text-[10px] uppercase rounded-full px-2">
                          Chapter {item.chapterNumber}
                        </Text>
                        <Text className="text-zinc-700 mx-2 text-[10px]">•</Text>
                        <Text className="text-zinc-500 text-[10px] font-bold">
                          {item.pages} hal · {formatBytes(item.size)}
                        </Text>
                      </View>

                      <View className="flex-row items-center mt-3">
                        <Text className="text-zinc-700 text-[10px] font-bold uppercase tracking-tighter">
                          {formatDate(item.downloadedAt)}
                        </Text>
                        <Text className="text-zinc-800 mx-2 text-[10px]">|</Text>
                        <TouchableOpacity
                          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                          onPress={() => {
                            setItemToDelete(item);
                            setShowConfirmAlert(true);
                          }}
                          className="flex-row items-center"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={12}
                            color="#EF4444"
                          />
                          <Text className="text-primary-500 text-[10px] font-bold ml-1 uppercase tracking-tighter">
                            Hapus
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="bg-zinc-800 p-2.5 rounded-full">
                      <Ionicons name="open-outline" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              ))
            : ready &&
              activeTasks.length === 0 && (
                <Animatable.View
                  animation="fadeIn"
                  className="items-center justify-center mt-20"
                >
                  <View className="bg-zinc-900/50 p-8 rounded-full mb-6">
                    <Ionicons name="cloud-download-outline" size={80} color="#1A1A1F" />
                  </View>
                  <Text className="text-white font-black text-xl">
                    Belum Ada Unduhan
                  </Text>
                  <Text className="text-zinc-600 text-center mt-2 px-10">
                    Tekan ikon unduh di daftar chapter untuk menyimpannya
                    sebagai PDF dan membacanya tanpa internet.
                  </Text>
                </Animatable.View>
              )}
        </View>

        <View className="mt-20 items-center px-12 opacity-30">
          <View className="h-[1px] w-full bg-zinc-900" />
          <Text className="text-zinc-700 text-[10px] mt-4 font-black tracking-[4px]">
            KUROKAMI OFFLINE STORAGE
          </Text>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={showConfirmAlert}
        animationType="fade"
        onRequestClose={() => {
          setShowConfirmAlert(false);
          setItemToDelete(null);
        }}
      >
        <View
          className="flex-1 justify-center items-center px-10"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <Animatable.View
            animation="zoomIn"
            duration={300}
            className="w-full bg-[#18181B] border border-white/10 rounded-[32px] p-6 items-center"
          >
            <View className="bg-red-600/10 p-4 rounded-full mb-4">
              <Ionicons name="alert-circle" size={30} color="#EF4444" />
            </View>
            <Text className="text-white text-xl font-black mb-2 text-center">
              {itemToDelete ? "Hapus Unduhan Ini?" : "Hapus Semua Unduhan?"}
            </Text>
            <Text className="text-zinc-400 text-center font-medium leading-5 mb-6">
              {itemToDelete
                ? `File PDF "${itemToDelete.manhwaTitle} Chapter ${itemToDelete.chapterNumber}" akan dihapus dari perangkat.`
                : "Seluruh file PDF chapter yang tersimpan akan dihapus dari perangkat. Tindakan ini tidak dapat dibatalkan."}
            </Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                onPress={() => {
                  setShowConfirmAlert(false);
                  setItemToDelete(null);
                }}
                activeOpacity={0.8}
                className="flex-1 bg-zinc-800 py-4 rounded-2xl items-center border border-white/5"
              >
                <Text className="text-zinc-400 font-black uppercase tracking-widest">
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAction}
                activeOpacity={0.8}
                className="flex-1 bg-red-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-black uppercase tracking-widest">
                  Hapus
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <Alert showAlert={showAlert} setShowAlert={setShowAlert} />

      <LinearGradient
        colors={["transparent", "#0F0F12"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
        }}
        pointerEvents="none"
      />
    </View>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { clearReadChapters, getReadChapters } from "../utils/storageHelper";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getReadChapters();
      setHistoryData(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchHistory();
  }, [isFocused]);

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}j lalu`;
    return past.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmAlert(true);
  };

  const handleDeleteAction = async () => {
    try {
      if (itemToDelete) {
        const updatedHistory = historyData.filter((item) => item.id !== itemToDelete.id);
        await AsyncStorage.setItem("@read_chapters", JSON.stringify(updatedHistory));
        setHistoryData(updatedHistory);
      } else {
        await clearReadChapters();
        setHistoryData([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowConfirmAlert(false);
      setItemToDelete(null);
    }
  };

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchHistory}
            tintColor="#EF4444"
          />
        }
      >
        <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-10">
          <Animatable.View animation="fadeIn" duration={1000}>
            <View className="flex-row items-center mb-4">
              <View className="h-[2px] w-8 bg-red-600 mr-3" />
              <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
                HISTORY LOG
              </Text>
            </View>
            <View className="flex-row justify-between items-end">
              <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
                Riwayat{"\n"}
                <Text className="text-zinc-700">Baca.</Text>
              </Text>
              {historyData.length > 0 && (
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
          </Animatable.View>
        </View>

        <View className="px-6">
          {historyData.length > 0
            ? historyData.map((item, index) => (
                <Animatable.View
                  key={item.id}
                  animation="fadeInUp"
                  delay={index * 50}
                  className="mb-4"
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("Read", { chapterId: item.chapterId })
                    }
                    className="bg-zinc-900/40 flex-row items-center p-3 rounded-[28px] border border-white/[0.03]"
                  >
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 110, height: 75 }}
                        className="rounded-[18px] bg-zinc-800"
                        contentFit="cover"
                        transition={500}
                      />
                      <View className="absolute -top-1 -left-1 bg-red-600 px-2 py-0.5 rounded-full border-2 border-[#0F0F12]">
                        <Text className="text-white text-[8px] font-black uppercase">
                          {getRelativeTime(item.timestamp)}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-1 ml-4 justify-center py-1">
                      <View>
                        <Text
                          numberOfLines={2}
                          className="text-white font-black text-sm leading-5 tracking-tight pr-2"
                        >
                          {item.manhwaTitle}
                        </Text>
                        <View className="flex-row items-center mt-1.5">
                          <Text className="text-white bg-red-700/40 font-black text-[10px] uppercase rounded-full px-2">
                            Chapter {item.number}
                          </Text>
                          <Text className="text-zinc-700 mx-2 text-[10px]">•</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center mt-3">
                        <TouchableOpacity
                          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                          onPress={() => confirmDelete(item)}
                          className="flex-row items-center"
                        >
                          <Ionicons name="trash-outline" size={12} color="#EF4444" />
                          <Text className="text-primary-500 text-[10px] font-bold ml-1 uppercase tracking-tighter">
                            Hapus
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="bg-zinc-800 p-2.5 rounded-full">
                      <Ionicons name="chevron-forward" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              ))
            : !loading && (
                <Animatable.View animation="fadeIn" className="items-center justify-center mt-20">
                  <View className="bg-zinc-900/50 p-8 rounded-full mb-6">
                    <Ionicons name="reader-outline" size={80} color="#1A1A1F" />
                  </View>
                  <Text className="text-white font-black text-xl">Belum Ada Riwayat</Text>
                  <Text className="text-zinc-600 text-center mt-2 px-10">
                    Chapter yang kamu baca akan muncul di sini secara otomatis.
                  </Text>
                </Animatable.View>
              )}
        </View>

        <View className="mt-20 items-center px-12 opacity-30">
          <View className="h-[1px] w-full bg-zinc-900" />
          <Text className="text-zinc-700 text-[10px] mt-4 font-black tracking-[4px]">
            KUROKAMI LOG SYSTEM
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
              {itemToDelete ? "Hapus Riwayat Ini?" : "Hapus Semua Riwayat?"}
            </Text>
            <Text className="text-zinc-400 text-center font-medium leading-5 mb-6">
              {itemToDelete 
                ? `Apakah Anda yakin ingin menghapus "${itemToDelete.manhwaTitle} Chapter ${itemToDelete.number}" dari riwayat?` 
                : "Apakah Anda yakin ingin menghapus seluruh log pembacaan? Tindakan ini tidak dapat dibatalkan."}
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
                <Text className="text-zinc-400 font-black uppercase tracking-widest">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAction}
                activeOpacity={0.8}
                className="flex-1 bg-red-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-black uppercase tracking-widest">Hapus</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      <LinearGradient
        colors={["transparent", "#0F0F12"]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 150 }}
        pointerEvents="none"
      />
    </View>
  );
}
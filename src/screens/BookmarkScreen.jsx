import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import ManhwaCard from "../components/ManhwaCard";
import Alert from "../components/Alert";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function BookmarkScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [bookmarkList, setBookmarkList] = useState([]);
  const [filteredBookMark, setFilteredBookMark] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [showAlert, setShowAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem("@bookmarks");
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      setBookmarkList(data);
      setFilteredBookMark(data);
    } catch (e) {
      console.error("Error reading bookmarks", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setKeyword("");
      fetchBookmarks();
    }
  }, [isFocused]);

  const searchBookmarks = (query) => {
    setKeyword(query);
    if (query.trim() === "") {
      setFilteredBookMark(bookmarkList);
      return;
    }

    const filtered = bookmarkList.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBookMark(filtered);
  };

  const clearBookmarks = async () => {
    try {
      await AsyncStorage.removeItem("@bookmarks");
      setBookmarkList([]);
      setFilteredBookMark([]);
      setShowAlert({
        show: true,
        title: "Berhasil",
        message: "Semua bookmark telah dihapus.",
        type: "success",
      });
    } catch (e) {
      setShowAlert({
        show: true,
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus bookmark.",
        type: "error",
      });
    }
  };

  const confirmClear = () => {
    setShowConfirmAlert(true);
  };

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-6">
        <Animatable.View animation="fadeIn" duration={1000}>
          <View className="flex-row items-center mb-4">
            <View className="h-[2px] w-8 bg-red-600 mr-3" />
            <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
              Personal Library
            </Text>
          </View>

          <View className="flex-row justify-between items-end">
            <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
              Koleksi{"\n"}
              <Text className="text-zinc-700">Tersimpan.</Text>
            </Text>
            <View className="bg-zinc-900 px-4 py-2 rounded-2xl border border-white/5 flex-row items-center gap-4">
              <Text className="text-white font-black text-lg">
                {bookmarkList.length}
              </Text>
              <TouchableOpacity onPress={confirmClear} activeOpacity={0.8}>
                <Ionicons name="trash" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <Animatable.View animation="fadeIn" delay={500} className="mt-6">
            <View className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-2 border border-white/10">
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                className="ml-3 flex-1 text-zinc-400"
                placeholder="Cari di bookmark..."
                placeholderTextColor="#6B7280"
                value={keyword}
                onChangeText={searchBookmarks}
              />
            </View>
          </Animatable.View>
        </Animatable.View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            duration={1000}
          >
            <Ionicons name="reload" size={30} color="#EF4444" />
          </Animatable.View>
        </View>
      ) : bookmarkList.length > 0 ? (
        <FlatList
          data={filteredBookMark}
          numColumns={3}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="py-20 items-center">
              <Text className="text-zinc-600 font-bold">Manhwa tidak ditemukan.</Text>
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 120,
          }}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 12,
            marginBottom: 16
          }}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 50}
              style={{ width: (width - 56) / 3 }}
            >
              <ManhwaCard
                item={item}
                onPress={() =>
                  navigation.navigate("Detail", { id: item.id || item.manga_id })
                }
              />
            </Animatable.View>
          )}
        />
      ) : (
        <Animatable.View
          animation="fadeIn"
          className="flex-1 items-center justify-center px-12"
        >
          <View className="relative">
            <View className="absolute -inset-10 bg-red-600/5 rounded-full" />
            <Ionicons name="bookmark" size={80} color="#1A1A1F" />
          </View>
          <Text className="text-white font-black text-xl mt-8 text-center">
            Library Mu Kosong
          </Text>
          <Text className="text-zinc-600 text-sm text-center mt-2 leading-5">
            Mulai simpan manhwa favoritmu agar tidak ketinggalan update chapter terbaru.
          </Text>
          <View className="mt-10 h-[1px] w-12 bg-zinc-900" />
        </Animatable.View>
      )}

      <Modal
        transparent
        visible={showConfirmAlert}
        animationType="fade"
        onRequestClose={() => setShowConfirmAlert(false)}
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
            <Text className="text-white text-xl font-black mb-2 text-center">
              Hapus Semua Bookmark?
            </Text>
            <Text className="text-zinc-400 text-center font-medium leading-5 mb-6">
              Apakah Anda yakin ingin menghapus semua bookmark? Tindakan ini tidak dapat dibatalkan.
            </Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                onPress={() => setShowConfirmAlert(false)}
                activeOpacity={0.8}
                className="flex-1 bg-zinc-700 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-black uppercase tracking-widest">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  clearBookmarks();
                  setShowConfirmAlert(false);
                }}
                activeOpacity={0.8}
                className="flex-1 bg-red-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-black uppercase tracking-widest">Hapus</Text>
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
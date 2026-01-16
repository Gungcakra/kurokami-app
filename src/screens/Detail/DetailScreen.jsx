import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChapterList, useManhwaDetail } from "../../hooks/detail";

import Ionicons from "@expo/vector-icons/Ionicons";

import * as Haptics from "expo-haptics";

import * as Animatable from "react-native-animatable";

import { LinearGradient } from "expo-linear-gradient";

// Import Section

import { DetailSection } from "./DetailSection";

import { ChapterListSection } from "./ChapterListSection";

import { DetailSectionSkeleton } from "./DetailSectionSkeleton";

import { ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Alert from "../../components/Alert";
export default function DetailScreen({ route }) {
  const { id } = route.params;

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { manhwaDetail, loading } = useManhwaDetail(id);

  const chapterData = useChapterList(id);
  const [showAlert, setShowAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Main");

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",

      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handlePress = (type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (type === "read") {
      navigation.navigate("Read", {
        chapterId: manhwaDetail.latest_chapter_id,
      });
    }
  };

  const saveToBookmarks = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const dataToSave = {
        id: manhwaDetail?.manga_id,
        title: manhwaDetail.title,
        cover_image_url: manhwaDetail.cover_image_url,
        cover_portrait_url: manhwaDetail.cover_portrait_url,
        manga_id: manhwaDetail.manga_id,
        country_id: manhwaDetail.country_id,
        
        bookmarkedAt: new Date().toISOString(),
      };

      const existingBookmarks = await AsyncStorage.getItem("@bookmarks");
      let bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];

      const isExist = bookmarks.find((item) => item.id === dataToSave.id);

      if (isExist) {
        setShowAlert({
          show: true,
          title: "Info",
          message: "Manhwa sudah ada di bookmark",
          type: "info",
        });
        return;
      }

      bookmarks.push(dataToSave);

      await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));

      setShowAlert({
        show: true,
        title: "Sukses",
        message: "Manhwa " + manhwaDetail?.title + " berhasil disimpan ke bookmark!",
        type: "success",
      });
    } catch (error) {
      setShowAlert({
        show: true,
        title: "Error",
        message: "Gagal menyimpan ke bookmark",
        type: "error",
      });
      console.error("Gagal menyimpan bookmark:", error);
    }
  };

  const unBookmark = async () => {
    try {
      const existingBookmarks = await AsyncStorage.getItem("@bookmarks");
      let bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];
      bookmarks = bookmarks.filter(
        (item) => item.id !== manhwaDetail?.manga_id
      );
      await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
      setShowAlert({
        show: true,
        title: "Sukses",
        message: "Manhwa " + manhwaDetail?.title + " berhasil dihapus dari bookmark!",
        type: "success",
      });
    } catch (error) {
      setShowAlert({
        show: true,
        title: "Error",
        message: "Gagal menghapus dari bookmark",
        type: "error",
      });
      console.error("Gagal menghapus bookmark:", error);
    }
  };

  const [isBookmarked, setIsBookmarked] = React.useState(false);
  useEffect(() => {
    checkIfBookmarked();
  }, [manhwaDetail?.manga_id]);

  const checkIfBookmarked = async () => {
    try {
      const existingBookmarks = await AsyncStorage.getItem("@bookmarks");
      const bookmarks = existingBookmarks ? JSON.parse(existingBookmarks) : [];
      const bookmarked = bookmarks.some(
        (item) => item.id === manhwaDetail?.manga_id
      );
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const handleBookmarkPress = async () => {
    if (isBookmarked) {
      await unBookmark();
    } else {
      await saveToBookmarks();
    }
    checkIfBookmarked();
  };

  return (
    <View className="flex-1 bg-zinc-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        {loading ? (
          <DetailSectionSkeleton />
        ) : (
          <DetailSection
            item={manhwaDetail}
            navigation={navigation}
            insets={insets}
          />
        )}

        <ChapterListSection
          item={chapterData.chapters}
          navigation={navigation}
          order={chapterData.order}
          setOrder={chapterData.setOrder}
          page={chapterData.page}
          setPage={chapterData.setPage}
          totalPage={chapterData.totalPage}
          search={chapterData.search}
          setSearch={chapterData.setSearch}
          loading={chapterData.loading}
        />
      </ScrollView>

      <Animatable.View
        animation="fadeInUp"
        delay={800}
        style={{ paddingBottom: insets.bottom + 20 }}
        className="absolute bottom-0 left-0 right-0 px-8 pt-10"
      >
        <LinearGradient
          colors={["transparent", "#121215", "#121215"]}
          className="absolute inset-0"
        />

        <View className="flex-row gap-4 items-center bg-zinc-900/80 backdrop-blur-3xl p-3 rounded-[35px] border border-white/10">
          <TouchableOpacity
            onPress={handleBookmarkPress}
            className="bg-zinc-soft w-14 h-14 rounded-full justify-center items-center border border-zinc-border"
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? "#dc2626" : "white"}
            />
          </TouchableOpacity>

         <Alert showAlert={showAlert} setShowAlert={setShowAlert} />

          <TouchableOpacity
            onPress={() => handlePress("read")}
            activeOpacity={0.8}
            className="bg-red-600 flex-1 h-14 rounded-full flex-row justify-center items-center shadow-2xl shadow-red-600/50"
          >
            <Text className="text-white font-black text-lg mr-2 italic tracking-tighter">
              BACA SEKARANG
            </Text>

            <Ionicons name="rocket" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

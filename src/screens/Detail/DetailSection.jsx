import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alert from "../../components/Alert";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export const DetailSection = ({ item, insets, navigation }) => {
  const coverImg = item?.cover_portrait_url || item?.cover_image_url;
  const manhwaDetail = item;
  const [showAlert, setShowAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
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
        message:
          "Manhwa " + manhwaDetail?.title + " berhasil disimpan ke bookmark!",
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
        message:
          "Manhwa " + manhwaDetail?.title + " berhasil dihapus dari bookmark!",
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
    <View>
      {/* HERO SECTION CONTAINER */}
      <View className="relative h-[550px] w-full bg-[#0F0F12]">
        {/* 1. BACKGROUND IMAGE (FULL BLURRED) */}
        <Image
          source={{ uri: coverImg }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
          blurRadius={10} // Efek blur untuk background
        />

        {/* 2. OVERLAY HITAM OPACITY 0.6 */}
        <View className="absolute inset-0 bg-black/60" />

        {/* 3. GRADIENT KE ARAH BAWAH (Untuk menyambung ke Body) */}
        <View className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F0F12] to-transparent" />

        {/* 4. FLOATING SMALL IMAGE (IMAGE UTAMA DI TENAH) */}
        <View className="absolute inset-0 items-center justify-center pt-10">
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={styles.shadowContainer}
          >
            <Image
              source={{ uri: coverImg }}
              className="w-[220px] h-[320px] rounded-2xl border border-white/20"
              resizeMode="cover"
            />
          </Animatable.View>
        </View>

        {/* TOP BAR ACTIONS */}
        <View
          style={{ marginTop: insets.top + 10 }}
          className="absolute top-0 left-0 right-0 px-6 flex-row justify-between z-20"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-black/40 p-3 rounded-full border border-white/10"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row gap-3">
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
            {/* <TouchableOpacity className="bg-black/40 p-3 rounded-full border border-white/10">
              <Ionicons name="share-social-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-black/40 p-3 rounded-full border border-white/10">
              <Ionicons name="ellipsis-vertical" size={22} color="white" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* RANK BADGE */}
        <Animatable.View
          animation="fadeInRight"
          delay={500}
          className="absolute bottom-28 right-0 bg-red-600 px-4 py-2 rounded-l-full flex-row items-center z-10"
        >
          <Ionicons name="trophy" size={16} color="white" />
          <Text className="text-white font-black ml-2 text-xs">
            RANK #{item?.rank}
          </Text>
        </Animatable.View>
      </View>

      {/* INFO BODY */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        className="px-6 -mt-20 bg-[#0F0F12] rounded-t-[45px] pt-10 pb-10"
      >
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-black text-center leading-tight">
            {item?.title}
          </Text>
          <Text className="text-zinc-muted text-sm mt-1 italic opacity-70">
            {item?.alternative_title}
          </Text>

          <View className="flex-row mt-6 gap-6 bg-zinc-soft/50 p-4 rounded-3xl border border-zinc-border/50">
            <View className="items-center">
              <Text className="text-yellow-500 font-black text-lg">
                {" "}
                {item?.user_rate}
              </Text>
              <Text className="text-zinc-muted text-center text-[10px] uppercase font-bold tracking-widest">
                Rating
              </Text>
            </View>
            <View className="w-[1px] h-6 bg-zinc-border self-center" />
            <View className="items-center">
              <Text className="text-white font-black text-lg">
                {item?.view_count
                  ? (item.view_count / 1000000).toFixed(1)
                  : "0"}
                M
              </Text>
              <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-widest">
                Views
              </Text>
            </View>
            <View className="w-[1px] h-6 bg-zinc-border self-center" />
            <View className="items-center">
              <Text className="text-white font-black text-lg">
                {item?.release_year}
              </Text>
              <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-widest">
                Tahun
              </Text>
            </View>
          </View>

          <View>
            <View className="flex-row flex-wrap justify-center gap-3 mt-6">
              {item?.taxonomy?.Artist?.map((artist) => (
                <View
                  key={artist.taxonomy_id}
                  className="flex-row items-center bg-zinc-soft/50 px-3 py-1.5 rounded-lg border border-zinc-border/50"
                >
                  <Ionicons
                    name="brush-outline"
                    size={12}
                    color="#A1A1AA"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-zinc-300 text-[10px] font-bold uppercase">
                    {artist.name}
                  </Text>
                </View>
              ))}
              {item?.taxonomy?.Author?.map((author) => (
                <View
                  key={author.taxonomy_id}
                  className="flex-row items-center bg-zinc-soft/50 px-3 py-1.5 rounded-lg border border-zinc-border/50"
                >
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color="#A1A1AA"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-zinc-300 text-[10px] font-bold uppercase">
                    {author.name}
                  </Text>
                </View>
              ))}
              {item?.taxonomy?.Format?.map((format) => (
                <View
                  key={format.taxonomy_id}
                  className="flex-row items-center bg-zinc-soft/50 px-3 py-1.5 rounded-lg border border-zinc-border/50"
                >
                  <Ionicons
                    name="document-text-outline"
                    size={12}
                    color="#A1A1AA"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-zinc-300 text-[10px] font-bold uppercase">
                    {format.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* GENRES */}
        <View className="flex-row flex-wrap justify-center mb-8">
          {item?.taxonomy?.Genre?.map((genre) => (
            <TouchableOpacity
              key={genre.taxonomy_id}
              onPress={() => {
                navigation.navigate("Main", {
                  screen: "Explore",
                  params: { genre: genre.name },
                });
              }}
              className="bg-red-500/10 px-4 py-1.5 rounded-xl m-1 border border-red-500/20"
            >
              <Text className="text-white text-[11px] font-bold uppercase">
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SYNOPSIS */}
        <View className="mb-10 px-2">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-6 bg-red-600 mr-3 rounded-full" />
            <Text className="text-white text-lg font-black uppercase tracking-tighter">
              Synopsis
            </Text>
          </View>
          <Text className="text-zinc-400 leading-7 text-md font-medium opacity-90">
            {item?.description?.replace(/&quot;/g, '"') ||
              "No description available."}
          </Text>
        </View>
      </Animatable.View>

      <Alert showAlert={showAlert} setShowAlert={setShowAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 25, // Shadow untuk Android
  },
});

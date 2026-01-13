import React, { useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  BackHandler,
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

export default function DetailScreen({ route }) {
  const { id } = route.params;

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { manhwaDetail, loading } = useManhwaDetail(id);

  const chapterData = useChapterList(id);

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
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            className="bg-zinc-soft w-14 h-14 rounded-full justify-center items-center border border-zinc-border"
          >
            <Ionicons name="bookmark-outline" size={24} color="white" />
          </TouchableOpacity>

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

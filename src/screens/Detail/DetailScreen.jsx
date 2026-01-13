import React, { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, BackHandler, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChapterList, useManhwaDetail } from "../../hooks/detail";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// Import Sections
import { DetailSection } from "./DetailSection";
import { ChapterListSection } from "./ChapterListSection";
import { DetailSectionSkeleton } from "./DetailSectionSkeleton";

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { manhwaDetail, loading } = useManhwaDetail(id);
  const chapterData = useChapterList(id);

  // Back handler tetap aman kembali ke Main
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Main");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const handlePress = (type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === "read" && manhwaDetail?.latest_chapter_id) {
      navigation.navigate("Read", {
        chapterId: manhwaDetail.latest_chapter_id,
      });
    }
  };

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        // Optimasi scroll untuk list chapter yang banyak
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
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

        <View className="mt-4">
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
        </View>
      </ScrollView>

      {/* Floating Action Bar - Modern Redesign */}
      {!loading && (
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          delay={300}
          style={{ paddingBottom: insets.bottom + 12 }}
          className="absolute bottom-0 left-0 right-0 px-6 pt-10"
        >
          {/* Gradient penutup scroll agar tidak nabrak bar */}
          <LinearGradient
            colors={["transparent", "#0F0F12", "#0F0F12"]}
            className="absolute inset-0 h-40"
            pointerEvents="none"
          />

          <View className="flex-row gap-3 items-center bg-zinc-900/90 backdrop-blur-3xl p-2.5 rounded-[30px] border border-white/10 shadow-2xl">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Fungsi bookmark bisa ditambahkan di sini
              }}
              className="bg-zinc-800 w-14 h-14 rounded-full justify-center items-center border border-white/5"
            >
              <Ionicons name="bookmark-outline" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePress("read")}
              activeOpacity={0.9}
              className="bg-red-600 flex-1 h-14 rounded-[22px] flex-row justify-center items-center overflow-hidden"
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'transparent']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
              />
              <Text className="text-white font-black text-base mr-3 tracking-widest uppercase">
                Mulai Baca
              </Text>
              <View className="bg-white/20 p-1.5 rounded-lg">
                <Ionicons name="play" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
    </View>
  );
}

const StyleSheet = {
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
}
import React, { useState, memo, useCallback, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Pressable,
  StatusBar,
  Modal,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useChapterDetail } from "../../hooks/chapter";
import { useChapterList, useManhwaDetail } from "../../hooks/detail";
import { ChapterListSection } from "../Detail/ChapterListSection";
import { saveToStorage } from "../../utils/storageHelper";

const { width: windowWidth } = Dimensions.get("window");
const SETTINGS_KEY = "@reader_config_v3";

// --- COMPONENT: ITEM GAMBAR DENGAN HANDLING KUALITAS ---
const MangaImageItem = memo(({ uri, index, quality }) => {
  const [aspectRatio, setAspectRatio] = useState(0.72);
  const [loading, setLoading] = useState(true);

  return (
    <View
      style={{
        width: windowWidth,
        height: windowWidth / aspectRatio,
        backgroundColor: "#000",
      }}
    >
      {loading && (
        <View style={styles.absoluteCenter}>
          <ActivityIndicator size="small" color="#EF4444" />
          <Text style={styles.textTinyBold}>MEMUAT {index + 1}</Text>
        </View>
      )}
      <Image
        source={{
          uri: uri,
          width: quality === "low" ? windowWidth * 0.4 : windowWidth * 1.5,
        }}
        style={{ width: "100%", height: "100%" }}
        contentFit="fill"
        cachePolicy={quality === "low" ? "disk" : "memory-disk"}
        priority={quality === "hd" ? "high" : "normal"}
        recyclingKey={uri}
        onLoad={(event) => {
          const { width, height } = event.source;
          if (width && height) setAspectRatio(width / height);
          setLoading(false);
        }}
      />
    </View>
  );
});

// --- MAIN SCREEN ---
export default function ReadScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollOffset = useRef(0);

  const [currentChapterId, setCurrentChapterId] = useState(
    route.params?.chapterId
  );
  const [showChapterListModal, setShowChapterListModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [quality, setQuality] = useState("hd");
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);

  const { chapterDetail, loading: apiLoading } =
    useChapterDetail(currentChapterId);
  const { manhwaDetail } = useManhwaDetail(chapterDetail?.manga_id);
  const chapterList = useChapterList(chapterDetail?.manga_id);

  const imagesData = chapterDetail?.chapter?.data || [];

  // Storage Logic
  useEffect(() => {
    (async () => {
      const val = await AsyncStorage.getItem(SETTINGS_KEY);
      if (val) {
        const { quality: q, speed: s } = JSON.parse(val);
        setQuality(q);
        setAutoScrollSpeed(s);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ quality, speed: autoScrollSpeed })
    );
  }, [quality, autoScrollSpeed]);

  // Smooth Auto Scroll Engine
  useEffect(() => {
    if (autoScrollSpeed > 0) {
      scrollInterval.current = setInterval(() => {
        scrollOffset.current += autoScrollSpeed * 4;
        flatListRef.current?.scrollToOffset({
          offset: scrollOffset.current,
          animated: false,
        });
      }, 25);
    } else {
      clearInterval(scrollInterval.current);
    }
    return () => clearInterval(scrollInterval.current);
  }, [autoScrollSpeed]);

  const handleChapterChange = (newId) => {
    if (!newId) return;
    setCurrentChapterId(newId);
    scrollOffset.current = 0;
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  useEffect(() => {
    if (chapterDetail) {
      saveToStorage({
        chapter: chapterDetail,
        manhwaTitle: manhwaDetail?.title,
      });
    }
  }, [chapterDetail, manhwaDetail?.title]);

  if (apiLoading || !chapterDetail) {
    return (
      <View style={styles.bgDarkFullCenter}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={styles.textLoading}>MENGUNDUH DATA...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden={!showControls} translucent />

      <FlatList
        ref={flatListRef}
        data={imagesData}
        keyExtractor={(_, i) => `${currentChapterId}-${i}`}
        onScroll={(e) => {
          scrollOffset.current = e.nativeEvent.contentOffset.y;
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              setShowControls(!showControls);
              setShowSettings(false);
            }}
          >
            <MangaImageItem
              uri={`${chapterDetail.base_url}/${chapterDetail.chapter?.path}/${item}`}
              index={index}
              quality={quality}
            />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* HEADER: Tailwind style fixed top */}
      {showControls && (
        <Animatable.View
          animation="slideInDown"
          duration={300}
          style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.flexRowCenterBetween}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.roundIconBtn}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <View style={styles.itemsCenter}>
              <Text numberOfLines={1} style={styles.textTitleMain}>
                {manhwaDetail?.title || "Reading"}
              </Text>
              <Text style={styles.textChapterRed}>
                CHAPTER {chapterDetail?.chapter_number}
              </Text>
            </View>
            <View style={{ width: 45 }} />
          </View>
        </Animatable.View>
      )}

      {/* SETTINGS PANEL: Smooth slide up animation */}
      {showControls && showSettings && (
        <Animatable.View
          animation="fadeInUp"
          duration={400}
          easing="ease-out-expo"
          style={[styles.settingsPanel, { bottom: insets.bottom + 100 }]}
        >
          <View style={styles.panelHandle} />

          {/* Quality Section */}
          <View>
            <Text style={[styles.textLabel, { marginBottom: 12 }]}>
              Kualitas Gambar
            </Text>
            <View style={styles.segmentedBg}>
              {[
                { id: "low", n: "LOW" },
                { id: "hd", n: "HD" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setQuality(item.id)}
                  style={[
                    styles.segmentBtn,
                    quality === item.id && styles.segmentBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.textSegment,
                      quality === item.id && { color: "white" },
                    ]}
                  >
                    {item.n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scroll Speed Section */}
          <View style={{ marginTop: 24 }}>
            <View style={styles.flexRowCenterBetween}>
              <Text style={styles.textLabel}>Scroll Otomatis</Text>
              <View style={styles.badgeRed}>
                <Text style={styles.textBadge}>
                  {autoScrollSpeed === 0 ? "MATI" : `${autoScrollSpeed}x`}
                </Text>
              </View>
            </View>
            <Slider
              style={{ width: "100%", height: 50 }}
              minimumValue={0}
              maximumValue={3}
              step={0.5}
              value={autoScrollSpeed}
              onValueChange={setAutoScrollSpeed}
              minimumTrackTintColor="#EF4444"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#EF4444"
            />
            <View style={styles.flexRowCenterBetween}>
              {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
                <Text
                  key={v}
                  style={[
                    styles.textTick,
                    autoScrollSpeed === v && { color: "#EF4444" },
                  ]}
                >
                  {v === 0 ? "Off" : v}
                </Text>
              ))}
            </View>
          </View>
        </Animatable.View>
      )}

      {/* BOTTOM BAR: Floating design */}
      {showControls && (
        <Animatable.View
          animation="slideInUp"
          duration={300}
          style={[styles.bottomBar, { bottom: insets.bottom + 15 }]}
        >
          <TouchableOpacity
            onPress={() => handleChapterChange(chapterDetail.prev_chapter_id)}
            disabled={!chapterDetail.prev_chapter_id}
            style={[
              styles.navCircleBtn,
              !chapterDetail.prev_chapter_id && { opacity: 0.2 },
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.flexRowCenter}>
            <TouchableOpacity
              onPress={() => setShowChapterListModal(true)}
              style={styles.btnChapterSelect}
            >
              {/* <Ionicons
                name="grid"
                size={18}
                color="#EF4444"
                style={{ marginRight: 8 }}
              /> */}
              <Text style={styles.textBoldWhite}>
                Chapter {chapterDetail?.chapter_number}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSettings(!showSettings)}
              style={[
                styles.navCircleBtn,
                showSettings && { backgroundColor: "#EF4444" },
              ]}
            >
              <Ionicons
                name={showSettings ? "close" : "options-outline"}
                size={22}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleChapterChange(chapterDetail.next_chapter_id)}
            disabled={!chapterDetail.next_chapter_id}
            style={[
              styles.navCircleBtn,
              !chapterDetail.next_chapter_id && { opacity: 0.2 },
            ]}
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* MODAL LIST CHAPTER */}
      <ChapterListModal
        visible={showChapterListModal}
        onClose={() => setShowChapterListModal(false)}
        chapterList={chapterList}
        onSelectChapter={handleChapterChange}
      />
    </View>
  );
}

// --- STYLES: TAILWIND-LIKE CLASSES ---
const styles = StyleSheet.create({
  // Utils
  absoluteCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  bgDarkFullCenter: {
    flex: 1,
    backgroundColor: "#0A0A0C",
    justifyContent: "center",
    alignItems: "center",
  },
  flexRowCenterBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRowCenter: { flexDirection: "row", alignItems: "center" },
  itemsCenter: { alignItems: "center" },

  // Texts
  textTinyBold: {
    color: "#3F3F46",
    fontSize: 10,
    marginTop: 8,
    fontWeight: "800",
  },
  textLoading: {
    color: "white",
    marginTop: 15,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  textTitleMain: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    textTransform: "uppercase",
  },
  textChapterRed: { color: "#EF4444", fontWeight: "800", fontSize: 11 },
  textLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  textBadge: { color: "white", fontSize: 10, fontWeight: "bold" },
  textTick: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold" },
  textSegment: { color: "#FFFFFF", fontSize: 11, fontWeight: "bold" },
  textBoldWhite: { color: "white", fontWeight: "900", fontSize: 14 },

  // Components
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(9,9,11,0.9)",
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 50,
  },
  roundIconBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 15,
  },

  settingsPanel: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#18181B",
    borderRadius: 35,
    padding: 24,
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#27272A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#3F3F46",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  badgeRed: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  segmentedBg: {
    flexDirection: "row",
    backgroundColor: "#09090B",
    borderRadius: 20,
    padding: 5,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 16,
  },
  segmentBtnActive: { backgroundColor: "#EF4444" },

  bottomBar: {
    position: "absolute",
    left: 15,
    right: 15,
    height: 80,
    backgroundColor: "#18181B",
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  btnChapterSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#09090B",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 30,
    marginRight: 10,
  },
  navCircleBtn: {
    width: 52,
    height: 52,
    backgroundColor: "#27272A",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});

// --- MODAL CHAPTER RE-STYLED ---
const ChapterListModal = memo(
  ({ visible, onClose, chapterList, onSelectChapter }) => {
    const insets = useSafeAreaInsets();
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)" }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            style={{
              height: "85%",
              backgroundColor: "#0F0F12",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingTop: 20,
              paddingBottom: insets.bottom + 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 30,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }}>
                Pilih Chapter
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: "#27272A",
                  padding: 10,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ChapterListSection
              item={chapterList}
              onSelectChapter={onSelectChapter}
              onClose={onClose}
              navigation={{ navigate: () => {} }}
              isSheet={true}
              order={chapterList.order}
              setOrder={chapterList.setOrder}
              page={chapterList.page}
              setPage={chapterList.setPage}
              totalPage={chapterList.totalPage}
              loading={chapterList.loading}
            />
          </Animatable.View>
        </View>
      </Modal>
    );
  }
);

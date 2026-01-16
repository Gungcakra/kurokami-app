import React, { useState, memo, useCallback, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StatusBar,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { useChapterDetail } from "../../hooks/chapter";
import { useChapterList, useManhwaDetail } from "../../hooks/detail";
import { ChapterListSection } from "../Detail/ChapterListSection";
import { saveToStorage } from "../../utils/storageHelper";

const { width: windowWidth } = Dimensions.get("window");

const ChapterListModal = memo(
  ({ visible, onClose, chapterList, currentChapterId, onSelectChapter }) => {
    const insets = useSafeAreaInsets();

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />

          <View
            style={{
              height: "85%",
              backgroundColor: "#0F0F12",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              borderTopWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              paddingTop: 30,
              paddingHorizontal: 24,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-2xl font-black tracking-tighter">
                Chapters
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-zinc-soft p-2 rounded-full"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <ChapterListSection
                item={chapterList}
                navigation={{ navigate: () => {} }}
                onSelectChapter={onSelectChapter}
                onClose={onClose}
                order={chapterList.order}
                setOrder={chapterList.setOrder}
                page={chapterList.page}
                setPage={chapterList.setPage}
                totalPage={chapterList.totalPage}
                search={chapterList.search}
                setSearch={chapterList.setSearch}
                loading={chapterList.loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const MangaImageItem = memo(({ uri, index }) => {
  const [aspectRatio, setAspectRatio] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <View style={[styles.imageContainer, { minHeight: windowWidth / 0.7 }]}>
      {!isLoaded && (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator size="small" color="#EF4444" />
          <Text style={styles.loadingText}>PAGE {index + 1}</Text>
        </View>
      )}
      <Image
        source={uri}
        style={{
          width: windowWidth,
          height: windowWidth / aspectRatio,
          opacity: isLoaded ? 1 : 0,
        }}
        contentFit="contain"
        cachePolicy="disk"
        transition={400}
        onLoad={(event) => {
          const { width, height } = event.source;
          if (width && height) setAspectRatio(width / height);
          setIsLoaded(true);
        }}
      />
    </View>
  );
});

export default function ReadScreen({ navigation, route }) {
  const [currentChapterId, setCurrentChapterId] = useState(
    route.params?.chapterId
  );
  const [showChapterListModal, setShowChapterListModal] = useState(false);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const { chapterDetail, loading: apiLoading } =
    useChapterDetail(currentChapterId);
  const { manhwaDetail } = useManhwaDetail(chapterDetail?.manga_id);
  const [showControls, setShowControls] = useState(true);
  const chapterList = useChapterList(chapterDetail?.manga_id);

  useEffect(() => {
    if (chapterDetail && manhwaDetail) {
      saveToStorage({
        chapter: chapterDetail,
        manhwaTitle: manhwaDetail.title || "Manhwa",
      });
    }
  }, [chapterDetail, manhwaDetail]);

  const toggleControls = useCallback(
    () => setShowControls((prev) => !prev),
    []
  );

  const scrollToTop = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }, 100);
  };

  const handleChapterChange = (newId) => {
    if (newId) {
      setCurrentChapterId(newId);
      setShowControls(true);
      scrollToTop();
    }
  };

  if (apiLoading && !chapterDetail)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );

  return (
    <View style={styles.mainContainer}>
      <StatusBar hidden={!showControls} translucent />

      <FlatList
        ref={flatListRef}
        data={chapterDetail?.chapter?.data || []}
        keyExtractor={(item, index) => `${currentChapterId}-${index}`}
        renderItem={({ item, index }) => (
          <Pressable onPress={toggleControls}>
            <MangaImageItem
              uri={`${chapterDetail.base_url}/${chapterDetail.chapter?.path}/${item}`}
              index={index}
            />
          </Pressable>
        )}
        removeClippedSubviews={false}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScrollBeginDrag={() => showControls && setShowControls(false)}
      />

      <ChapterListModal
        visible={showChapterListModal}
        onClose={() => setShowChapterListModal(false)}
        chapterList={chapterList}
        currentChapterId={currentChapterId}
        onSelectChapter={handleChapterChange}
      />

      {showControls && (
        <Animatable.View
          animation="fadeInDown"
          duration={250}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleArea}>
              <Text numberOfLines={1} style={styles.titleText}>
                {manhwaDetail?.title || "Reading..."}
              </Text>
              <Text style={styles.chapterText}>
                Chapter {chapterDetail?.chapter_number}
              </Text>
            </View>
          </View>
        </Animatable.View>
      )}

      {showControls && (
        <Animatable.View
          animation="fadeInUp"
          duration={250}
          style={[styles.bottomBar, { bottom: insets.bottom + 20 }]}
        >
          <TouchableOpacity
            onPress={() => handleChapterChange(chapterDetail.prev_chapter_id)}
            disabled={!chapterDetail?.prev_chapter_id || apiLoading}
            style={[
              styles.navBtn,
              !chapterDetail?.prev_chapter_id && styles.disabledBtn,
            ]}
          >
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.centerInfo}>
            <TouchableOpacity onPress={() => setShowChapterListModal(true)}>
              <Text
                style={styles.infoText}
                className="text-center bg-zinc-soft px-4 py-2 rounded-full"
              >
                Chapter {chapterDetail?.chapter_number}
              </Text>
            </TouchableOpacity>
            <Text style={styles.subInfoText}>TAP FOR LIST</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleChapterChange(chapterDetail.next_chapter_id)}
            disabled={!chapterDetail?.next_chapter_id || apiLoading}
            style={[
              styles.navBtn,
              !chapterDetail?.next_chapter_id && styles.disabledBtn,
            ]}
          >
            <Ionicons name="chevron-forward" size={22} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#000" },
  centerContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: { width: windowWidth, backgroundColor: "#000" },
  imagePlaceholder: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F12",
    zIndex: 1,
  },
  loadingText: {
    color: "#333",
    fontSize: 10,
    marginTop: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10, 10, 12, 0.96)",
    paddingBottom: 15,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconBtn: { backgroundColor: "#1A1A1E", padding: 8, borderRadius: 20 },
  headerTitleArea: { flex: 1, alignItems: "center", marginRight: 40 },
  titleText: { color: "white", fontWeight: "900", fontSize: 15 },
  chapterText: { color: "#EF4444", fontWeight: "bold", fontSize: 11 },
  bottomBar: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "rgba(15, 15, 18, 0.96)",
    padding: 12,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#222",
  },
  navBtn: { backgroundColor: "#EF4444", padding: 10, borderRadius: 20 },
  disabledBtn: { backgroundColor: "#222", opacity: 0.5 },
  centerInfo: { alignItems: "center" },
  infoText: { color: "white", fontWeight: "bold", fontSize: 14 },
  subInfoText: { color: "#555", fontSize: 8, fontWeight: "900" },
});

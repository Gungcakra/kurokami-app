import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ChapterListSheet = ({
  item,
  navigation,
  order,
  setOrder,
  page,
  setPage,
  totalPage,
  search,
  setSearch,
  loading,
  onSelectChapter,
  onClose,
}) => {
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const releaseDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - releaseDate) / 1000);
    const isNew = diffInSeconds < 86400 && diffInSeconds >= 0;

    if (diffInSeconds < 60) return { text: "Baru saja", isNew };
    if (diffInSeconds < 3600)
      return { text: `${Math.floor(diffInSeconds / 60)} menit lalu`, isNew };
    if (diffInSeconds < 86400)
      return { text: `${Math.floor(diffInSeconds / 3600)} jam lalu`, isNew };

    return {
      text: releaseDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isNew,
    };
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F12" }}>
      <Animatable.View animation="fadeInUp" style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between mb-8 px-6 pt-4">
          <View>
            <View className="flex-row items-center ">
              <View className="w-1 h-6 bg-red-600 mr-3 rounded-full" />
              <Text className="text-white text-xl font-black uppercase tracking-tighter">
                Daftar Chapter
              </Text>
            </View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-[2px]">
              Halaman {page} dari {totalPage}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setOrder(order === "desc" ? "asc" : "desc")}
            className="flex-row items-center bg-zinc-soft px-4 py-2.5 rounded-2xl border border-zinc-border"
          >
            <Ionicons name="swap-vertical" size={16} color="#EF4444" />
            <Text className="text-white font-bold ml-2 text-xs uppercase">
              {order === "desc" ? "Terbaru" : "Terlama"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mx-6 flex-row items-center bg-zinc-soft/50 rounded-[24px] px-5 border border-zinc-border/50 mb-6 h-14">
          <Ionicons name="search-outline" size={20} color="#71717A" />
          <TextInput
            placeholder="Lompat ke chapter..."
            placeholderTextColor="#52525B"
            className="flex-1 ml-3 text-white font-bold text-base"
            keyboardType="numeric"
            value={search}
            onChangeText={(txt) => {
              setSearch(txt);
              setPage(1);
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          >
            {loading ? (
              <View className="py-20 items-center">
                <Animatable.View
                  animation="rotate"
                  iterationCount="infinite"
                  duration={1000}
                >
                  <Ionicons name="reload" size={24} color="#EF4444" />
                </Animatable.View>
              </View>
            ) : (
              (() => {
                const dataArray = Array.isArray(item)
                  ? item
                  : item?.data || item?.chapters || item?.items || [];

                if (dataArray.length === 0) {
                  return (
                    <View className="py-10 items-center">
                      <Text className="text-zinc-500 font-bold">
                        Chapter tidak ditemukan
                      </Text>
                    </View>
                  );
                }

                return dataArray.map((chapter, index) => {
                  const { text, isNew } = getRelativeTime(chapter.release_date);

                  return (
                    <TouchableOpacity
                      key={chapter.id || chapter.chapter_id || index}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (onSelectChapter) {
                          onSelectChapter(chapter.chapter_id);
                          onClose?.();
                        } else {
                          navigation.navigate("Read", {
                            chapterId: chapter.chapter_id,
                          });
                        }
                      }}
                      className="bg-zinc-soft/40 p-4 rounded-[28px] border border-zinc-border/30 flex-row items-center mb-4"
                    >
                      <View>
                        <Image
                          source={{ uri: chapter.thumbnail_image_url }}
                          className="w-20 h-14 rounded-2xl bg-zinc-soft"
                        />
                        {isNew && (
                          <View className="absolute -top-1 -left-1 bg-red-600 px-2 py-0.5 rounded-lg border-2 border-[#0F0F12]">
                            <Text className="text-white text-[8px] font-black uppercase">
                              NEW
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="ml-4 flex-1">
                        <Text className="text-white font-black text-lg tracking-tight">
                          Chapter {chapter.chapter_number}
                        </Text>
                        <Text
                          className={`text-[10px] font-bold uppercase mt-1 ${
                            isNew ? "text-red-500" : "text-zinc-500"
                          }`}
                        >
                          {text}
                        </Text>
                      </View>

                      <View
                        className={`p-2 rounded-xl ${
                          isNew ? "bg-red-500/10" : "bg-zinc-soft"
                        }`}
                      >
                        <Ionicons
                          name={isNew ? "flash" : "chevron-forward"}
                          size={20}
                          color={isNew ? "#EF4444" : "#3F3F46"}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                });
              })()
            )}

          </ScrollView>
        </View>
        <View className="flex-row justify-center items-center mb-8 gap-2 pt-2 pb-6">
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage(page - 1)}
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              page === 1
                ? "bg-zinc-soft/30"
                : "bg-zinc-soft border border-zinc-border"
            }`}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={page === 1 ? "#3F3F46" : "white"}
            />
          </TouchableOpacity>

          {[...Array(totalPage)].map((_, i) => {
            const p = i + 1;
            if (
              p === 1 ||
              p === totalPage ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    page === p ? "bg-red-500" : "bg-zinc-soft"
                  }`}
                >
                  <Text className="text-white font-bold">{p}</Text>
                </TouchableOpacity>
              );
            }
            if (
              (p === 2 && page > 3) ||
              (p === totalPage - 1 && page < totalPage - 2)
            ) {
              return (
                <Text key={`dot-${p}`} className="text-zinc-600">
                  ...
                </Text>
              );
            }
            return null;
          })}

          <TouchableOpacity
            disabled={page === totalPage}
            onPress={() => setPage(page + 1)}
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              page === totalPage
                ? "bg-zinc-soft/30"
                : "bg-zinc-soft border border-zinc-border"
            }`}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={page === totalPage ? "#3F3F46" : "white"}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};
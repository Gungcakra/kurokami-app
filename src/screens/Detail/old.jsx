import React from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ChapterListSection = ({
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
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      className="px-6 bg-zinc-bg pb-48"
    >
      <View className="flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-white text-2xl font-black tracking-tighter italic">
            Daftar Chapter
          </Text>
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

      <View className="flex-row items-center bg-zinc-soft/50 rounded-[24px] px-5 border border-zinc-border/50 mb-8 h-14">
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

      {loading ? (
        <View className="py-20 items-center">
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            duration={1000}
          >
            <Ionicons name="reload" size={24} color="#EF4444" />
          </Animatable.View>
          <Text className="text-zinc-500 mt-4 font-bold">Memuat list...</Text>
        </View>
      ) : (
        item.map((chapter, index) => {
          const { text, isNew } = getRelativeTime(chapter.release_date);

          return (
            <TouchableOpacity
              key={chapter.id || index}
              
              activeOpacity={0.8}
              className="bg-zinc-soft/40 p-4 rounded-[28px] border border-zinc-border/30 flex-row items-center mb-4"
            >
              <View>
                <Image
                  source={{ uri: chapter.thumbnail_image_url }}
                  className="w-20 h-14 rounded-2xl bg-zinc-soft"
                />
                {isNew && (
                  <View className="absolute -top-1 -left-1 bg-red-600 px-2 py-0.5 rounded-lg border-2 border-zinc-bg">
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
                  className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
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
        })
      )}

      {/* PAGINATION */}
      <View className="flex-row justify-center items-center mt-10 gap-2">
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          className={`w-12 h-12 rounded-2xl items-center justify-center ${
            page === 1 ? "opacity-20" : "bg-zinc-soft border border-zinc-border"
          }`}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

        {[...Array(totalPage)].map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPage || (p >= page - 1 && p <= page + 1)) {
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPage(p)}
                className={`w-12 h-12 rounded-2xl items-center justify-center ${
                  page === p
                    ? "bg-red-600 shadow-lg shadow-red-600/40"
                    : "bg-zinc-soft border border-zinc-border/50"
                }`}
              >
                <Text className="text-white font-black text-base">{p}</Text>
              </TouchableOpacity>
            );
          }
          if (p === page - 2 || p === page + 2)
            return (
              <Text key={p} className="text-zinc-600 font-bold px-1">
                ...
              </Text>
            );
          return null;
        })}

        <TouchableOpacity
          disabled={page === totalPage}
          onPress={() => setPage(page + 1)}
          className={`w-12 h-12 rounded-2xl items-center justify-center ${
            page === totalPage
              ? "opacity-20"
              : "bg-zinc-soft border border-zinc-border"
          }`}
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

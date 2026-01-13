import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import ManhwaCard from "../../components/ManhwaCard";
import { useExplore, useGenres } from "../../hooks/home";
import { FilterSheet } from "../../components/FilterSheet";

export default function ExploreScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isFilterVisible, setFilterVisible] = useState(false);

  const { genres: genreList } = useGenres();
  const { data, loading, loadingMore, filters, updateFilter, loadMore } =
    useExplore();

  const formats = ["manhwa", "manga", "manhua", "all"];
  const statuses = [
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Hiatus", value: "hiatus" },
  ];

  return (
    <View className="flex-1 bg-zinc-bg" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-white text-3xl font-black mb-4 italic tracking-tighter">
          Explore
        </Text>

        <View className="flex-row gap-3 items-center">
            <View className="flex-1 flex-row items-center bg-zinc-soft/50 p-4 rounded-2xl border border-zinc-border/50">
              <Ionicons name="search" size={20} color="#71717A" />
              <TextInput
                placeholder="Cari judul..."
                placeholderTextColor="#71717A"
                className="flex-1 ml-3 text-white font-bold"
                // Sesuaikan dengan state keyword
                value={filters.keyword}
                onChangeText={(text) => updateFilter("keyword", text)}
              />
              {filters.keyword?.length > 0 && (
                <TouchableOpacity onPress={() => updateFilter("keyword", "")}>
                  <Ionicons name="close-circle" size={18} color="#71717A" />
                </TouchableOpacity>
              )}
            </View>

          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            className="bg-red-600 w-14 h-14 rounded-2xl justify-center items-center shadow-lg shadow-red-600/20"
          >
            <Ionicons name="options" size={24} color="white" />
            {/* Indicator jika filter aktif */}
            {(filters.genres.length > 0 || filters.status) && (
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-red-600" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.manga_id}-${index}`}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          paddingHorizontal: 16,
        }}
        renderItem={({ item }) => (
          <View style={{ width: "33.3%", padding: 6 }}>
            <ManhwaCard
              item={item}
              onPress={() =>
                navigation.navigate("Detail", { id: item.manga_id })
              }
            />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-10">
              <ActivityIndicator color="#EF4444" />
            </View>
          ) : (
            <View className="h-32" />
          )
        }
        ListEmptyComponent={
          !data && (
            <View className="mt-20 items-center">
              <Ionicons name="sad-outline" size={60} color="#3F3F46" />
              <Text className="text-zinc-500 mt-4 font-bold">
                Tidak ada hasil ditemukan
              </Text>
            </View>
          )
        }
      />

      {/* Loading Overlay untuk First Load */}
      {loading && (
        <View className="absolute inset-0 bg-zinc-bg/50 justify-center items-center">
          <ActivityIndicator color="#EF4444" size="large" />
        </View>
      )}

      {/* Modern Filter Sheet */}
      <FilterSheet
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        updateFilter={updateFilter}
        genres={genreList}
        statuses={statuses}
        formats={formats}
      />
    </View>
  );
}

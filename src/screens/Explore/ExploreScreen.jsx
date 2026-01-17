import React, { useEffect, useState } from "react";
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
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

export default function ExploreScreen({ navigation, route }) {
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

  
  useEffect(() => {
    const genreFromNavigation = route.params?.genre;
    if (genreFromNavigation) {
      updateFilter("genres", [genreFromNavigation]);

      navigation.setParams({ genre: undefined });
    }
  }, [route.params?.genre]);

  return (
    <View className="flex-1 bg-[#0F0F12]">
      {/* HEADER SECTION - Samakan dengan style Info/History */}
      <View style={{ paddingTop: insets.top + 40 }} className="px-8 mb-6">
        <Animatable.View animation="fadeIn" duration={800}>
          <View className="flex-row items-center mb-3">
            <View className="h-[2px] w-8 bg-red-600 mr-3" />
            <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
              Discovery
            </Text>
          </View>

          <Text className="text-white text-5xl font-black tracking-tighter leading-[48px] mb-6">
            Explore{"\n"}
            <Text className="text-zinc-700">Manhwa.</Text>
          </Text>

          {/* SEARCH BAR & FILTER BUTTON */}
          <View className="flex-row gap-3 items-center">
            <View className="flex-1 flex-row items-center bg-zinc-900/80 p-4 rounded-[24px] border border-white/5">
              <Ionicons name="search" size={20} color="#71717A" />
              <TextInput
                placeholder="Cari judul..."
                placeholderTextColor="#3F3F46"
                className="flex-1 ml-3 text-white font-bold text-sm"
                value={filters.keyword}
                onChangeText={(text) => updateFilter("keyword", text)}
              />
              {filters.keyword?.length > 0 && (
                <TouchableOpacity onPress={() => updateFilter("keyword", "")}>
                  <Ionicons name="close-circle" size={20} color="#71717A" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              activeOpacity={0.8}
              className="bg-red-600 w-14 h-14 rounded-[22px] justify-center items-center shadow-lg shadow-red-600/30"
            >
              <Ionicons name="options" size={24} color="white" />
              {/* Indicator Badge Modern */}
              {(filters.genres.length > 0 || filters.status) && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full items-center justify-center border-2 border-red-600">
                  <View className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>

      {/* CONTENT LIST */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.manga_id}-${index}`}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          paddingHorizontal: 20,
        }}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            delay={(index % 12) * 50} // Staggered animation hanya untuk yang terlihat
            style={{ width: "33.3%", padding: 6 }}
          >
            <ManhwaCard
              item={item}
              onPress={() =>
                navigation.navigate("Detail", { id: item.manga_id })
              }
            />
          </Animatable.View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-12">
              <ActivityIndicator color="#EF4444" />
            </View>
          ) : (
            <View className="h-32" />
          )
        }
        ListEmptyComponent={
          !loading && (
            <Animatable.View
              animation="fadeIn"
              className="mt-20 items-center px-12"
            >
              <View className="bg-zinc-900/50 p-8 rounded-full mb-6">
                <Ionicons name="search-outline" size={40} color="#3F3F46" />
              </View>
              <Text className="text-white font-black text-xl text-center">
                No Results Found
              </Text>
              <Text className="text-zinc-600 text-center mt-2 font-medium">
                Coba gunakan keyword lain atau reset filter pencarianmu.
              </Text>
            </Animatable.View>
          )
        }
      />

      {/* LOADING OVERLAY */}
      {loading && (
        <View className="absolute inset-0 bg-[#0F0F12]/80 justify-center items-center z-50">
          <ActivityIndicator color="#EF4444" size="large" />
          <Text className="text-zinc-500 font-bold mt-4 tracking-widest uppercase text-[10px]">
            Searching database...
          </Text>
        </View>
      )}

      {/* BOTTOM GRADIENT MASK */}
      <LinearGradient
        colors={["transparent", "#0F0F12"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
        }}
        pointerEvents="none"
      />

      {/* FILTER SHEET */}
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

import React, { memo } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ManhwaCard from "../../components/ManhwaCard";
import ManhwaCardSkeleton from "../../components/ManhwaCardSkeleton";
import { useManhwaByType } from "../../hooks/home";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

// Memoized Card untuk mencegah re-render list yang tidak perlu
const OptimizedCard = memo(({ item, navigation, index }) => (
  <Animatable.View 
    animation="fadeInUp" 
    delay={(index % 9) * 50} 
    style={{ width: '31%', marginBottom: 16 }}
  > 
    <ManhwaCard
      item={item}
      onPress={() => navigation.navigate("Detail", { id: item.manga_id })}
    />
  </Animatable.View>
));

const AllScreen = ({ navigation, route }) => {
  const type = route.params?.type || "all";
  const { data, loading, loadingMore, loadMore, refresh } = useManhwaByType(type);

  const titleMap = {
    "new-update": "Updates",
    "recommendation": "For You",
    "popular": "Popular",
    "complete": "Finished",
    "top": "Top Tier",
  };

  const skeletonData = Array.from({ length: 12 }, (_, i) => ({ id: i }));

  return (
    <View className="flex-1 bg-[#0F0F12]">
      {/* HEADER SECTION */}
      <View className="px-6 pt-14 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              className="bg-zinc-900/80 p-3 rounded-2xl border border-white/5 mr-4"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            
            <View>
              <View className="flex-row items-center">
                <View className="h-[2px] w-4 bg-red-600 mr-2" />
                <Text className="text-red-600 text-[10px] font-black tracking-[2px] uppercase">Browse</Text>
              </View>
              <Text className="text-white text-3xl font-black tracking-tighter">
                {titleMap[type] || "Library"}
              </Text>
            </View>
          </View>

          {/* Opsional: Indikator jumlah jika data sudah ada */}
          {data.length > 0 && (
            <View className="bg-zinc-900 px-3 py-1 rounded-lg border border-white/5">
              <Text className="text-zinc-500 font-bold text-[10px]">{data.length}+</Text>
            </View>
          )}
        </View>
      </View>

      {/* CONTENT */}
      {loading && data.length === 0 ? (
        <View className="flex-row flex-wrap justify-between px-5">
          {skeletonData.map((item) => (
             <View key={item.id} style={{ width: '31%', marginBottom: 16 }}>
                <ManhwaCardSkeleton />
             </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.manga_id.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          
          // Performance Props
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
          removeClippedSubviews={true}

          onRefresh={refresh}
          refreshing={false}

          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          
          renderItem={({ item, index }) => (
            <OptimizedCard item={item} navigation={navigation} index={index} />
          )}

          ListFooterComponent={() => loadingMore && (
            <View className="py-12 items-center">
              <ActivityIndicator color="#EF4444" size="small" />
              <Text className="text-zinc-700 font-black text-[10px] mt-2 tracking-widest uppercase">
                Loading More
              </Text>
            </View>
          )}
        />
      )}

      {/* BOTTOM OVERLAY */}
      <LinearGradient
        colors={['transparent', '#0F0F12']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 }}
        pointerEvents="none"
      />
    </View>
  );
};

export default AllScreen;
import React, { memo } from "react"; // Tambahkan memo
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ManhwaCard from "../../components/ManhwaCard";
import ManhwaCardSkeleton from "../../components/ManhwaCardSkeleton";
import { useManhwaByType } from "../../hooks/home";

const OptimizedCard = memo(({ item, navigation }) => (
  <View style={{ width: '31%', marginBottom: 16 }}> 
    <ManhwaCard
      item={item}
      onPress={() => navigation.navigate("Detail", { id: item.manga_id })}
    />
  </View>
));

const AllScreen = ({ navigation, route }) => {
  const type = route.params?.type || "all";
  const { data, loading, loadingMore, error, loadMore, refresh } = useManhwaByType(type);

  const titleMap = {
    "new-update": "Update Terbaru",
    "recommendation": "Rekomendasi",
    "popular": "Terpopuler",
    "complete": "Tamat",
    "top": "Top Manhwa",
  };

  const skeletonData = Array.from({ length: 12 }, (_, i) => ({ id: i }));

  return (
    <View className="flex-1 bg-zinc-bg">
      <View className="px-6 pt-12 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-zinc-soft p-2 rounded-xl mr-4"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-black italic tracking-tighter">
          {titleMap[type] || "Semua Manhwa"}
        </Text>
      </View>

      {loading && data.length === 0 ? (
        <View className="flex-row flex-wrap justify-between px-4">
          {skeletonData.map((item) => (
             <View key={item.id} style={{ width: '31%' }}>
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          
          initialNumToRender={9}
          maxToRenderPerBatch={9}
          windowSize={5}
          removeClippedSubviews={true}

          onRefresh={refresh}
          refreshing={false}

          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          
          renderItem={({ item }) => (
            <OptimizedCard item={item} navigation={navigation} />
          )}

          ListFooterComponent={() => loadingMore && (
            <View className="py-10 items-center">
              <ActivityIndicator color="#EF4444" size="large" />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AllScreen;
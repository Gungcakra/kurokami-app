import { Text, View } from "react-native";
import { useTop } from "../../hooks/home";
import { FlatList } from "react-native";
import ManhwaCard from "../../components/ManhwaCard";
import ManhwaCardSkeleton from "../../components/ManhwaCardSkeleton";


const TopSection = ({ navigation }) => {
  const { topManhwa, loading, error } = useTop();


  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-end mb-4">
        <View>
          <Text className="text-zinc-text text-2xl font-bold">Teratas</Text>
          <View className="h-1 w-8 bg-primary-600 rounded-full mt-1" />
        </View>
        <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
      </View>

      {error ? (
        <Text className="text-zinc-text">Terjadi kesalahan: {error.message}</Text>
      ) : loading ? (
        <FlatList
          data={Array.from({ length: 9 })}
          renderItem={() => <ManhwaCardSkeleton />}
          keyExtractor={(_, index) => `skeleton-${index}`}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate={0.9}
        />
      ) : (
        <FlatList
          data={topManhwa?.slice(0, 9)}
          renderItem={({ item }) => (
            <ManhwaCard
              item={item}
              isNew={false}
              onPress={() => navigation.navigate('Detail', { id: item.manga_id })}
            />
          )}
          keyExtractor={(item, index) => `${item.manga_id}-${index}`}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate={0.9}
        />
      )}
    </View>
  );
}

export default TopSection;

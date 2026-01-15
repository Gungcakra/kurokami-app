import { Text, TouchableOpacity, View } from "react-native";
import { useTop } from "../../hooks/home";
import { FlatList } from "react-native";
import ManhwaCard from "../../components/ManhwaCard";
import ManhwaCardSkeleton from "../../components/ManhwaCardSkeleton";
import { ScrollView } from "react-native-gesture-handler";

const TopSection = ({ navigation }) => {
  const { topManhwa, loading, error } = useTop();

  return (
    <View
      className="mt-8"
      onTouchStart={() =>
        navigation.getParent()?.setOptions({ swipeEnabled: false })
      }
      onTouchEnd={() =>
        navigation.getParent()?.setOptions({ swipeEnabled: true })
      }
      onMomentumScrollEnd={() =>
        navigation.getParent()?.setOptions({ swipeEnabled: true })
      }
    >
      <View className="flex-row justify-between items-end mb-4">
        <View>
          <View className="flex-row items-center mb-1">
            <View className="h-[2px] w-4 bg-red-600 mr-2" />
            <Text className="text-red-600 text-[10px] font-black tracking-[2px] uppercase">
              Top
            </Text>
          </View>
          <Text className="text-white text-3xl font-black tracking-tighter">
            Teratas
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("All", { type: "top" })}
          className="pb-1"
        >
          <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text className="text-zinc-text">
          Terjadi kesalahan: {error.message}
        </Text>
      ) : loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 9 }).map((_, index) => (
            <ManhwaCardSkeleton key={`skeleton-${index}`} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topManhwa?.slice(0, 9).map((item, index) => (
            <ManhwaCard
              key={`${item.manga_id}-${index}`}
              item={item}
              isNew={false}
              onPress={() =>
                navigation.navigate("Detail", { id: item.manga_id })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TopSection;

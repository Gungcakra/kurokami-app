import { Text, TouchableOpacity, View } from "react-native";
import { useComplete } from "../../hooks/home";
import { FlatList } from "react-native";
import ManhwaCard from "../../components/ManhwaCard";
import ManhwaCardSkeleton from "../../components/ManhwaCardSkeleton";
import { ScrollView } from "react-native-gesture-handler";

const CompleteSection = ({ navigation }) => {
  const { completedManhwa, loading, error } = useComplete();

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-end mb-4">
        <View>
          <View>
            <View className="flex-row items-center mb-1">
              <View className="h-[2px] w-4 bg-red-600 mr-2" />
              <Text className="text-red-600 text-[10px] font-black tracking-[2px] uppercase">
                Complete
              </Text>
            </View>
            <Text className="text-white text-3xl font-black tracking-tighter">
              Tamat
            </Text>
          </View>
          <View className="h-1 w-8 bg-primary-600 rounded-full mt-1" />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("All", { type: "complete" })}
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
          {completedManhwa?.slice(0, 15).map((item) => (
            <ManhwaCard
              key={item.manga_id}
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

export default CompleteSection;

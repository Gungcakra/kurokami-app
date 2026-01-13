import React, { useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { usePopularManhwa } from "../../hooks/home";
import FeaturedCard from "../../components/FeaturesCard";
import MiniCard from "../../components/MiniCard";
import PopularSkeleton from "./PopularSkeleton";

const PopularSection = ({ navigation }) => {
  const { popularManhwa, loading, error } = usePopularManhwa();

  // Mengelompokkan data 1-14 menjadi pasangan untuk kolom atas-bawah
  const pairedData = useMemo(() => {
    if (!popularManhwa || popularManhwa.length <= 1) return [];
    const rest = popularManhwa.slice(1, 15);
    const pairs = [];
    for (let i = 0; i < rest.length; i += 2) {
      pairs.push(rest.slice(i, i + 2));
    }
    return pairs;
  }, [popularManhwa]);

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
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <Text className="text-white text-2xl font-bold tracking-tighter">
            Populer
          </Text>
          <View className="h-1 w-8 bg-primary-600 rounded-full mt-1" />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("All", { type: "popular" })}
          className="pb-1"
        >
          <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: 15, y: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {loading ? (
          <PopularSkeleton />
        ) : (
          popularManhwa?.[0] && (
            <>
              <FeaturedCard
                item={popularManhwa[0]}
                onPress={() =>
                  navigation.navigate("Detail", {
                    id: popularManhwa[0].manga_id,
                  })
                }
              />
              {pairedData.map((pair, index) => (
                <View
                  key={`column-${index}`}
                  className="justify-between"
                  style={{ gap: 12 }}
                >
                  {pair.map((item) => (
                    <MiniCard
                      key={item.manga_id}
                      item={item}
                      index={popularManhwa.indexOf(item)}
                      onPress={() =>
                        navigation.navigate("Detail", { id: item.manga_id })
                      }
                    />
                  ))}
                </View>
              ))}
            </>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default PopularSection;

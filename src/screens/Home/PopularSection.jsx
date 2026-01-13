import React, { useMemo, memo } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { usePopularManhwa } from "../../hooks/home";
import FeaturedCard from "../../components/FeaturesCard";
import MiniCard from "../../components/MiniCard";
import PopularSkeleton from "./PopularSkeleton";

const PopularSection = memo(({ navigation }) => {
  const { popularManhwa, loading } = usePopularManhwa();

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
    <View className="mt-16">
      <View className="flex-row justify-between items-end mb-5 px-2">
        <View>
          <View className="flex-row items-center mb-1">
            <View className="h-[2px] w-4 bg-red-600 mr-2" />
            <Text className="text-red-600 text-[10px] font-black tracking-[2px] uppercase">
              Trending
            </Text>
          </View>
          <Text className="text-white text-3xl font-black tracking-tighter">
            Populer
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("All", { type: "popular" })}
        >
          <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 12 }}
        decelerationRate="fast"
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
                  key={`col-${index}`}
                  className="justify-between py-1"
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
});

export default PopularSection;

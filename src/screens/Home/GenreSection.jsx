import React from "react";
import { Text, View } from "react-native";
import { useGenres } from "../../hooks/home";
import GenreBadge from "../../components/GenreBadge";
import GenreBadgeSkeleton from "../../components/GenreBadgeSkeleton";
import { ScrollView } from "react-native-gesture-handler";

const GenreSection = () => {
  const { genres, loading, error } = useGenres();

  return (
    <View
      className="my-5"
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
      <Text className="text-zinc-text text-2xl font-bold">Genres</Text>
      <ScrollView horizontal>
        <View>
          {loading ? (
            <View className="flex-row flex-wrap mt-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <GenreBadgeSkeleton key={index} />
              ))}
            </View>
          ) : error ? (
            <Text className="text-zinc-text">
              Error loading genres: {error.message}
            </Text>
          ) : (
            <View className="flex-row flex-wrap mt-4">
              {genres.map((genre) => (
                <GenreBadge key={genre.id} genre={genre.name} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default GenreSection;

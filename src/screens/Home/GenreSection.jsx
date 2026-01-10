import React from "react";
import { Text, View } from "react-native";
import { useGenres } from "../../hooks/home";
import GenreBadge from "../../components/GenreBadge";
import GenreBadgeSkeleton from "../../components/GenreBadgeSkeleton";

const GenreSection = () => {
    const { genres, loading, error } = useGenres();

    return (
        <View className="my-5">
            <Text className="text-zinc-text text-2xl font-bold">Genres</Text>
            <View>
            
                {loading ? (
                    <View className="flex-row flex-wrap mt-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <GenreBadgeSkeleton key={index} />
                        ))}
                    </View>
                ) : error ? (
                    <Text className="text-zinc-text">Error loading genres: {error.message}</Text>
                ) : (
                    <View className="flex-row flex-wrap mt-4">
                        {genres.map((genre) => (
                          <GenreBadge key={genre.id} genre={genre.name} />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}
export default GenreSection;
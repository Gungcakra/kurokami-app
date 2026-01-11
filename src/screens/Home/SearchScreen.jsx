import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useSearchManhwa } from '../../hooks/home';
import ManhwaCardSkeleton from '../../components/ManhwaCardSkeleton';
import ManhwaCard from '../../components/ManhwaCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const {
        searchResults,
        loading,
        loadingMore,
        error,
        keyword,
        setKeyword,
        loadMore
    } = useSearchManhwa();

    const renderFooter = () => {
        if (!loadingMore) return <View className="h-20" />;
        return (
            <View className="py-6">
                <ActivityIndicator color="#EF4444" />
            </View>
        );
    };

    return (
        <View style={{ paddingTop: insets.top }} className="flex-1 bg-zinc-bg">
            <View className="items-center w-full py-4">
                <TextInput
                    placeholder="Cari Judul Manhwa..."
                    className="w-11/12 p-4 rounded-2xl bg-zinc-800 text-white border border-white/5"
                    value={keyword}
                    onChangeText={setKeyword}
                    placeholderTextColor="#A1A1AA"
                />
            </View>

            <View className="flex-1 px-2 justify-center">
                {error ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                ) : loading ? (
                    <FlatList
                        key="skeleton-list"
                        data={Array.from({ length: 9 })}
                        renderItem={() => <ManhwaCardSkeleton />}
                        keyExtractor={(_, index) => `skeleton-${index}`}
                        numColumns={3}
                        columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        scrollEnabled={false}
                    />
                ) : !keyword.trim() ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-zinc-500 text-center">Silahkan cari manhwa</Text>
                    </View>
                ) : (
                    <FlatList
                        key="results-list"
                        data={searchResults}
                        keyExtractor={(item, index) => `${item.manga_id}-${index}`}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <ManhwaCard
                                item={item}
                                onPress={() => navigation.navigate('Detail', { id: item.manga_id })}
                            />
                        )}
                        columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                )}
            </View>
        </View>
    );
}

export default SearchScreen;
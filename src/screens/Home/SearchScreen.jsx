import React, { useEffect, useCallback, memo } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, BackHandler } from 'react-native';
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

    // Gunakan memo untuk komponen statis agar tidak re-render
    const renderFooter = useCallback(() => {
        if (!loadingMore) return <View className="h-24" />;
        return (
            <View className="py-6 items-center">
                <ActivityIndicator color="#EF4444" />
            </View>
        );
    }, [loadingMore]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack(); 
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    // Data skeleton yang statis
    const skeletons = Array.from({ length: 12 }, (_, i) => ({ id: `sk-${i}` }));

    return (
        <View style={{ paddingTop: insets.top }} className="flex-1 bg-zinc-bg">
            {/* Header Search */}
            <View className="px-6 py-4">
                <TextInput
                    placeholder="Cari Judul Manhwa..."
                    className="w-full p-4 rounded-2xl bg-zinc-800 text-white border border-white/5 font-bold"
                    value={keyword}
                    onChangeText={setKeyword}
                    placeholderTextColor="#71717A"
                    autoCorrect={false}
                    clearButtonMode="while-editing" // Fitur iOS untuk hapus cepat
                />
            </View>

            <View className="flex-1">
                {error ? (
                    <View className="flex-1 justify-center items-center px-10">
                        <Text className="text-zinc-500 text-center">{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        // Gunakan FlatList tunggal, jangan berganti-ganti antar FlatList
                        data={loading && searchResults.length === 0 ? skeletons : searchResults}
                        keyExtractor={(item) => item.manga_id?.toString() || item.id}
                        numColumns={3}
                        columnWrapperStyle={{ paddingHorizontal: 12, justifyContent: 'flex-start' }}
                        showsVerticalScrollIndicator={false}
                        
                        // Optimasi Performance
                        initialNumToRender={12}
                        maxToRenderPerBatch={12}
                        windowSize={5}
                        removeClippedSubviews={true}
                        
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        
                        renderItem={({ item }) => {
                            if (loading && !item.manga_id) {
                                return (
                                    <View style={{ width: '33.3%', padding: 4 }}>
                                        <ManhwaCardSkeleton />
                                    </View>
                                );
                            }
                            return (
                                <View style={{ width: '33.3%', padding: 4 }}>
                                    <ManhwaCard
                                        item={item}
                                        onPress={() => navigation.navigate('Detail', { id: item.manga_id })}
                                    />
                                </View>
                            );
                        }}
                        
                        ListEmptyComponent={() => !loading && keyword.trim() !== "" && (
                            <View className="mt-20 items-center">
                                <Text className="text-zinc-500 font-bold">Hasil tidak ditemukan</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

export default SearchScreen;
import React, { useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, BackHandler, TouchableOpacity } from 'react-native';
import { useSearchManhwa } from '../../hooks/home';
import ManhwaCardSkeleton from '../../components/ManhwaCardSkeleton';
import ManhwaCard from '../../components/ManhwaCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

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

    const renderFooter = useCallback(() => {
        if (!loadingMore) return <View className="h-24" />;
        return (
            <View className="py-12 items-center">
                <ActivityIndicator color="#EF4444" />
                <Text className="text-zinc-700 font-black text-[10px] mt-2 tracking-[2px]">SEARCHING MORE...</Text>
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

    const skeletons = Array.from({ length: 12 }, (_, i) => ({ id: `sk-${i}` }));

    return (
        <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#0F0F12]">
            {/* Header Search Section */}
            <View className="px-6 py-6">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="mr-4 bg-zinc-900/80 p-2 rounded-xl border border-white/5"
                    >
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-3xl font-black tracking-tighter">Search.</Text>
                </View>

                {/* Modern Input Field */}
                <View className="relative">
                    <View className="absolute left-4 top-4 z-10">
                        <Ionicons name="search" size={20} color={keyword ? "#EF4444" : "#3F3F46"} />
                    </View>
                    <TextInput
                        placeholder="Cari Judul Manhwa..."
                        className="w-full pl-12 pr-12 py-4 rounded-[22px] bg-zinc-900/50 text-white border border-white/[0.05] font-bold text-[15px]"
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholderTextColor="#3F3F46"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        selectionColor="#EF4444"
                    />
                    {keyword.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setKeyword("")}
                            className="absolute right-4 top-4"
                        >
                            <Ionicons name="close-circle" size={20} color="#71717A" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Results Section */}
            <View className="flex-1">
                {error ? (
                    <Animatable.View animation="fadeIn" className="flex-1 justify-center items-center px-10">
                        <Ionicons name="alert-circle-outline" size={40} color="#3F3F46" />
                        <Text className="text-zinc-600 text-center mt-4 font-medium leading-5">{error}</Text>
                    </Animatable.View>
                ) : (
                    <FlatList
                        data={loading && searchResults.length === 0 ? skeletons : searchResults}
                        keyExtractor={(item) => item.manga_id?.toString() || item.id}
                        numColumns={3}
                        columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'flex-start' }}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={12}
                        maxToRenderPerBatch={12}
                        windowSize={7}
                        removeClippedSubviews={true}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        renderItem={({ item, index }) => {
                            const isSkeleton = loading && !item.manga_id;
                            return (
                                <Animatable.View 
                                    animation="fadeInUp" 
                                    delay={isSkeleton ? 0 : (index % 9) * 30}
                                    style={{ width: '33.3%', padding: 6 }}
                                >
                                    {isSkeleton ? (
                                        <ManhwaCardSkeleton />
                                    ) : (
                                        <ManhwaCard
                                            item={item}
                                            onPress={() => navigation.navigate('Detail', { id: item.manga_id })}
                                        />
                                    )}
                                </Animatable.View>
                            );
                        }}
                        ListEmptyComponent={() => !loading && keyword.trim() !== "" && (
                            <Animatable.View animation="fadeIn" className="mt-20 items-center">
                                <View className="bg-zinc-900/50 p-6 rounded-full mb-4">
                                    <Ionicons name="search-outline" size={32} color="#1A1A1F" />
                                </View>
                                <Text className="text-zinc-700 font-black text-lg">No Results Found</Text>
                                <Text className="text-zinc-800 text-xs mt-1 uppercase tracking-widest font-bold">Try different keywords</Text>
                            </Animatable.View>
                        )}
                    />
                )}
            </View>

            {/* Subtle Gradient Bottom */}
            <LinearGradient
                colors={['transparent', '#0F0F12']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}
                pointerEvents="none"
            />
        </View>
    );
}

export default SearchScreen;
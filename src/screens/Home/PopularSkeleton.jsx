import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PopularSkeleton = () => {
    return (
        <View className="mt-8">

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentOffset={{ x: 15, y: 0 }}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                scrollEnabled={false}
            >
                {/* 1. BIG CARD SKELETON */}
                <View
                    style={{ width: width * 0.65, height: 320 }}
                    className="rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden p-5 justify-end"
                >
                    <View className="h-4 w-20 bg-zinc-800 rounded-full mb-3 animate-pulse" />
                    <View className="h-6 w-full bg-zinc-800 rounded-md mb-2 animate-pulse" />
                    <View className="h-6 w-2/3 bg-zinc-800 rounded-md animate-pulse" />
                </View>

                {/* 2. MINI CARDS SKELETON (3 Kolom) */}
                {[1, 2, 3].map((col) => (
                    <View key={col} className="justify-between" style={{ gap: 12 }}>
                        {[1, 2].map((row) => (
                            <View
                                key={`${col}-${row}`}
                                className="flex-row bg-zinc-900/50 rounded-2xl border border-white/5"
                                style={{ width: 220, height: 154 }}
                            >
                                {/* Thumbnail Side */}
                                <View className="w-24 h-full bg-zinc-800 animate-pulse" />

                                {/* Content Side */}
                                <View className="flex-1 p-3 justify-center">
                                    <View className="h-3 w-full bg-zinc-800 rounded mb-2 animate-pulse" />
                                    <View className="h-3 w-3/4 bg-zinc-800 rounded mb-4 animate-pulse" />
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-zinc-800 mr-2" />
                                        <View className="h-3 w-12 bg-zinc-800 rounded animate-pulse" />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default PopularSkeleton;
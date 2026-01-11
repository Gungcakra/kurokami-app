import React, { useState, memo } from 'react';
import { View, FlatList, TouchableOpacity, Text, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useChapterDetail } from '../../hooks/chapter';
import { useManhwaDetail } from '../../hooks/detail';

const { width: windowWidth } = Dimensions.get('window');

const MangaImageItem = memo(({ uri, onPress }) => {
    const [aspectRatio, setAspectRatio] = useState(null);

    return (
        <Pressable onPress={onPress}>
            <Image
                source={uri}
                style={{
                    width: windowWidth,
                    height: aspectRatio ? windowWidth / aspectRatio : windowWidth * 1.5,
                    backgroundColor: '#000',
                }}
                contentFit="contain"
                cachePolicy="memory-disk"
                onLoad={(event) => {
                    const { width, height } = event.source;
                    if (width && height) {
                        setAspectRatio(width / height);
                    }
                }}
            />
        </Pressable>
    );
});

export default function ReadScreen({ navigation, route }) {
    const chapterId = route.params?.chapterId;
    const insets = useSafeAreaInsets();
    const { chapterDetail, loading, error } = useChapterDetail(chapterId);
    const [showControls, setShowControls] = useState(true);
    const { manhwaDetail, loading: loadingDetail } = useManhwaDetail(chapterDetail?.manga_id);

    const toggleControls = () => setShowControls(!showControls);

    if (loading) return (
        <View className="flex-1 bg-black justify-center items-center">
            <ActivityIndicator size="large" color="#EF4444" />
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            <FlatList
                data={chapterDetail?.chapter?.data || []}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={10}
                // Gunakan callback yang stabil
                renderItem={({ item }) => (
                    <MangaImageItem
                        uri={`${chapterDetail.base_url}/${chapterDetail.chapter?.path}/${item}`}
                        onPress={toggleControls}
                    />
                )}
            />

            {/* TOP CONTROLLER */}
            {showControls && (
                <Animatable.View
                    animation="fadeInDown"
                    duration={200}
                    style={{ paddingTop: insets.top + 10 }}
                    className="absolute top-0 left-0 right-0 px-6 pb-6 bg-zinc-bg/90 backdrop-blur-md border-b border-white/5 z-50"
                >
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: chapterDetail?.manga_id })} className="bg-zinc-soft p-2 rounded-full">
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="flex-1 justify-center items-center mx-4">
                            <Text className="text-center">
                                <Text
                                    onPress={() => navigation.navigate('Detail', { id: chapterDetail?.manga_id })}
                                    className="text-white font-black text-lg"
                                >
                                    {manhwaDetail?.title || 'Loading...'}
                                </Text>

                                {/* Bagian statis (Tidak bisa diklik) */}
                                <Text className="text-zinc-500 font-bold text-lg">{' > '}</Text>

                                <Text className="text-red-500 font-bold text-lg">
                                    Chapter {chapterDetail?.chapter_number}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
            )}

            {/* BOTTOM CONTROLLER */}
            {showControls && (
                <Animatable.View
                    animation="fadeInUp"
                    duration={200}
                    style={{ bottom: insets.bottom + 20 }}
                    className="absolute left-6 right-6 bg-zinc-bg/90 backdrop-blur-md px-6 py-4 rounded-[30px] flex-row justify-between items-center border border-white/10 z-50"
                >
                    <TouchableOpacity
                        onPress={() => navigation.replace('Read', { chapterId: chapterDetail.prev_chapter_id })}
                        disabled={!chapterDetail?.prev_chapter_id}
                        className={`${!chapterDetail?.prev_chapter_id ? 'bg-zinc-700 opacity-50' : 'bg-red-600 shadow-lg shadow-red-600/40'} p-2 rounded-full`}
                    >
                        <Ionicons name="chevron-back" size={22} color="white" />
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text className="text-white font-bold text-sm">Chapter {chapterDetail?.chapter_number}</Text>
                        <Text className="text-zinc-muted text-xs font-black uppercase tracking-tighter">Ketuk untuk tampil/sembunyikan menu</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.replace('Read', { chapterId: chapterDetail.next_chapter_id })}
                        disabled={!chapterDetail?.next_chapter_id}
                        className={`${!chapterDetail?.next_chapter_id ? 'bg-zinc-700 opacity-50' : 'bg-red-600 shadow-lg shadow-red-600/40'} p-2 rounded-full`}
                    >
                        <Ionicons name="chevron-forward" size={22} color="white" />
                    </TouchableOpacity>
                </Animatable.View>
            )}
        </View>
    );
}
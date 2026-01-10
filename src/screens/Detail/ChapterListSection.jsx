import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import ChapterListSectionSkeleton from './ChapterListSectionSkeleton';

export const ChapterListSection = ({
    item, navigation, order, setOrder,
    page, setPage, totalPage, search, setSearch, loading
}) => {

    return (
        <Animatable.View animation="fadeInUp" className="px-6 bg-zinc-bg pb-40">
            <View className="flex-row gap-2 mb-6">
                <View className="flex-1 flex-row items-center bg-zinc-soft rounded-2xl px-4 border border-zinc-border">
                    <Ionicons name="search" size={18} color="#71717A" />
                    <TextInput
                        placeholder="Cari nomor chapter..."
                        placeholderTextColor="#71717A"
                        className="flex-1 ml-2 h-12 text-white font-bold"
                        keyboardType="numeric"
                        value={search}
                        onChangeText={(txt) => {
                            setSearch(txt);
                            setPage(1);
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
                    className="bg-red-500 w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-red-500/40"
                >
                    <Ionicons name={order === 'desc' ? "arrow-down" : "arrow-up"} size={22} color="white" />
                </TouchableOpacity>
            </View>


            {loading ? (
                <FlatList
                    data={[...Array(10)]}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    renderItem={() =>
                        <ChapterListSectionSkeleton />
                    }
                />
            ) : (
                item.length > 0 ? (
                    item.map((chapter, index) => (
                        <TouchableOpacity
                            key={chapter.id}
                            testID={`chapter-${chapter.id}`}
                            onPress={() => navigation.navigate('Read', { chapterId: chapter.chapter_id })}
                            className="bg-zinc-elevated p-4 rounded-3xl border border-zinc-border/40 flex-row items-center mb-4"
                        >
                            <Image
                                source={{ uri: chapter.thumbnail_image_url }}
                                className="w-20 h-14 rounded-xl bg-zinc-soft"
                            />
                            <View className="ml-4 flex-1">
                                <Text className="text-white font-black text-lg">Chapter {chapter.chapter_number}</Text>
                                <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-wider">
                                    {new Date(chapter.release_date).toLocaleDateString('id-ID', { weekday: 'long' })}, {' '}{new Date(chapter.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#3F3F46" />
                            {/* {console.log(chapter)} */}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="py-10 items-center">
                        <Text className="text-zinc-muted italic">Chapter tidak ditemukan</Text>
                    </View>
                )
            )}


            {/* PAGINATION NUMBERS */}
            <View className="flex-row justify-center items-center mt-6 gap-2">
                <TouchableOpacity
                    disabled={page === 1}
                    onPress={() => setPage(page - 1)}
                    className={`w-10 h-10 rounded-xl items-center justify-center ${page === 1 ? 'bg-zinc-soft/30' : 'bg-zinc-soft border border-zinc-border'}`}
                >
                    <Ionicons name="chevron-back" size={20} color={page === 1 ? "#3F3F46" : "white"} />
                </TouchableOpacity>

                {/* Logika simpel menampilkan halaman (misal: hal 1, 2, 3) */}
                {[...Array(totalPage)].map((_, i) => {
                    const p = i + 1;
                    // Hanya tampilkan halaman sekitar current page agar tidak kepanjangan
                    if (p === 1 || p === totalPage || (p >= page - 1 && p <= page + 1)) {
                        return (
                            <TouchableOpacity
                                key={p}
                                onPress={() => setPage(p)}
                                className={`w-10 h-10 rounded-xl items-center justify-center ${page === p ? 'bg-red-500' : 'bg-zinc-soft'}`}
                            >
                                <Text className="text-white font-bold">{p}</Text>
                            </TouchableOpacity>
                        );
                    }
                    return null;
                })}

                <TouchableOpacity
                    disabled={page === totalPage}
                    onPress={() => setPage(page + 1)}
                    className={`w-10 h-10 rounded-xl items-center justify-center ${page === totalPage ? 'bg-zinc-soft/30' : 'bg-zinc-soft border border-zinc-border'}`}
                >
                    <Ionicons name="chevron-forward" size={20} color={page === totalPage ? "#3F3F46" : "white"} />
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};
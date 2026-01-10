import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChapterList, useManhwaDetail } from '../../hooks/detail';
import Ionicons from '@expo/vector-icons/Ionicons';

// Import Section yang sudah dipisah
import { DetailSection } from './DetailSection';
import { ChapterListSection } from './ChapterListSection';
import { DetailSectionSkeleton } from './DetailSectionSkeleton';

export default function DetailScreen({ navigation, route }) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { manhwaDetail, loading } = useManhwaDetail(id);
  const chapterData = useChapterList(id);

  if (loading) return (
    <View className="flex-1 bg-zinc-bg justify-center items-center">
      <View className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </View>
  );

  return (
    <View className="flex-1 bg-zinc-bg">
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[]} bounciness={5}>
        {loading ? <DetailSectionSkeleton /> : <DetailSection item={manhwaDetail} navigation={navigation} insets={insets} />}

        <ChapterListSection
          item={chapterData.chapters}
          navigation={navigation}
          order={chapterData.order}
          setOrder={chapterData.setOrder}
          page={chapterData.page}
          setPage={chapterData.setPage}
          totalPage={chapterData.totalPage}
          search={chapterData.search}
          setSearch={chapterData.setSearch}
          loading={chapterData.loading}
        />


      </ScrollView>

      {/* FLOATING ACTION BAR */}
      <View style={{ paddingBottom: insets.bottom + 15 }} className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-zinc-bg/90 backdrop-blur-md border-t border-white/5">
        <View className="flex-row gap-4">
          <TouchableOpacity className="bg-zinc-soft w-14 h-14 rounded-2xl justify-center items-center border border-zinc-border">
            <Ionicons name="bookmark-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-red-600 flex-1 h-14 rounded-2xl flex-row justify-center items-center shadow-lg shadow-red-600/40"
          >
            <Text className="text-white font-black text-base mr-2">BACA SEKARANG</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
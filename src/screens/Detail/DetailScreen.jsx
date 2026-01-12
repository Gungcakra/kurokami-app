import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChapterList, useManhwaDetail } from '../../hooks/detail';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

// Import Section
import { DetailSection } from './DetailSection';
import { ChapterListSection } from './ChapterListSection';
import { DetailSectionSkeleton } from './DetailSectionSkeleton';

export default function DetailScreen({ navigation, route }) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { manhwaDetail, loading } = useManhwaDetail(id);
  const chapterData = useChapterList(id);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Fungsi pembantu untuk Haptics pada Floating Bar
  const handlePress = (type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === 'read') {
      navigation.navigate('Read', { chapterId: manhwaDetail.latest_chapter_id });
    }
  };

  return (
    <View className="flex-1 bg-zinc-bg">
      {/* Gunakan FlatList sebagai pengganti ScrollView.
        Ini akan menangani render ChapterListSection di dalamnya secara efisien.
      */}
      <FlatList
        data={null} // Kita tidak menggunakan data utama FlatList untuk list ini
        ListHeaderComponent={
          <>
            {loading ? (
              <DetailSectionSkeleton />
            ) : (
              <DetailSection 
                item={manhwaDetail} 
                navigation={navigation} 
                insets={insets} 
              />
            )}
            
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
          </>
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FLOATING ACTION BAR */}
      <View 
        style={{ paddingBottom: insets.bottom + 15 }} 
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-zinc-bg/90 backdrop-blur-md border-t border-white/5"
      >
        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            className="bg-zinc-soft w-14 h-14 rounded-2xl justify-center items-center border border-zinc-border"
          >
            <Ionicons name="bookmark-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handlePress('read')}
            activeOpacity={0.9}
            className="bg-red-600 flex-1 h-14 rounded-2xl flex-row justify-center items-center shadow-lg shadow-red-600/40"
          >
            <Text className="text-white font-black text-base mr-2 uppercase">Baca Sekarang</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 
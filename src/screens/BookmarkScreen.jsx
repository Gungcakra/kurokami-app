import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ManhwaCard from '../components/ManhwaCard';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function BookmarkScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-zinc-bg" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4">
        <Text className="text-zinc-text text-2xl font-black">Bookmarks</Text>
      </View>
      {/* Jika kosong, munculkan info */}
      <View className="flex-1 items-center justify-center opacity-20">
        <Ionicons name="bookmark" size={100} color="#71717A" />
        <Text className="text-zinc-text mt-4">Koleksimu masih kosong</Text>
      </View>
    </View>
  );
}
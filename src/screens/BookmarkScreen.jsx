import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ManhwaCard from '../components/ManhwaCard'; // Pastikan komponen ini sudah menggunakan style modern
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function BookmarkScreen() {
  const insets = useSafeAreaInsets();
  
  // Data dummy untuk testing grid
  const bookmarks = []; // Isi dengan data untuk ngetes grid

  return (
    <View className="flex-1 bg-[#0F0F12]">
      {/* HEADER SECTION */}
      <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-6">
        <Animatable.View animation="fadeIn" duration={1000}>
          <View className="flex-row items-center mb-4">
            <View className="h-[2px] w-8 bg-red-600 mr-3" />
            <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
              Personal Library
            </Text>
          </View>
          
          <View className="flex-row justify-between items-end">
            <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
              Koleksi{"\n"}<Text className="text-zinc-700">Tersimpan.</Text>
            </Text>
            <View className="bg-zinc-900 px-4 py-2 rounded-2xl border border-white/5">
                <Text className="text-white font-black text-lg">{bookmarks.length}</Text>
            </View>
          </View>
        </Animatable.View>
      </View>

      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ 
            paddingHorizontal: 20, 
            paddingBottom: insets.bottom + 120 
          }}
          renderItem={({ item, index }) => (
            <Animatable.View 
              animation="fadeInUp" 
              delay={index * 100} 
              style={{ width: (width - 60) / 2, margin: 10 }}
            >
              <ManhwaCard item={item} />
            </Animatable.View>
          )}
        />
      ) : (
        /* MODERN EMPTY STATE */
        <Animatable.View 
          animation="fadeIn" 
          className="flex-1 items-center justify-center px-12"
        >
          <View className="relative">
            <View className="absolute -inset-4 bg-red-600/10 rounded-full blur-2xl" />
            <Ionicons name="bookmark" size={80} color="#1A1A1F" />
          </View>
          
          <Text className="text-white font-black text-xl mt-8 text-center">
            Your Library is Empty
          </Text>
          <Text className="text-zinc-600 text-sm text-center mt-2 leading-5">
            Mulai simpan manhwa favoritmu agar tidak ketinggalan update chapter terbaru.
          </Text>

          <View className="mt-10 h-[1px] w-12 bg-zinc-900" />
        </Animatable.View>
      )}

      {/* FOOTER GRADIENT */}
      <LinearGradient
        colors={['transparent', '#0F0F12']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
        pointerEvents="none"
      />
    </View>
  );
}
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image'; // Menggunakan expo-image agar lebih smooth
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  // Data dummy untuk testing
  const historyData = [
    {
      id: 1,
      title: 'Solo Leveling',
      lastChapter: '179',
      image: 'https://via.placeholder.com/300x450',
      time: '2 jam yang lalu'
    },
    // Tambahkan data lain di sini...
  ];

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* HEADER SECTION */}
        <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-10">
          <Animatable.View animation="fadeIn" duration={1000}>
            <View className="flex-row items-center mb-4">
              <View className="h-[2px] w-8 bg-red-600 mr-3" />
              <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
                Reading Log
              </Text>
            </View>
            
            <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
              Recent{"\n"}<Text className="text-zinc-700">History.</Text>
            </Text>
          </Animatable.View>
        </View>

        {/* LIST SECTION */}
        <View className="px-6">
          {historyData.length > 0 ? (
            historyData.map((item, index) => (
              <Animatable.View 
                key={item.id}
                animation="fadeInUp"
                delay={index * 100}
                className="mb-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  className="bg-zinc-900/40 flex-row items-center p-3 rounded-[28px] border border-white/[0.03]"
                >
                  {/* Image Container */}
                  <View className="relative">
                    <Image 
                      source={{ uri: item.image }} 
                      className="w-20 h-24 rounded-[20px] bg-zinc-800"
                      contentFit="cover"
                      transition={500}
                    />
                    <View className="absolute -bottom-1 -right-1 bg-red-600 px-2 py-0.5 rounded-md border-2 border-[#0F0F12]">
                      <Text className="text-white text-[10px] font-black">HD</Text>
                    </View>
                  </View>

                  {/* Info Container */}
                  <View className="flex-1 ml-5 justify-center">
                    <Text numberOfLines={1} className="text-white font-black text-lg tracking-tight">
                      {item.title}
                    </Text>
                    
                    <View className="flex-row items-center mt-1">
                      <View className="bg-red-500/10 px-2 py-1 rounded-lg flex-row items-center">
                        <Ionicons name="bookmark" size={12} color="#EF4444" />
                        <Text className="text-red-500 font-bold text-[11px] ml-1.5">
                          Chapter {item.lastChapter}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-zinc-600 text-[11px] font-bold uppercase tracking-wider mt-3">
                      <Ionicons name="time-outline" size={10} /> {item.time}
                    </Text>
                  </View>

                  {/* Arrow Action */}
                  <View className="bg-zinc-800/50 p-2 rounded-xl mr-2">
                    <Ionicons name="play" size={16} color="white" />
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            ))
          ) : (
            /* Empty State */
            <View className="items-center justify-center mt-20">
              <Ionicons name="Reader-outline" size={80} color="#1A1A1F" />
              <Text className="text-zinc-700 font-black text-xl mt-4">No History Yet</Text>
            </View>
          )}
        </View>

        {/* FOOTER DECORATION */}
        <View className="mt-20 items-center px-12 opacity-30">
          <View className="h-[1px] w-full bg-zinc-900" />
          <Text className="text-zinc-700 text-[10px] mt-4 font-black tracking-[4px]">
            KUROKAMI LOG SYSTEM
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM GRADIENT MASK */}
      <LinearGradient
        colors={['transparent', '#0F0F12']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
        pointerEvents="none"
      />
    </View>
  );
}
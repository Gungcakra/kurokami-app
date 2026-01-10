import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DetailScreen({ navigation }) {
  return (
    <View className="flex-1 bg-zinc-bg">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="relative h-[400px]">
          <Image 
            source={{ uri: 'https://i.pinimg.com/564x/01/21/53/01215368a5c378e906c11d61a0d33c5e.jpg' }} 
            className="w-full h-full"
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-6 bg-black/50 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="px-6 -mt-10 bg-zinc-bg rounded-t-[40px] pt-8">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-zinc-text text-3xl font-black">Solo Leveling</Text>
              <Text className="text-primary font-bold mt-1 italic text-sm">Chugong • Action, Fantasy</Text>
            </View>
            <TouchableOpacity className="bg-zinc-soft p-3 rounded-2xl border border-zinc-border">
              <Ionicons name="bookmark-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Chapters List */}
          <Text className="text-zinc-text text-xl font-black mt-10 mb-4">Chapters</Text>
          {[180, 179, 178].map((ch) => (
            <TouchableOpacity 
              key={ch}
              onPress={() => navigation.navigate('Read')}
              className="bg-zinc-elevated p-5 rounded-2xl mb-3 flex-row justify-between border border-zinc-border"
            >
              <Text className="text-zinc-text font-bold">Chapter {ch}</Text>
              <Text className="text-zinc-muted text-xs italic">12 Jan 2026</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
import React from 'react';
import { View, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const DetailSectionSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-zinc-bg flex-1">
      {/* 1. HERO IMAGE SKELETON */}
      <View className="h-[550px] w-full bg-zinc-soft/50">
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={1500}
          className="w-full h-full bg-zinc-soft" 
        />
        
        {/* Tombol Back Placeholder */}
        <View 
          style={{ marginTop: insets.top + 10 }} 
          className="absolute top-0 left-6 w-12 h-12 rounded-full bg-zinc-border/30" 
        />
      </View>

      {/* 2. BODY CONTENT SKELETON */}
      <View className="px-6 -mt-20 bg-zinc-bg rounded-t-[45px] pt-10 h-full">
        <View className="items-center">
          {/* Judul Placeholder */}
          <Animatable.View 
            animation="pulse" iterationCount="infinite"
            className="w-3/4 h-8 bg-zinc-soft rounded-xl mb-3" 
          />
          {/* Subtitle Placeholder */}
          <Animatable.View 
            animation="pulse" iterationCount="infinite"
            className="w-1/2 h-4 bg-zinc-soft rounded-lg mb-8" 
          />

          {/* Stats Bar Placeholder */}
          <View className="flex-row gap-6 bg-zinc-soft/30 p-6 rounded-3xl border border-zinc-border/20 w-full justify-center">
            <View className="w-12 h-10 bg-zinc-soft rounded-lg" />
            <View className="w-[1px] h-8 bg-zinc-border" />
            <View className="w-12 h-10 bg-zinc-soft rounded-lg" />
            <View className="w-[1px] h-8 bg-zinc-border" />
            <View className="w-12 h-10 bg-zinc-soft rounded-lg" />
          </View>
        </View>

        {/* Genres Placeholder */}
        <View className="flex-row justify-center mt-8 gap-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="w-20 h-8 bg-zinc-soft rounded-xl" />
          ))}
        </View>

        {/* Sinopsis Placeholder */}
        <View className="mt-10">
          <View className="w-32 h-6 bg-zinc-soft rounded-lg mb-4" />
          <View className="w-full h-4 bg-zinc-soft rounded-lg mb-2" />
          <View className="w-full h-4 bg-zinc-soft rounded-lg mb-2" />
          <View className="w-3/4 h-4 bg-zinc-soft rounded-lg" />
        </View>
      </View>
    </View>
  );
};
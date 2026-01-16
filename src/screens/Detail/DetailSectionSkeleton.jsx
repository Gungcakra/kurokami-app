import React from 'react';
import { View, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const DetailSectionSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View>
      {/* HERO SECTION SKELETON */}
      <View className="relative h-[550px] w-full bg-[#0F0F12]">
        {/* Background blur placeholder */}
        <View className="absolute inset-0 bg-zinc-soft/20" />
        
        {/* Overlay */}
        <View className="absolute inset-0 bg-black/60" />

        {/* Gradient overlay */}
        <View className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F0F12] to-transparent" />

        {/* Floating image skeleton */}
        <View className="absolute inset-0 items-center justify-center pt-10">
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
            className="w-[220px] h-[320px] rounded-2xl border border-white/20 bg-zinc-soft/30"
          />
        </View>

        {/* Back button placeholder */}
        <View
          style={{ marginTop: insets.top + 10 }}
          className="absolute top-0 left-6 z-20"
        >
          <View className="bg-black/40 p-3 rounded-full border border-white/10 w-12 h-12" />
        </View>

        {/* Rank badge skeleton */}
        <View className="absolute bottom-28 right-0 bg-red-600/30 px-4 py-2 rounded-l-full z-10 flex-row items-center gap-2">
          <View className="w-4 h-4 bg-red-600/50 rounded" />
          <View className="w-16 h-3 bg-red-600/50 rounded" />
        </View>
      </View>

      {/* INFO BODY SKELETON */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        className="px-6 -mt-20 bg-[#0F0F12] rounded-t-[45px] pt-10 pb-10"
      >
        <View className="items-center mb-8">
          {/* Title skeleton */}
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
            className="w-3/4 h-8 bg-zinc-soft rounded-lg mb-2"
          />
          {/* Alternative title skeleton */}
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
            className="w-1/2 h-4 bg-zinc-soft/50 rounded mb-6"
          />

          {/* Stats bar skeleton */}
          <View className="flex-row gap-6 bg-zinc-soft/20 p-4 rounded-3xl border border-zinc-border/30 w-full justify-center">
            <View className="items-center">
              <View className="w-12 h-6 bg-zinc-soft rounded mb-1" />
              <View className="w-16 h-3 bg-zinc-soft/50 rounded" />
            </View>
            <View className="w-[1px] h-12 bg-zinc-border/30 self-center" />
            <View className="items-center">
              <View className="w-12 h-6 bg-zinc-soft rounded mb-1" />
              <View className="w-12 h-3 bg-zinc-soft/50 rounded" />
            </View>
            <View className="w-[1px] h-12 bg-zinc-border/30 self-center" />
            <View className="items-center">
              <View className="w-12 h-6 bg-zinc-soft rounded mb-1" />
              <View className="w-12 h-3 bg-zinc-soft/50 rounded" />
            </View>
          </View>

          {/* Tags skeleton */}
          <View className="flex-row flex-wrap justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className="flex-row items-center bg-zinc-soft/20 px-3 py-1.5 rounded-lg border border-zinc-border/30"
              >
                <View className="w-3 h-3 bg-zinc-soft/50 rounded mr-2" />
                <View className="w-16 h-3 bg-zinc-soft/50 rounded" />
              </View>
            ))}
          </View>
        </View>

        {/* Genres skeleton */}
        <View className="flex-row flex-wrap justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="bg-red-500/10 px-4 py-1.5 rounded-xl border border-red-500/20"
            >
              <View className="w-16 h-3 bg-red-500/30 rounded" />
            </View>
          ))}
        </View>

        {/* Synopsis skeleton */}
        <View className="mb-10 px-2">
          <View className="flex-row items-center mb-4">
            <View className="w-1 h-6 bg-red-600 mr-3 rounded-full" />
            <View className="w-20 h-5 bg-zinc-soft rounded" />
          </View>
          <View className="gap-2">
            <View className="w-full h-4 bg-zinc-soft/50 rounded" />
            <View className="w-full h-4 bg-zinc-soft/50 rounded" />
            <View className="w-3/4 h-4 bg-zinc-soft/50 rounded" />
          </View>
        </View>
      </Animatable.View>
    </View>
  );
};
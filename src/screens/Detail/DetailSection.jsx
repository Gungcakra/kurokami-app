import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export const DetailSection = ({ item, insets, navigation }) => {
  return (
    <View>
      {/* HERO IMAGE */}
      <View className="relative h-[550px] w-full">
        <Image
          source={{ uri: item?.cover_portrait_url || item?.cover_image_url }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-zinc-bg via-transparent to-black/30" />

        {/* TOP BAR ACTIONS */}
        <View style={{ marginTop: insets.top + 10 }} className="absolute top-0 left-0 right-0 px-6 flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.navigate('Home')} className="bg-black/40 p-3 rounded-full border border-white/10">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row gap-3">
            <TouchableOpacity className="bg-black/40 p-3 rounded-full border border-white/10"><Ionicons name="share-social-outline" size={22} color="white" /></TouchableOpacity>
            <TouchableOpacity className="bg-black/40 p-3 rounded-full border border-white/10"><Ionicons name="ellipsis-vertical" size={22} color="white" /></TouchableOpacity>
          </View>
        </View>

        <Animatable.View animation="fadeInRight" delay={500} className="absolute bottom-24 right-0 bg-red-600 px-4 py-2 rounded-l-full flex-row items-center">
          <Ionicons name="trophy" size={16} color="white" />
          <Text className="text-white font-black ml-2 text-xs">RANK #{item?.rank}</Text>
        </Animatable.View>
      </View>

      {/* INFO BODY */}
      <Animatable.View animation="fadeInUp" duration={600} className="px-6 -mt-20 bg-zinc-bg rounded-t-[45px] pt-10">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-black text-center leading-tight">{item?.title}</Text>
          <Text className="text-zinc-muted text-sm mt-1 italic opacity-70">{item?.alternative_title}</Text>
          
          <View className="flex-row mt-6 gap-6 bg-zinc-soft/50 p-4 rounded-3xl border border-zinc-border/50">
            <View className="items-center">
              <Text className="text-red-500 font-black text-lg">{item?.user_rate}</Text>
              <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-widest">Rating</Text>
            </View>
            <View className="w-[1px] h-6 bg-zinc-border self-center" />
            <View className="items-center">
              <Text className="text-white font-black text-lg">{(item?.view_count / 1000000).toFixed(1)}M</Text>
              <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-widest">Views</Text>
            </View>
            <View className="w-[1px] h-6 bg-zinc-border self-center" />
            <View className="items-center">
              <Text className="text-white font-black text-lg">{item?.release_year}</Text>
              <Text className="text-zinc-muted text-[10px] uppercase font-bold tracking-widest">Tahun</Text>
            </View>
          </View>
        </View>

        {/* GENRES */}
        <View className="flex-row flex-wrap justify-center mb-8">
          {item?.taxonomy?.Genre?.map((genre) => (
            <View key={genre.taxonomy_id} className="bg-red-500/10 px-4 py-1.5 rounded-xl m-1 border border-red-500/20">
              <Text className="text-red-500 text-[11px] font-bold uppercase">{genre.name}</Text>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-white text-xl font-black mb-3">Sinopsis</Text>
          <Text className="text-zinc-muted leading-6 text-sm text-justify">{item?.description}</Text>
        </View>
      </Animatable.View>
    </View>
  );
};  
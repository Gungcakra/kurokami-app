import React from 'react';
import { View, Image, FlatList, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ReadScreen({ navigation }) {
  const images = [
    { id: '1', url: 'https://via.placeholder.com/800x1200/1A1A1F/EF4444?text=Page+1' },
    { id: '2', url: 'https://via.placeholder.com/800x1200/1A1A1F/EF4444?text=Page+2' },
  ];

  return (
    <View className="flex-1 bg-zinc-secondary">
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} className="w-full h-[600px]" resizeMode="cover" />
        )}
      />

      {/* Floating UI */}
      <View className="absolute bottom-10 left-6 right-6 bg-zinc-elevated/95 p-4 rounded-3xl flex-row justify-between items-center border border-zinc-border shadow-2xl">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-black uppercase tracking-widest">Chapter 180</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
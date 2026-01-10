import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const categories = ['All', 'Action', 'Fantasy', 'Romance', 'School', 'Murim'];

  return (
    <View className="flex-1 bg-zinc-bg" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4">
        <Text className="text-zinc-text text-2xl font-black mb-4">Explore</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-zinc-elevated p-4 rounded-2xl border border-zinc-border">
          <Ionicons name="search" size={20} color="#71717A" />
          <TextInput 
            placeholder="Cari judul manhwa..." 
            placeholderTextColor="#71717A"
            className="flex-1 ml-3 text-zinc-text"
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6">
          {categories.map((cat, i) => (
            <TouchableOpacity 
              key={i} 
              className={`mr-3 px-6 py-2 rounded-full border ${i === 0 ? 'bg-primary border-primary' : 'bg-zinc-soft border-zinc-border'}`}
            >
              <Text className={`font-bold ${i === 0 ? 'text-white' : 'text-zinc-muted'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="mt-10 items-center justify-center">
           <Ionicons name="compass-outline" size={80} color="#2A2A32" />
           <Text className="text-zinc-muted mt-4">Temukan petualangan barumu...</Text>
        </View>
      </View>
    </View>
  );
}   
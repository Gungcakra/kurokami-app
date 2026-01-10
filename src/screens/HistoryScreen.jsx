import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-zinc-bg" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4">
        <Text className="text-zinc-text text-2xl font-black mb-6">History</Text>
        
        {/* History Item */}
        <TouchableOpacity className="flex-row bg-zinc-elevated p-3 rounded-2xl border border-zinc-border mb-4">
          <Image source={{ uri: 'https://via.placeholder.com/100' }} className="w-16 h-20 rounded-lg" />
          <View className="flex-1 ml-4 justify-center">
            <Text className="text-zinc-text font-bold text-lg">Solo Leveling</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="eye" size={12} color="#EF4444" />
              <Text className="text-zinc-muted text-xs ml-1">Terakhir baca: Ch. 179</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
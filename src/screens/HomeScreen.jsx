import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import ManhwaCard from '../components/ManhwaCard';
import Ionicons from '@expo/vector-icons/Ionicons';
const HomeScreen = ({ navigation }) => {
  const dummyData = [
    { id: '1', title: 'Solo Leveling', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Omniscient Reader', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Tower of God', image: 'https://via.placeholder.com/150' },
    // tambahkan lebih banyak data
  ];

  return (
    <View className="flex-1 bg-zinc-bg">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header Section */}
        <View className="py-6 mt-8">
          <Text className="text-zinc-text text-2xl font-bold">Halo, <Text className="text-primary">Membaca Apa Hari Ini?</Text></Text>
        </View>

        {/* Update Terbaru */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-zinc-text text-lg font-bold"> <Ionicons name="refresh" size={20} color="#EF4444" /> Update Terbaru</Text>
          <Text className="text-primary text-xs">Lihat Semua</Text>
        </View>

        <FlatList
          data={dummyData}
          renderItem={({ item }) => (
            <ManhwaCard 
              item={item} 
              onPress={() => navigation.navigate('Detail', { id: item.id })} 
            />
          )}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
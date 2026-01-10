import React from 'react';
import { View, Text, FlatList, ScrollView, Platform } from 'react-native';
import { useManhwa } from '../../hooks/home';
import GenreSection from './GenreSection';
import NewUpdateSection from './NewUpdateSection';
const HomeScreen = ({ navigation }) => {

  return (
    <View className="flex-1 bg-zinc-bg min-h-screen" >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? 200 : 120,
        }}
      >

        <View className="py-6 mt-8">
          <Text className="text-zinc-text text-2xl font-bold">Halo, <Text className="text-primary">Membaca Apa Hari Ini?</Text></Text>
        </View>

        {/* New Updates Section */}
        <NewUpdateSection navigation={navigation} />

        {/* Genre */}
        <GenreSection />
      </ScrollView>
    </View >
  );
};

export default HomeScreen;
import React from 'react';
import { View, Text, FlatList, ScrollView, Platform } from 'react-native';
import { useManhwa } from '../../hooks/home';
import GenreSection from './GenreSection';
import NewUpdateSection from './NewUpdateSection';
import HeaderSection from './HeaderSection';
import RecommendationSection from './RecommendationSection';
import PopularSection from './PopularSection';
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

        {/* Header */}
        <HeaderSection navigation={navigation} />

        {/* Popular Section */}
        <PopularSection navigation={navigation} />

        {/* Recommendation Section */}
        <RecommendationSection navigation={navigation} />

        {/* New Updates Section */}
        <NewUpdateSection navigation={navigation} />

        {/* Genre */}
        <GenreSection />
      </ScrollView>
    </View >
  );
};

export default HomeScreen;
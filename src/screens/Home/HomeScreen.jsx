import React from 'react';
import { View, Text, FlatList, ScrollView, Platform } from 'react-native';
import { useManhwa } from '../../hooks/home';
import GenreSection from './GenreSection';
import NewUpdateSection from './NewUpdateSection';
import HeaderSection from './HeaderSection';
import RecommendationSection from './RecommendationSection';
import PopularSection from './PopularSection';
import TopSection from './TopSection';
import CompleteSection from './CompleteSection';
const HomeScreen = ({ navigation }) => {

  return (
    <View className="flex-1 bg-zinc-bg min-h-screen" >
      {/* Header */}
      <HeaderSection navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4 py-4 mt-20"
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? 140 : 120,
        }}
      >


        {/* Popular Section */}
        <PopularSection navigation={navigation} />

        {/* Recommendation Section */}
        <RecommendationSection navigation={navigation} />

        {/* New Updates Section */}
        <NewUpdateSection navigation={navigation} />

        {/* Genre */}
        <GenreSection />

        {/* Top Section */}
        <TopSection navigation={navigation} />

        {/* Complete Section */}
        <CompleteSection navigation={navigation} />
      </ScrollView>
    </View >
  );
};

export default HomeScreen;
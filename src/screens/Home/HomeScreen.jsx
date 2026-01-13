import React from 'react';
import { View, ScrollView, Platform, StatusBar } from 'react-native';
import HeaderSection from './HeaderSection';
import PopularSection from './PopularSection';
import RecommendationSection from './RecommendationSection';
import NewUpdateSection from './NewUpdateSection';
import GenreSection from './GenreSection';
import TopSection from './TopSection';
import CompleteSection from './CompleteSection';

const HomeScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-[#0F0F12]">
      <StatusBar barStyle="light-content" />
      <HeaderSection navigation={navigation} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4 mt-20"
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        removeClippedSubviews={true} // Optimasi performa memori
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? 140 : 120,
        }}
      >
        <PopularSection navigation={navigation} />
        <RecommendationSection navigation={navigation} />
        <NewUpdateSection navigation={navigation} />
        <GenreSection />
        <TopSection navigation={navigation} />
        <CompleteSection navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
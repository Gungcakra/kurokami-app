import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-zinc-bg items-center justify-center">
      <Animated.View entering={FadeInUp.duration(1000)}>
        <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center shadow-lg shadow-primary">
          <Text className="text-zinc-text text-4xl font-bold italic">M</Text>
        </View>
      </Animated.View>
      <Animated.Text 
        entering={FadeInUp.delay(500).duration(1000)}
        className="text-zinc-text mt-6 text-2xl font-black tracking-widest"
      >
        MANHWA<Text className="text-primary">VERSE</Text>
      </Animated.Text>
    </View>
  );
};

export default WelcomeScreen;
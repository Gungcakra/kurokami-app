import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
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
        <View className="w-44 h-44 bg-primary rounded-3xl items-center justify-center shadow-lg shadow-primary">
          <Image source={require('../../assets/logo.png')} className="w-44 h-44" />
        </View>
      </Animated.View>
      <Animated.Text 
        entering={FadeInUp.delay(500).duration(1000)}
        className="text-zinc-text mt-6 text-2xl font-black tracking-widest"
      >
        <Text className="text-primary-400">KUROKAMI</Text>
      </Animated.Text>
    </View>
  );
};

export default WelcomeScreen;
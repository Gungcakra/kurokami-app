import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3; // Menghitung 3 kolom dengan padding

const ManhwaCard = ({ item, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={{ width: cardWidth }}
      className="mb-4"
    >
      <Animated.View style={animatedStyle}>
        <View className="bg-zinc-soft rounded-lg overflow-hidden border border-zinc-elevated">
          <Image 
            source={{ uri: item.image }} 
            className="w-full aspect-[3/4]"
            resizeMode="cover"
          />
          <View className="p-2">
            <Text className="text-zinc-text text-xs font-bold" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-zinc-muted text-[10px] mt-1 italic">
              {item.type || 'Manhwa'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ManhwaCard;
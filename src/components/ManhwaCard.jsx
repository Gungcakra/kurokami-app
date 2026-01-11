  import React from 'react';
  import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
  import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 3;

  const ManhwaCard = ({ item, onPress, isNew = false }) => {
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
        className="m-1"
      >
        <Animated.View style={animatedStyle}>
          <View className="relative bg-zinc-900 rounded-xl overflow-hidden  shadow-lg">
            {isNew && (
              <View className="absolute top-0 left-0 bg-blue-600 px-3 py-1.5 rounded-br-xl z-10">
                <Text className="text-white text-xs font-bold">New</Text>
              </View>
            )}
            <Image
              source={{ uri: item.cover_image_url ?? item.cover_portrait_url }}
              className="w-full aspect-[3/4]"
              resizeMode="cover"
            />
            <View className="p-3 bg-gradient-to-t from-zinc-950 to-transparent min-h-24"> 
              <Text className="text-white text-md font-semibold" numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text className="text-primary-400 text-sm mt-2 font-bold">
                Chapter {item.latest_chapter_number}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  export default ManhwaCard;
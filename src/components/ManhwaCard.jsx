import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Ionicon from '@expo/vector-icons/Ionicons';
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3;

const ManhwaCard = ({ item, onPress, isNew = false }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const SouthKoreaFlag = (
    <Svg width="20" height="13.3" viewBox="0 0 18 12">
      <Rect width="18" height="12" fill="#fff" />
      <Circle cx="9" cy="6" r="3" fill="#cd2e3a" />
      <Path d="M6,6a1.5,1.5 0 0,0 3,0a1.5,1.5 0 0,1 3,0a3,3 0 0,1 -6,0" fill="#0047a0" />
      <G transform="translate(9,6) rotate(-33.69)">
        <G transform="translate(-4.5,0)">
          <Rect x={-0.125} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={-0.5} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={0.25} y={-1.5} width={0.25} height={3} fill="#000" />
        </G>
        <G transform="rotate(67.38) translate(-4.5,0)">
          <Rect x={-0.125} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={-0.5} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={0.25} y={-1.5} width={0.25} height={3} fill="#000" />
        </G>
        <G transform="rotate(112.62) translate(-4.5,0)">
          <Rect x={-0.125} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={-0.5} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={0.25} y={-1.5} width={0.25} height={3} fill="#000" />
          <Path d="M-0.6,0H0.6" stroke="#fff" strokeWidth={0.2} />
        </G>
        <G transform="rotate(180) translate(-4.5,0)">
          <Rect x={-0.125} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={-0.5} y={-1.5} width={0.25} height={3} fill="#000" />
          <Rect x={0.25} y={-1.5} width={0.25} height={3} fill="#000" />
          <Path d="M-0.6,-0.6H0.6M-0.6,0.6H0.6" stroke="#fff" strokeWidth={0.2} />
        </G>
      </G>
    </Svg>
  );

  const JapanFlag = (
    <Svg width="20" height="13.3" viewBox="0 0 30 20">
      <Rect width="30" height="20" fill="#fff" />
      <Circle cx="15" cy="10" r="6" fill="#bc002d" />
    </Svg>
  );

  const ChinaFlag = (
    <Svg width="20" height="13.3" viewBox="0 0 30 20">
      <Rect width="30" height="20" fill="#ee1c25" />
      {/* Star points calculation simplified for inline */}
      <Path d="M5,2.5 L5.58,4.32 L7.37,4.32 L5.92,5.43 L6.48,7.25 L5,6.13 L3.51,7.25 L4.07,5.43 L2.62,4.32 L4.41,4.32 Z" fill="#ffde00" />
      {/* Small stars positions can be added here with similar Path or G */}
    </Svg>
  );


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
        <View className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg">
          {isNew && (
            <View className="absolute top-0 left-0 bg-blue-600 px-3 py-1.5 rounded-br-xl z-10">
              <Text className="text-white text-xs font-bold">New</Text>
            </View>
          )}
          <View className="absolute top-0 right-0 px-3 py-1.5 rounded-br-xl z-10">
            {(item.country_id === 'KR' || item.country_id === 'kr') && SouthKoreaFlag}
            {(item.country_id === 'CN' || item.country_id === 'cn') && ChinaFlag}
            {(item.country_id === 'JP' || item.country_id === 'jp') && JapanFlag}
          </View>
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
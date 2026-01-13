import React, { memo } from 'react'; // Wajib memo
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image'; // Ganti ke expo-image
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3;

const SouthKoreaFlag = (
  <Svg width="16" height="11" viewBox="0 0 18 12">
    <Rect width="18" height="12" fill="#fff" />
    <Circle cx="9" cy="6" r="3" fill="#cd2e3a" />
    <Path d="M6,6a1.5,1.5 0 0,0 3,0a1.5,1.5 0 0,1 3,0a3,3 0 0,1 -6,0" fill="#0047a0" />
 
  </Svg>
);

const JapanFlag = (
  <Svg width="16" height="11" viewBox="0 0 30 20">
    <Rect width="30" height="20" fill="#fff" />
    <Circle cx="15" cy="10" r="6" fill="#bc002d" />
  </Svg>
);

const ChinaFlag = (
  <Svg width="16" height="11" viewBox="0 0 30 20">
    <Rect width="30" height="20" fill="#ee1c25" />
    <Path d="M5,2.5 L5.58,4.32 L7.37,4.32 L5.92,5.43 L6.48,7.25 L5,6.13 L3.51,7.25 L4.07,5.43 L2.62,4.32 L4.41,4.32 Z" fill="#ffde00" />
  </Svg>
);

const ManhwaCard = memo(({ item, onPress, isNew = false }) => {
  
  const renderFlag = () => {
    const code = item.country_id?.toLowerCase();
    if (code === 'kr') return SouthKoreaFlag;
    if (code === 'cn') return ChinaFlag;
    if (code === 'jp') return JapanFlag;
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7} 
      onPress={onPress}
      style={{ width: cardWidth }}
      className="m-1"
    >
      <View className="relative bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
        {isNew && (
          <View className="absolute top-0 left-0 bg-blue-600 px-2 py-1 rounded-br-lg z-10">
            <Text className="text-white text-[10px] font-black italic">NEW</Text>
          </View>
        )}

        <View className="absolute top-1 right-1 z-10 opacity-90 shadow-sm">
          {renderFlag()}
        </View>

        <Image
          source={{ uri: item.cover_image_url ?? item.cover_portrait_url }}
          style={{ width: '100%', aspectRatio: 3/4 }}
          contentFit="cover"
          transition={200} 
          cachePolicy="memory-disk"
        />

        <View className="p-2 bg-zinc-900">
          <Text 
            className="text-white text-[11px] font-bold leading-4 h-8" 
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text className="text-red-500 text-[10px] mt-1 font-black">
            Chapter {item.latest_chapter_number}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prev, next) => {
  return prev.item.manga_id === next.item.manga_id && 
         prev.item.latest_chapter_number === next.item.latest_chapter_number;
});

export default ManhwaCard;
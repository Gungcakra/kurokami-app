import React, { memo } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 3;

// Bendera dikelompokkan dalam objek untuk kerapihan
const Flags = {
  kr: (
    <Svg width="14" height="10" viewBox="0 0 18 12">
      <Rect width="18" height="12" fill="#fff" rx="2" />
      <Circle cx="9" cy="6" r="3" fill="#cd2e3a" />
      <Path
        d="M6,6a1.5,1.5 0 0,0 3,0a1.5,1.5 0 0,1 3,0a3,3 0 0,1 -6,0"
        fill="#0047a0"
      />
    </Svg>
  ),
  jp: (
    <Svg width="14" height="10" viewBox="0 0 30 20">
      <Rect width="30" height="20" fill="#fff" rx="2" />
      <Circle cx="15" cy="10" r="6" fill="#bc002d" />
    </Svg>
  ),
  cn: (
    <Svg width="14" height="10" viewBox="0 0 30 20">
      <Rect width="30" height="20" fill="#ee1c25" rx="2" />
      <Path
        d="M5,2.5 L5.58,4.32 L7.37,4.32 L5.92,5.43 L6.48,7.25 L5,6.13 L3.51,7.25 L4.07,5.43 L2.62,4.32 L4.41,4.32 Z"
        fill="#ffde00"
      />
    </Svg>
  ),
};

const ManhwaCard = memo(
  ({ item, onPress, isNew = false }) => {
    const renderFlag = () => {
      const code = item.country_id?.toLowerCase();
      return Flags[code] || null;
    };

    const formatViewCount = (count) => {
      if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
      if (count >= 1000) return (count / 1000).toFixed(1) + "K";
      return count.toString();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{ width: cardWidth }}
        className="m-1"
      >
        <View className="relative bg-[#1A1A1F] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
          {isNew && (
            <View className="absolute top-0 left-0 bg-blue-600 px-2 py-0.5 rounded-tl-lg rounded-br-lg z-20 shadow-lg">
              <Text className="text-white text-xs font-black tracking-tighter">
                NEW
              </Text>
            </View>
          )}

          <View className="absolute top-2 right-2 z-20 ">
            {renderFlag()}
          </View>

          <View className="relative">
            <Image
              source={{ uri: item.cover_image_url ?? item.cover_portrait_url }}
              style={{ width: "100%", aspectRatio: 3 / 4.2 }}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />

            <LinearGradient
              colors={["transparent", "rgba(15,15,18,0.5)", "#0F0F12"]}
              className="absolute bottom-0 left-0 right-0 h-16"
            />
          </View>

          {/* Content Section */}
          <View className="p-2.5 bg-[#0F0F12]">
            <Text
              className="text-zinc-100 text-sm font-black leading-[14px] h-[28px]"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <View className="flex-row items-center mt-1.5 justify-between">
              <View className="bg-zinc-900 px-1.5 py-0.5 rounded-md border border-white/5">
                <Text className="text-red-500 text-xs font-black italic">
                  CH. {item.latest_chapter_number}
                </Text>
              </View>

              {item.view_count && (
                <View className="flex-row items-center">
                  <Ionicons
                    name="eye"
                    size={10}
                    color="#ffffff"
                    className="mr-1"
                  />
                  <Text className="text-white text-xs font-bold">
                    {formatViewCount(item.view_count)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    // Hanya re-render jika ID atau chapter berubah
    return (
      prev.item.manga_id === next.item.manga_id &&
      prev.item.latest_chapter_number === next.item.latest_chapter_number
    );
  }
);

export default ManhwaCard;

import { Image, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FeaturedCard = ({ item, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.9}
    style={{ width: width * 0.65, height: 320 }}
    className="rounded-3xl overflow-hidden bg-zinc-900 border border-white/10"
  >
    <Image 
      source={{ uri: item.cover_image_url ?? item.cover_portrait_url }} 
      className="absolute inset-0 w-full h-full"
      resizeMode="cover"
    />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
      className="absolute inset-0 justify-end p-5"
    >
      <View className="bg-primary-600 self-start px-3 py-1 rounded-full mb-2">
        <Text className="text-white text-[10px] font-black uppercase">Trending #1</Text>
      </View>
      <Text className="text-white text-xl font-black leading-tight" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className="text-red-500 font-bold mt-1 text-sm">
        Chapter {item.latest_chapter_number}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default FeaturedCard;
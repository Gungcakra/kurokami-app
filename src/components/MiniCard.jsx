import { Image, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import ini wajib

const MiniCard = ({ item, onPress, index }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="flex-row bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5"
        style={{ width: 220, height: 154 }}
    >
        
        <View className="absolute top-0 left-0 bg-primary-600 px-3 py-1.5 rounded-br-xl z-20">
            <Text className="text-white text-xs font-bold"># {index + 1}</Text>
        </View>

        
        <View className="w-24 h-full relative">
            <Image
                source={{ uri: item.cover_image_url ?? item.cover_portrait_url }}
                className="w-full h-full"
                resizeMode="cover"
            />
            
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className="absolute inset-0"
            />
        </View>


        <View className="flex-1 p-3 justify-start">
            <Text className="text-white font-bold text-sm" numberOfLines={2}>
                {item.title}
            </Text>
            <View className="flex-row items-center mt-2">
                <View className="w-1.5 h-1.5 rounded-full bg-primary-600 mr-2" />
                <Text className="text-zinc-400 text-[11px] font-bold">
                    Chapter {item.latest_chapter_number}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default MiniCard;
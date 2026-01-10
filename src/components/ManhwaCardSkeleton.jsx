import React from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3;

const ManhwaCardSkeleton = () => {
    const opacity = useSharedValue(0.3);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    React.useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true
        );
    }, []);

    return (
        <View style={{ width: cardWidth }} className="mb-4">
            <Animated.View style={animatedStyle}>
                <View className="bg-zinc-soft rounded-lg overflow-hidden border border-zinc-elevated">
                    <View className="w-full aspect-[3/4] bg-zinc-elevated" />
                    <View className="p-2 min-h-20">
                        <View className="h-4 bg-zinc-elevated rounded mb-2" />
                        <View className="h-3 bg-zinc-elevated rounded w-1/2" />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default ManhwaCardSkeleton;
import React from 'react';
import { View } from 'react-native';

const GenreBadgeSkeleton = () => {
    return (
        <View className="bg-zinc-800 px-4 py-2 rounded-full mr-2 mb-3 border border-zinc-700 animate-pulse">
            <View className="h-5 w-20 bg-zinc-700 rounded" />
        </View>
    );
}

export default GenreBadgeSkeleton;